import React, { Component,useState  } from 'react';
import ChatBot from 'react-simple-chatbot'; 
import { ThemeProvider } from 'styled-components';
import './chatbot.css';

class MultiPartMessage extends Component {
    render() {
      const { step } = this.props;
    //   console.log('Step:', step); 
  
      let message;
      if (step.id === '1단계') {
        message = (
          <div>
            <p><strong>대응요령 1단계 고농도 발생!</strong></p>
            <p>1. 가급적 외출 자제하기</p>
            <p>2. 외출시 보건용 마스크 착용하기</p>
            <p>3. 외출시 대기오염이 심한 도로변, 공사장은 피하고 활동량 줄이기</p>
            <p>4. 대기오염 유발행위 자제하기(대중교통 이용 등)</p>
          </div>
        );
      } else if (step.id === '2단계') {
        message = (
          <div>
            <p><strong>대응요령 2단계 비상저감조치 발령!</strong></p>
            <p>1. 미세먼지 농도 수시 확인</p>
            <p>2. TV방송(기상예보) 미세먼지 확인</p>
            <p>3. 차량 2부제 대비 교통수단 점검하기</p>
            <p>4. 보건용 마스크(KF80, KF94, KF99) 준비하기</p>
          </div>
        );
      } else if (step.id === '3단계') {
        message = (
          <div>
            <p><strong>대응요령 3단계 비상저감조치 시행!</strong></p>
            <p>1. 홀수날에는 홀수 차량이, 짝수날에는 짝수 차량이 운행</p>
            <p>2. 서울시 공공기관 주차장 폐쇄,</p>
            <p>체육, 문화, 의료시설 주차장은 차량 2부제(인천, 경기 자율참여)</p>
          </div>
        );
      } else if (step.id === '4단계') {
        message = (
          <div>
            <p><strong>대응요령 4단계 주의보 발령!</strong></p>
            <br/>
            <p style={{color:"green"}}><strong>🍀 영유아,학생,어르신</strong></p>
            <p>1. 실외수업(활동) 단축 또는 금지</p>
            <p>2. 이용시설 내 기계, 기구류 세척 등 식당 위생관리 강화</p>
            <p style={{color:"green"}}><strong>🍀 일반 국민</strong></p>
            <p>1. 가급적 외출 자제하기</p>
            <p>2. 외출시 보건용 마스크 착용하기</p>
            <p>3. 외출시 대기오염이 심한 도로변, 공사장은 피하고 활동량 줄이기</p>
            <p>4. 대기오염 유발행위 자제하기(대중교통 이용 등)</p>
            <p>😷 마스크 착용 시 호흡이 불편할 경우 사용을 중지하고 전문가 상담 필요</p>
          </div>
        );
        } else if (step.id === '5단계') {
          message = (
            <div>
              <p><strong>대응요령 5단계 경보 발령!</strong></p>
              <br/>
              <p style={{color:"green"}}><strong>🍀 영유아,학생,어르신</strong></p>
              <p>1. 등하교(원) 시간 조정, 휴교(원) 조치 검토</p>
              <p>2. 질환자 파악 및 특별 관리 (진료, 조기귀가 등)</p>
              <p style={{color:"green"}}><strong>🍀 일반 국민</strong></p>
              <p>1. 가급적 외출 자제하기</p>
              <p>2. 외출시 보건용 마스크 착용하기</p>
              <p>3. 외출시 대기오염이 심한 도로변, 공사장은 피하고 활동량 줄이기</p>
              <p>4. 대기오염 유발행위 자제하기(대중교통 이용 등)</p>
              <p>😷 마스크 착용 시 호흡이 불편할 경우 사용을 중지하고 전문가 상담 필요</p>
            </div>
          );
        } else if (step.id === '6단계') {
          message = (
            <div>
              <p><strong>대응요령 6단계 주의보, 경보 해제!</strong></p>
              <p>1. 외출 후 깨끗이 씻기</p>
              <p>2. 물과 비타민C가 풍부한 과일-야채 섭취하기 </p>
              <p>3. 실내 공기질 관리하기</p>
              <p>2. 외출시 보건용 마스크 착용하기</p>
              <p style={{color:"gray"}}> - 실내 외 공기 오염도를 고려하여 적절한 환기 실시하기</p>
              <p style={{color:"gray"}}> - 실내 물걸레질 등 물청소하기</p>
            </div>
          );
        }
      return message;
    }
}

  
const headerTitle="미세한" 

