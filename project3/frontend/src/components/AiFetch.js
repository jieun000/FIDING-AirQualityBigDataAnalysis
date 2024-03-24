import React, { useEffect, useCallback } from 'react';

const AiFetch = React.memo(({ obj }) => {
  console.log("AiFetch 실행")
  var { dataPost, setPyCharmData }  = obj;

  // 파이참 서버에서 도로 정보를 가져오는 함수
  const fetchData = useCallback(async () => {
    try {
      console.log("AiFetch fetchData 실행, 파이참 서버로 보내는 데이터:", dataPost)

      const response2 = await fetch('http://localhost:5000/api/data', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataPost),
      });
      if (!response2.ok) {
        throw new Error(`HTTP error! Status: ${response2.status}`);
      }
      const result = await response2.json();
      console.log('파이참 서버에서 가져온 데이터:', result);
      setPyCharmData(result);
    } catch (error) {
      console.error(error);
    }
  }, [obj]);

    useEffect(() => {
      fetchData(); 
    }, [dataPost]);

    return (
      <></>
    )
  }, (prevProps, nextProps) => {
    return (
      prevProps.obj.dataPost === nextProps.obj.dataPost
    );
  });
  
export default React.memo(AiFetch);