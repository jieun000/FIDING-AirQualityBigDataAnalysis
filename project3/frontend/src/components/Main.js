import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import ApiFetch from './ApiFetch';
import AiFetch from './AiFetch';
import SeoulMap from './SeoulMap';
import { hangjungdong } from './Hangjungdong';
import MyChart from './MyChart';
const { gu, ro, da } = hangjungdong;

const Main = ({ logout }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loginData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:8080/');
                console.log(response);
                const result = await response.json();
                console.log(result);
                setData(result);
                if (typeof logout === 'function') {
                    logout(false);
                }
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        loginData();
    }, [logout]); // logout이 바뀔 때마다 useEffect를 다시 실행

    const [sessionAddress, setSessionAddress] = useState("강동구");
    const [sessionAddress3, setSessionAddress3] = useState("천호사거리");
    const [sessionLocCode, setSessionLocCode] = useState("1240011200");
    const [newWeatherData, setNewWeatherData] = useState(null);
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [finedust, setFinedust] = useState(null);
    const [ultrafinedust, setUltrafinedust] = useState(null);
    const [AllAirQualityData, setAllAirQualityData] = useState(null);
    const [newAirQualityData, setNewAirQualityData] = useState(null);
    const [dataPost, setDataPost] = useState(null);
    const [pyCharmData, setPyCharmData] = useState(null);

    const [districtKey, setDistrictKey] = useState(null); // 지도 선택 구역
    const [loadKey, setLoadKey] = useState(null); // 도로 선택
    const [val1, setVal1] = useState(sessionAddress);
    const [val2, setVal2] = useState("");
    const [val3, setVal3] = useState("");

    // apiFetch에 보내는 객체
    var apiObj = { 
        sessionAddress, sessionLocCode, setNewWeatherData,
        setTemperature, setHumidity, setFinedust,setUltrafinedust,
        setAllAirQualityData, setNewAirQualityData,
        setDataPost
    }
    // aiFetch에 보내는 객체
    var aiObj = {
        dataPost, setPyCharmData
    }

    const getDistrictKey = (districtKey, AllAirQualityData) => {
      let result = null;
      Object.keys(AllAirQualityData).forEach((key) => {
        if (AllAirQualityData[key]['MSRSTE_NM'] === districtKey) {
          result = AllAirQualityData[key];
        }
      });
      // console.log("getDistrictKey의 결과:", result)
      return result;
    };
    // 지도의 구역 선택 시 서울시 대기오염도에서 선택한 구역의 데이터를 찾는 함수
    const districtClick = (districtKey, airQualityData) => {
      let selectedData = getDistrictKey(districtKey, airQualityData);
      setNewAirQualityData(selectedData);
    };
    // 지도의 구역 선택 시 선택한 구역으로 api 데이터 조회를 하고
    // 전체 대기오염도에서 선택한 구역을 찾아 newAirQualityData에 다시 저장하고
    // 그 구의 도로를 지도 위의 select option에 추가한다.
    useEffect(() => {
      if(districtKey == null) return
      // console.log("districtKey변경", districtKey)
      districtClick(districtKey, AllAirQualityData); // 
      setVal1(districtKey);
      setSessionAddress(districtKey); // 주소가 바뀌므로 자동으로 api가 실행.
    }, [districtKey]);

    var first = gu.map((el,idx) => (
      <option key={idx} value={el.gu}>
        {el.gu}
      </option>
    ))
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
    const setLoad = (load) => {
      setSessionAddress3(load)
      let result = null;
      // console.log("setLoad", load);
      Object.keys(addList).forEach((key) => {
        if (addList[key]['da'] === load) {
          result = addList[key]['locCode'];
        }
      });
      // console.log('addlist: ', result);
      setSessionLocCode(result);
    };

    return (
        <>
        <ApiFetch obj={apiObj} />
        <AiFetch obj={aiObj} />
        <div className='gridContainer' style={{ margin: '30px 50px' }}>
          <div id='gridItem1' style={{ border: '5px solid rgba(100, 149, 237, 0.7)',  borderRadius: '15px', textAlign:'center'}}>
              <p style={{fontSize: '48px', textAlign:'center',color:'black'}}>서울시 전체 미세먼지 현황</p>
                <div style={{fontSize: '20px'}}> 
                  <span style={{color: 'blue'}}> 좋음 😍 </span> <span style={{color: 'green'}}> 보통 😀 </span> <span style={{color: 'orange'}}> 나쁨 😒 </span> <span style={{color: 'red'}}> 아주 나쁨 😫</span>
                  
                  <div className="validate-input m-b-23" style={{ display: 'flex', alignItems: 'left', justifyContent: 'left', padding: '20px 0px 0px 0px', marginBottom: '0px'}}>
                    <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '20px'}}>
                      <div>
                        <span>도로를 선택하세요.</span>
                        <select className="input100" type="text" name="address1" value={val1} onChange={(e) => {setVal1(e.target.value); setSessionAddress(e.target.value)}}>
                          <option value="">선택</option>
                          {first}
                        </select>
                        <span className="focus-input100_2" data-symbol="&#xf206;"></span>
                      </div>
                      <div>
                        <span className="label-input100" ></span>
                        <select className="input100" type="text" name="address2" onChange={(e) => setVal2(e.target.value)}>
                        <option value="">선택</option>
                        {second}
                        </select>
                        <span className="focus-input100_2" data-symbol="&#xf206;"></span>
                      </div>
                  </div>
                  <div>
                      <span className="label-input100"></span>
                      <select className="input100" type="text" name="address3" onChange={(e) => setLoad(e.target.value)}>
                      <option value="">선택</option>
                        {third}
                      </select>
                      <span className="focus-input100_2" data-symbol="&#xf206;"></span>
                    </div>
                </div>
                <br/>
                </div>
              <SeoulMap airQualityData1={AllAirQualityData} setDistrictKey={(i)=> setDistrictKey(i)} />
            </div>
            <div id='gridItem2' style={{ border: '5px solid rgba(167, 212, 131, 0.7)',  borderRadius: '15px' , fontSize: '48px', textAlign:'center'}}>
              <p style={{fontSize: '48px', textAlign:'center',color:'black'}}>{sessionAddress} 대기 정보</p>
              <div style={{ border: '#DCEDC8', borderRadius: '15px', margin:'30px 50px', background:'#fff9c4'}}>
              </div>
              <div style={{ border: '#DCEDC8', borderRadius: '15px', margin:'30px 50px', background:'#fff9c4', marginBottom: '80px'}} >
              <p style={{color: 'black', fontSize:'18px'}}> 
            <img src="./weather.png" width="500"></img>
            <br></br>
            {temperature}℃ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{humidity}%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{finedust}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ultrafinedust}&nbsp;&nbsp;&nbsp;</p></div>
                <MyChart airQualityData={newAirQualityData} pyCharmData={pyCharmData} loadName={sessionAddress3}/>
              </div>
            </div>
        </>
    )
}
export default Main;