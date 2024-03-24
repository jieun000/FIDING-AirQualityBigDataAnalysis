from camera import VideoCamera
from flask import Flask, jsonify, request, Response
def gen(camera):
    while True:
        print('카메라함수실행 1) ')
        frame = camera.get_frame()
        print('카메라함수실행 2) ',frame[0])
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/api/video_feed')
def video_feed():
    print('비디오 함수실행')
    return Response(gen(VideoCamera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')