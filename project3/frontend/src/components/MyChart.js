/* eslint-disable */ 
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';

const MyChart = ({ airQualityData, pyCharmData, loadName }) => {
  const chartRef = useRef(null);
  const [myChart, setMyChart] = useState(null);

  useEffect(() => {
    if (airQualityData != null) {
      // console.log("Chart에서 받는 airQualityData 데이터:", airQualityData, "\nChart에서 받는 loadData 데이터:", pyCharmData, "\n도로명:",loadName);
      var districtName = airQualityData.MSRSTE_NM;
      var O3Value = airQualityData.O3;
      var NO2Value = airQualityData.NO2;
      var COValue = airQualityData.CO;
      // console.log(`Chart.js ${districtName}의 \n오존: ${O3Value}, \n이산화질소: ${NO2Value}, \n일산화탄소: ${COValue}`);
    } else {
      return
      console.log("district Null");
    }
    if (pyCharmData != null) {
      var S02LoadValue = pyCharmData.SO2;
      var NO2LoadValue = pyCharmData.NO2;
      var COLoadValue = pyCharmData.CO;
      // console.log(`Chart.js 도로의 \n아황산가스: ${S02LoadValue}, \n이산화질소: ${NO2LoadValue}, \n일산화탄소: ${COLoadValue}`);
    } else {
      console.log("load Null");
      return;
    }

    if (myChart) {
      myChart.data.datasets[0].label = districtName;
      myChart.data.datasets[0].data = [O3Value, NO2Value, COValue];
      myChart.data.datasets[1].label = loadName;
      myChart.data.datasets[1].data = [S02LoadValue, NO2LoadValue, COLoadValue];
      if(myChart!=null){
        myChart.update();
      } else{
        console.log("라스트 팡")
      }
      
    } else {
      const context = chartRef.current.getContext('2d');
      const newChart = new Chart(context, {
        type: 'bar',
        data: {
          labels: ['아황산가스', '이산화질소', '일산화탄소'],
          datasets: [
            {
              label: districtName,
              data: [O3Value, NO2Value, COValue],
              backgroundColor: ['rgba(255, 99, 132, 0.2)'],
              borderColor: ['rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            },
            {
              label: loadName,
              data: [S02LoadValue, NO2LoadValue, COLoadValue],
              backgroundColor: ['rgba(54, 162, 235, 0.2)'],
              borderColor: ['rgba(54, 162, 235, 1)'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              display: true,
            },
            y: {
              display: true,
              type: "logarithmic",
            },
          },
          responsive: false,
          maintainAspectRatio: false,
        },
      });

      setMyChart(newChart);
    }
  }, [pyCharmData]);

  return (
    <div>
      <canvas
        id='myChart'
        ref={chartRef}
        style={{ padding: '15px 20px 15px', width: '80vh', display: 'block' }}
      ></canvas>
    </div>
  );
};

export default MyChart;
