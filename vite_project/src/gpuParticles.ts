import basicInstanced from './shaders/basic.instanced.vert.wgsl?raw'
import positionFrag from './shaders/position.frag.wgsl?raw'
import positionCompute from './shaders/compute.position.wgsl?raw'
import * as box from './util/box'
import { getModelViewMatrix, getProjectionMatrix } from './util/math'

// URL 파라미터를 가져와서 wsd(풍속) 값을 설정
const urlParams = new URLSearchParams(window.location.search);
const wsdData: number = parseFloat(urlParams.get('wsd')!) ;
var wsd: GLfloat;
if (wsdData < 4) {
    wsd = 4;
} else if (wsdData >= 4 && wsdData < 9) {
    wsd = 5;
} else if (wsdData >= 9 && wsdData < 14) {
    wsd = 6;
} else {
    wsd = 7;
}

// vec(풍향) 파라미터를 기반으로 방향 값을 설정
const vecData: number = parseInt(urlParams.get('vec')!) ;
const angleRanges = ["N-NE", "NE-E", "E-SE", "SE-S", "S-SW", "SW-W", "W-NW", "NW-N"];
const angleIndex = Math.floor(((vecData % 360) + 360) % 360 / 45);
const vec: string = angleRanges[angleIndex];

// pm10(미세먼지 지수) 값을 기반으로 NUM 값을 설정
const pm10Data: number = parseInt(urlParams.get('pm10')!) ;
var NUM = 0, MAX = 50000
if (pm10Data <= 30) {
    NUM = 20000;
} else if (pm10Data <= 80) {
    NUM = 30000;
} else if (pm10Data <= 150) {
    NUM = 40000;
} else {
    NUM = 50000;
}
// console.log("NUM:", NUM);

// WebGPU 초기화
async function initWebGPU(canvas: HTMLCanvasElement) {
    if(!navigator.gpu)
        throw new Error('Not Support WebGPU')
    const adapter = await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance'
    })
    if (!adapter)
        throw new Error('No Adapter Found')
    const device = await adapter.requestDevice({
        requiredLimits: {
            maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize
        }
    })
    const context = canvas.getContext('webgpu') as GPUCanvasContext
    const format = navigator.gpu.getPreferredCanvasFormat()
    const devicePixelRatio = window.devicePixelRatio || 1
    canvas.width = canvas.clientWidth * devicePixelRatio
    canvas.height = canvas.clientHeight * devicePixelRatio
    const size = {width: canvas.width, height: canvas.height}
    context.configure({
        device, format,
        alphaMode: 'opaque'
    })
    return {device, context, format, size}
}