const Chatbot = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 });

  const handleToggle = (e) => {
    setIsOpen((prevOpen) => !prevOpen);

    // 아이콘 클릭 시 위치 기억
    if (!isOpen) {
      setIconPosition({
        bottom: window.innerHeight - e.clientY,
        right: window.innerWidth - e.clientX,
      });
    }
  };
  
  const theme = {
    background: '#f5f8fb',
    fontFamily: 'Helvetica Neue',
    headerBgColor: '#147701',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#4caf50',
    botFontColor: '#FFF',
    userBubbleColor: '#f0f4c3',
    userFontColor: '#4a4a4a',
  };

    const steps = [
        {
            id: '0',
            message: `사용자님! 안녕하세요.
           저는 챗봇 미세한 이에요!`,
            trigger: '1',
        },
        {
            id: '1',
            message: `미세먼지 행동요령에 대해 궁금하신가요?`
            ,
            trigger: '2',
        },
        {
            id: '2',
            message: `준비가 되셨다면 시작버튼을
            눌러 주세요.`
            ,
            trigger: '3',
        },
        {
            id: '3',
            options: [
                { value: 1, label: '시작하기', trigger: '4' },
            ],
        },
        {
            id: '4',
            message: `단계별 대응요령의 단계를 선택해주세요!`,
            trigger: '5',
        },
        {
            id: '5',
            options: [
                { value: '1', label: '1단계', trigger: '1단계' },
                { value: '2', label: '2단계', trigger: '2단계' },
                { value: '3', label: '3단계', trigger: '3단계' },
                { value: '4', label: '4단계', trigger: '4단계' },
                { value: '5', label: '5단계', trigger: '5단계' },
                { value: '6', label: '6단계', trigger: '6단계' },
            ],
        },
        {
            id: '1단계',
            component: <MultiPartMessage step={'1'} />,
            trigger: '5',
        },
        {
            id: '2단계',
            component: <MultiPartMessage step={'2'} />,
            trigger: '5',
        },
        {
          id: '3단계',
          component: <MultiPartMessage step={'3'} />,
          trigger: '5',
        },
        {
            id: '4단계',
            component: <MultiPartMessage step={'4'} />,
            trigger: '5',
        },
        {
          id: '5단계',
          component: <MultiPartMessage step={'5'} />,
          trigger: '5',
        },
        {
            id: '6단계',
            component: <MultiPartMessage step={'6'} />,
            trigger: '5',
        }

        // {
        //     id: '5',
        //     component: (
        //         <div className='step'>
        //         <div>
        //             <button>1단계</button>
        //         </div>
        //         <div>
        //             <button>2단계</button>
        //         </div>
        //         <div>
        //             <button>3단계</button>
        //         </div>
        //         <div>
        //             <button>4단계</button>
        //         </div>
        //         <div>
        //             <button>5단계</button>
        //         </div>
        //         <div>
        //             <button>6단계</button>
        //         </div>
        //         </div>
        //     ),
        // },
    ]

    return (
      <>
      <div onClick={handleToggle} className="chatbot-icon">
        <img src="./chatbot-icon.png" alt="챗봇 아이콘" />
      </div>
      {isOpen && (
        <ThemeProvider theme={theme}>
          {/* 아이콘 클릭 시 위치에 채팅 창 표시 */}
          <div
            className="chatbot-window"
            style={{ top: iconPosition.top, left: iconPosition.left }}
          >
            <ChatBot
              headerTitle="미세한"
              steps={steps}
              placeholder={'채팅을 입력 해주세요.'}
            />
          </div>
        </ThemeProvider>
      )}
    </>
  );
};

export default Chatbot;