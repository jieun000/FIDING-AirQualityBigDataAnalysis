import React, { useState,useEffect } from 'react';
import axios from "axios";
import { hangjungdong } from './Hangjungdong';
// import './signup.css'

const Signup = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vGroups, setvGroups] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [workPlace1, setWorkPlace1] = useState('');
  const [workPlace2, setWorkPlace2] = useState('');
  const [workPlace3, setWorkPlace3] = useState('');
  const [workPlaceYN, setWorkPlaceYN] = useState('');
  const [addLoccode, setAddLoccode] = useState([]);

  const [checkid, setCheckid] = useState();
  const [sessionData, setSessionData] = useState();

  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [val3, setVal3] = useState("");
  const [val4, setVal4] = useState("");
  const [val5, setVal5] = useState("");
  const [val6, setVal6] = useState("");
  const { gu, ro, da } = hangjungdong;
  console.log('da:',da)

  const formatPhoneNumber = (value) => {
    var phoneNumber = value.replace(/\D/g, '');
    phoneNumber = phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    return phoneNumber;
  };

  // 아이디 중복확인
  const checkDuplicateId = async () => {
    if (username.trim() === '') {
      setCheckid(true); // 중복으로 처리
      return "아이디를 작성해주세요";
    }
    try {
      const response = await axios.post('/checkDuplicateId', { id: username });
      const checkid = response.data; // 서버에서 true/false로 응답하는 경우

      console.log('아이디 중복확인:', checkid); // 결과를 확인하기 위한 로그 추가
      setCheckid(checkid);
    } catch (error) {
      console.error('Error checking duplicate ID:', error);
    }
  };

  var first = gu.map((el,idx) => (
  <option key={idx} value={el.gu}>
    {el.gu}
  </option>
  ))
  console.log('f: ', first)

  var addList = []
  var second = ro
  .filter((el) => el.gu === val1)
  .map((el,idx) => (
    <option key={idx} value={el.ro}>
      {el.ro}
    </option>
    ))
  var third = da.filter((el) => el.gu === val1 && el.ro === val2)
  .map((el) => {addList.push(el)
    return el
  })
  .map((el,idx) => (
    <option key={idx} value={el.da}>
      {el.da}
    </option>
  ))
  var six = da.filter((el) => el.gu === val4 && el.ro === val5)
  .map((el) => {addList.push(el)
    return el
  })
  .map((el,idx) => (
    <option key={idx} value={el.da}>
      {el.da}
    </option>
  ))

  const setAdd1 = (e) => {
    var data__ = e.target.value;
    console.log('d: 1) ', data__);
    setVal3(data__);
    console.log('val3', val3);
    console.log('addlist: ', addList);
  };
  const setAdd2 = (e) => {
    var data__ = e.target.value;
    console.log('d: 1) ', data__);
    setVal6(data__);
    console.log('val6', val6);
    console.log('addlist: ', addList);
  };

  useEffect(() => {
    for (let element of addList) {
      if (element.da === val3) {
        console.log('element:', element.locCode);
        document.getElementById('addLoccode').value = element.locCode;
      } else if (element.da === val6) {
        document.getElementById('workLoccode').value = element.locCode;
      }
    }
  }, [val3, val6, addList]); 
    
  return (
    <>
    <div className="limiter">
      <div className="container-login100" style={{ backgroundColor: '#e8f5e9' }}>
        <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
          <form className="was-validated login100-form validate-form" action="/signup" method="post">
            <span className="login100-form-title p-b-49">
              <img src="./logo.png" width="170"></img>
            </span>

            <div className="wrap-input100 validate-input m-b-23" >
              <span className="label-input100">아이디</span>
              <button type="button" className='login100-form-btn2' onClick={() => checkDuplicateId()}  style={{ marginLeft: "250px" }}>
                <strong>중복 확인</strong>
              </button>
              <input className="input100" type="text" name="id" placeholder="아이디를 입력하세요" autoComplete="current-id" value={username} onChange={(e) => setUsername(e.target.value)}/>
              {(checkid === true || checkid === false ) && (
                <p style={{ color: checkid ? 'red' : 'green' }}>
                  {checkid ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.'}
                </p>
              )}
              <span className="focus-input100" data-symbol="&#xf206;"></span>
            </div>


            <div className="wrap-input100 validate-input m-b-23" >
              <span className="label-input100">패스워드</span>
              <input className="input100" type="password" name="pw" placeholder="비밀번호는 입력해주세요" autoComplete="current-password"/>
              <span className="focus-input100" data-symbol="&#xf190;"></span>
            </div>

            <div className="wrap-input100 validate-input m-b-23" >
              <span className="label-input100">이름</span>
              <input className="input100" type="text" name="username" placeholder="이름을 입력하세요"/>
              <span className="focus-input100" data-symbol="&#xf206;"></span>
            </div>

            <div className="wrap-input100 validate-input m-b-23">
              <span className="label-input100">닉네임</span>
              <input className="input100" type="text" name="nickname" placeholder="닉네임을 입력하세요"/>
              <span className="focus-input100" data-symbol="&#xf206;"></span>
            </div>

            <div className="wrap-input100 validate-input m-b-23" >
                <span className="label-input100">휴대폰 번호</span>
                <input className="input100" type="text" name="phone" placeholder="010-0000-0000" onInput={(e) => e.target.value = formatPhoneNumber(e.target.value)}/>
                <span className="focus-input100" data-symbol="&#xf206;"></span>
            </div>

            <div className="wrap-input100 validate-input m-b-23" >
              <span className="label-input100">이메일</span>
              <input className="input100" type="text" name="email" placeholder="이메일을 입력하세요"/>
              <span className="focus-input100" data-symbol="&#xf206;"></span>
            </div>
            <br/>

            <div className="wrap-input100 validate-input m-b-23" >
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div>
                  <span className="label-input100">거주지</span>
                  <select className="input100" type="text" name="address1" onChange={(e) => setVal1(e.target.value)}>
                    <option value="">선택</option>
                    {first}
                  </select>
                  <span className="focus-input100" data-symbol="&#xf206;"></span>
                </div>

                <div>
                  <span className="label-input100"></span>
                  <select className="input100" type="text" name="address2" onChange={(e) => setVal2(e.target.value)}>
                  <option value="">선택</option>
                  {second}
                  </select>
                  <span className="focus-input100" data-symbol="&#xf206;"></span>
                </div>
                <div>
                  <span className="label-input100"></span>
                  <select className="input100" type="text" name="address3" onChange={(e) =>setAdd1(e)}>
                  <option value="">선택</option>
                    {third}
                  </select>
                  <span className="focus-input100" data-symbol="&#xf206;"></span>
                </div>
              </div>
            </div>
            <br/>

            <div className="wrap-input100 validate-input m-b-23" >
              <div style={{ display: 'flex', flexDirection: 'row'}}>
                <div>
                  <span className="label-input100">출근지</span>
                  <select className="input100" type="text" name="workPlace1" onChange={(e) => setVal4(e.target.value)}>
                  <option value="">선택</option>
                    {first}
                  </select>
                  <span className="focus-input100" data-symbol="&#xf206;"></span>
                </div>

                <div>
                  <span className="label-input100" ></span>
                  <select className="input100" type="text" name="workPlace2" onChange={(e) => setVal5(e.target.value)}>
                  <option value="">선택</option>
                  {ro
                  .filter((el) => el.gu === val4)
                  .map((el) => (
                    <option key={el.codeNm} value={el.ro}>
                      {el.ro}
                    </option>
                    ))}
                  </select>
                  <span className="focus-input100" data-symbol="&#xf206;"></span>
                </div>
                <div>
                  <span className="label-input100"></span>
                  <select className="input100" type="text" name="workPlace3" onChange={(e) =>setAdd2(e)}>
                  <option value="">선택</option>
                    {six}
                  </select>
                  <span className="focus-input100" data-symbol="&#xf206;"></span>
                </div>
              </div>
            </div>
            <br/>

            <div className="wrap-input100 validate-input m-b-23" >
              <span className="label-input100">취약계층에 해당되십니까?</span><br/> 
              <span className="focus-input100" data-symbol="&#xf206;"></span>
              <br/>
              <div style={{ marginLeft: '40px', fontSize: '14px', paddingBottom: '10px'}}>
                  <label>
                    <input type="radio" name="vGroups" value="어린이"/> 어린이
                  </label>  
                  <label>
                    <input type="radio" name="vGroups" value="노인" style={{ marginLeft: '10px'}}/> 노인 
                  </label>
                  <label>
                    <input type="radio" name="vGroups" value="임산부" style={{ marginLeft: '10px'}}/> 임산부 
                  </label>
                  <label>
                    <input type="radio" name="vGroups" value="기저질환자" style={{ marginLeft: '10px'}}/> 기저질환자 
                  </label>
                  <label>
                    <input type="radio" name="vGroups" value="해당없음" style={{ marginLeft: '10px'}} /> 해당없음 
                  </label> 
              </div>
            </div>
            <br/>


            <div className="wrap-input100 validate-input m-b-23" >
              <span className="label-input100">근무지가 취약환경이십니까? 
                <br/> (공장, 지하, 사막, 화재현장, 탄광구, 서울역)
              </span>
              <br/> 
              <span className="focus-input100" style={{ marginTop: '10px' }} data-symbol="&#xf206;"></span>
              <br/>
              <div style={{ marginLeft: '40px', paddingBottom: '10px' }}>
                <label>
                  <input type="radio" name="workPlaceYN" value="1" /> 예
                </label>  
                <label>
                  <input type="radio" name="workPlaceYN" value="0" style={{ marginLeft: '10px'}}/> 아니오
                </label>
              </div>
            </div>

            <input className="input100" type="hidden" id ="addLoccode" name="addLoccode" />
            <input className="input100" type="hidden" id ="workLoccode" name="workLoccode" />
            {/* <input className="input100" type="hidden" id ="xSpot" name="xSpot" />
            <input className="input100" type="hidden" id ="ySpot" name="ySpot" /> */}

            <div className="container-login100-form-btn">
              <div className="wrap-login100-form-btn">
                <div className="login100-form-bgbtn"></div>
                <button type="submit" className="login100-form-btn">
                  가입하기
                </button>
              </div>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  </>
  );
};

export default Signup;