// 파이프라인 초기화
async function initPipeline(device: GPUDevice, format: GPUTextureFormat, size:{width:number, height:number}) {
    const renderPipeline = await device.createRenderPipelineAsync({
        label: 'Basic Pipline',
        layout: 'auto',
        vertex: {
            module: device.createShaderModule({
                code: basicInstanced,
            }),
            entryPoint: 'main',
            buffers: [{
                arrayStride: 8 * 4, // 3 position 2 uv,
                attributes: [
                    {
                        // position
                        shaderLocation: 0,
                        offset: 0,
                        format: 'float32x3',
                    },
                    {
                        // normal
                        shaderLocation: 1,
                        offset: 3 * 4,
                        format: 'float32x3',
                    },
                    {
                        // uv
                        shaderLocation: 2,
                        offset: 6 * 4,
                        format: 'float32x2',
                    }
                ]
            }]
        },
        fragment: {
            module: device.createShaderModule({
                code: positionFrag,
            }),
            entryPoint: 'main',
            targets: [
                {
                    format: format
                }
            ]
        },
        primitive: {
            topology: 'triangle-list',
            cullMode: 'back'
        },
        depthStencil: {
            depthWriteEnabled: true,
            depthCompare: 'less',
            format: 'depth24plus',
        }
    } as GPURenderPipelineDescriptor)
    const depthTexture = device.createTexture({
        size, format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
    })
    const depthView = depthTexture.createView()
    const computePipeline = await device.createComputePipelineAsync({
        layout: 'auto',
        compute: {
            module: device.createShaderModule({
                code: positionCompute
            }),
            entryPoint: 'main'
        }
    })

    // 버퍼 생성 및 초기화
    const vertexBuffer = device.createBuffer({
        label: 'GPUBuffer store vertex',
        size: box.vertex.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    })
    device.queue.writeBuffer(vertexBuffer, 0, box.vertex)
    const indexBuffer = device.createBuffer({
        label: 'GPUBuffer store index',
        size: box.index.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
    })
    device.queue.writeBuffer(indexBuffer, 0, box.index)
    
    const modelBuffer = device.createBuffer({
        label: 'GPUBuffer store MAX model matrix',
        size: 4 * 4 * 4 * MAX, // mat4x4 x float32 x MAX
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    })
    const projectionBuffer = device.createBuffer({
        label: 'GPUBuffer store camera projection',
        size: 4 * 4 * 4, // mat4x4 x float32
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })
    const mvpBuffer = device.createBuffer({
        label: 'GPUBuffer store MAX MVP',
        size: 4 * 4 * 4 * MAX, // mat4x4 x float32 x MAX
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    })
    const velocityBuffer = device.createBuffer({
        label: 'GPUBuffer store MAX velocity',
        size: 4 * 4 * MAX, // 4 position x float32 x MAX
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    })
    const inputBuffer = device.createBuffer({
        label: 'GPUBuffer store input vars',
        size: 7 * 4, // float32 * 7
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    })

    // 바인드 그룹 생성
    const renderGroup = device.createBindGroup({
        label: 'Group for renderPass',
        layout: renderPipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: mvpBuffer
                }
            }
        ]
    })
    const computeGroup = device.createBindGroup({
        label: 'Group for computePass',
        layout: computePipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: inputBuffer
                }
            },
            {
                binding: 1,
                resource: {
                    buffer: velocityBuffer
                }
            },
            {
                binding: 2,
                resource: {
                    buffer: modelBuffer
                }
            },
            {
                binding: 3,
                resource: {
                    buffer: projectionBuffer
                }
            },
            {
                binding: 4,
                resource: {
                    buffer: mvpBuffer
                }
            }
        ]
    })
    return {
        renderPipeline, computePipeline,
        vertexBuffer, indexBuffer, 
        modelBuffer, projectionBuffer, inputBuffer, velocityBuffer,
        renderGroup, computeGroup,
        depthTexture, depthView
    }
}

function draw(
    device: GPUDevice, 
    context: GPUCanvasContext,
    pipelineObj: {
        renderPipeline: GPURenderPipeline,
        computePipeline: GPUComputePipeline,
        vertexBuffer: GPUBuffer,
        indexBuffer: GPUBuffer,
        renderGroup: GPUBindGroup,
        computeGroup: GPUBindGroup,
        depthView: GPUTextureView
    }
) {
    const commandEncoder = device.createCommandEncoder()
    const computePass = commandEncoder.beginComputePass()
    computePass.setPipeline(pipelineObj.computePipeline)
    computePass.setBindGroup(0, pipelineObj.computeGroup)
    computePass.dispatchWorkgroups(Math.ceil(NUM / 128))
    computePass.end()

    const passEncoder = commandEncoder.beginRenderPass({
        colorAttachments: [
            {
                view: context.getCurrentTexture().createView(),
                clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
                loadOp: 'clear',
                storeOp: 'store'
            }
        ],
        depthStencilAttachment: {
            view: pipelineObj.depthView,
            depthClearValue: 1.0,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
        }
    })
    passEncoder.setPipeline(pipelineObj.renderPipeline)
    passEncoder.setVertexBuffer(0, pipelineObj.vertexBuffer)
    passEncoder.setIndexBuffer(pipelineObj.indexBuffer, 'uint16')
    passEncoder.setBindGroup(0, pipelineObj.renderGroup)
    passEncoder.drawIndexed(box.indexCount, NUM)
    passEncoder.end()
    device.queue.submit([commandEncoder.finish()])
}

