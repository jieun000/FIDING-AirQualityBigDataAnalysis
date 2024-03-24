import React, { useState, useEffect } from 'react';
import {
  useNavigate
} from 'react-router-dom';
import axios from 'axios'; 
import './login.css'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState({})
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const handleWebcamLogin = () => {
    const isConfirmed = window.confirm('컴퓨터에 웹 캠이 있으신가요?');

    if (isConfirmed) {
      // 사용자가 확인을 눌렀을 때의 동작
      console.log('사용자가 확인을 선택했습니다.');
       // 페이지 이동
      navigate('/webcamStream');
    } else {
      // 사용자가 취소를 눌렀을 때의 동작
      const isConfirmed2 = window.confirm('외장 카메라로 인증 하시겠습니까?');
      console.log('사용자가 취소를 선택했습니다.');
      if (isConfirmed2) {
        // 사용자가 확인을 눌렀을 때의 동작
        console.log('사용자가 확인을 선택했습니다.');
        navigate('/CamStream');
         // 페이지 이동
      } else {
        console.log('사용자가 취소를 선택했습니다.');
    }
  }
  };
  
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    console.log("몇번 호출")
    try {
      const response = await axios.post('/login', {
        id: username,
        pw: password,
      });
      setData(response.data)
      e.preventDefault()
      var {id} = data
      console.log(id)
      console.log('login 여부 :',response.data.isLogin)
      setIsLogin(response.data.isLogin)
      navigate(`/LoginMain?id=${id}`, { replace: true }); 
      // '/LoginMain'으로 리다이렉트 하면서 현재 히스토리 엔트리 교체
       
     // console.log("Login successful", response.data);
    } catch (error) {
      console.error('Login failed:', error);
    }
    e.preventDefault();
  };
// useEffect를 사용하여 컴포넌트 렌더링 이후에 리다이렉트를 수행
// useEffect(() => {
//   if(isLogin)
//   navigate('/LoginMain'); // '/LoginMain'으로 리다이렉트
// else
// {

// }
// }, [isLogin]);


  return (
    <div className="limiter">
      <div className="container-login100" style={{ backgroundColor: '#e8f5e9' }}>
        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
          <form className="login100-form validate-form"  method="post" onSubmit={handleSubmit}>
            <span className="login100-form-title p-b-49">
              <img src="./logo.png" width="170"></img>
            </span>

            <div className="wrap-input100 validate-input m-b-23" data-validate="Username is required">
              <span className="label-input100">아이디</span>
              <input
                className="input100"
                type="text"
                name="id"
                placeholder="아이디를 입력하세요"
                autoComplete="current-password"
                value={username}
                onChange={handleUsernameChange}
              />
              <span className="focus-input100" data-symbol="&#xf206;"></span>
            </div>

            <div className="wrap-input100 validate-input" data-validate="Password is required">
              <span className="label-input100">패스워드</span>
              <input
                className="input100"
                type="password"
                name="pw"
                placeholder="패스워드를 입력하세요"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
              />
              <span className="focus-input100" data-symbol="&#xf190;"></span>
            </div>

            <br />
            <br />

            <div className="container-login100-form-btn">
              <div className="wrap-login100-form-btn">
                <div className="login100-form-bgbtn"></div>
                <button type="submit" className="login100-form-btn">
                  로그인
                </button>
              </div>
            </div>

            <div className="flex-col-c p-t-50">
              <a onClick={handleWebcamLogin} className="txt2" style={{textDecoration: "none",cursor: 'pointer'}}>
                😀 얼굴인식 로그인
              </a>
            </div>
            
            <div className="flex-col-c p-t-50">
              <a href="signup" className="txt2" style={{textDecoration: "none", fontWeight: "bold"}}>
                회원가입
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
}

export default Login;