async function run(){
    const canvas = document.querySelector('canvas')
    if (!canvas)
        throw new Error('No Canvas')
    
    const {device, context, format, size} = await initWebGPU(canvas)
    const pipelineObj = await initPipeline(device, format, size)
    
    const inputArray = new Float32Array([NUM, -500, 500, -200, 200, -500, 500]) // count, xmin/max, ymin/max, zmin/max
    const modelArray = new Float32Array(MAX * 4 * 4)
    const velocityArray = new Float32Array(MAX * 4)

    for (let i = 0; i < MAX; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = Math.random() * 1000;
        
        const x = 500;
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(theta);
        
        const modelMatrix = getModelViewMatrix({ x, y, z }, { x: 0, y: 0, z: 0 }, { x: 2, y: 2, z: 2 });
        modelArray.set(modelMatrix, i * 4 * 4);
    
        const speed = Math.random() * (wsd*2) - wsd;
        const velocity = {
            "N-NE": { vx: 0, vy: speed, vz: speed },
            "NE-E": { vx: speed, vy: 0, vz: speed },
            "E-SE": { vx: speed, vy: -speed, vz: 0 },
            "SE-S": { vx: 0, vy: -speed, vz: -speed },
            "S-SW": { vx: -speed, vy: 0, vz: -speed },
            "SW-W": { vx: -speed, vy: speed, vz: 0 },
            "W-NW": { vx: -speed, vy: speed, vz: 0 },
            "NW-N": { vx: 0, vy: speed, vz: 0 },
        }[vec] || { vx: 0, vy: 0, vz: 0 };
    
        velocityArray[i * 4 + 0] = velocity.vx;
        velocityArray[i * 4 + 1] = velocity.vy;
        velocityArray[i * 4 + 2] = velocity.vz;
    
        velocityArray[i * 4 + 3] = Math.sin(theta) * Math.cos(phi) * speed;
    }
    
    device.queue.writeBuffer(pipelineObj.velocityBuffer, 0, velocityArray)
    device.queue.writeBuffer(pipelineObj.modelBuffer, 0, modelArray)
    device.queue.writeBuffer(pipelineObj.inputBuffer, 0, inputArray)
    
    const camera = {x:0, y: 50, z: 1000}
    let aspect = size.width / size.height
    function frame(){
        const projectionMatrix = getProjectionMatrix(aspect, 60 / 180 * Math.PI, 0.1, 3000, camera)
        device.queue.writeBuffer(pipelineObj.projectionBuffer, 0, projectionMatrix)
        draw(device, context, pipelineObj)
        requestAnimationFrame(frame)
    }
    frame()

    window.addEventListener('resize', ()=>{
        size.width = canvas.width = canvas.clientWidth * devicePixelRatio
        size.height = canvas.height = canvas.clientHeight * devicePixelRatio
        pipelineObj.depthTexture.destroy()
        pipelineObj.depthTexture = device.createTexture({
            size, format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        })
        pipelineObj.depthView = pipelineObj.depthTexture.createView()
        aspect = size.width/ size.height
    })

    const range = document.querySelector('input') as HTMLInputElement
    if(range!=null) {
        range.max = MAX.toString()
        range.value = NUM.toString();
        range.addEventListener('input', (e:Event)=>{
            NUM = +(e.target as HTMLInputElement).value
            const span = document.querySelector('#num') as HTMLSpanElement
            span.innerHTML = NUM.toString()
            inputArray[0] = NUM
            device.queue.writeBuffer(pipelineObj.inputBuffer, 0, inputArray)
            draw(device, context, pipelineObj);
        })
    }
}
run()