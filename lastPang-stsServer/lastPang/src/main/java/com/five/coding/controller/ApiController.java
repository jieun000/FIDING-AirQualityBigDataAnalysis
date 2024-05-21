package com.five.coding.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")  
public class ApiController {

	@PostMapping("/api-fetch")
    public ResponseEntity<Map<String, Object>> fetchData(@RequestBody Map<String, String> requestBody) {
        System.out.println("api-fetch 컨트롤러 들어왔습니다.");
		try {
            String sessionAddress = requestBody.get("sessionAddress");
            String sessionLocCode = requestBody.get("sessionLocCode");
            System.out.println("주소: " + sessionAddress + ", 도로 아이디: " +  sessionLocCode);
            if(sessionAddress == null || sessionLocCode== null) return null;
            
            int weatherX = 0, weatherY = 0;
            String resourcePath = "/weather.json";
            try (InputStream inputStream = ApiController.class.getResourceAsStream(resourcePath)) {
                if (inputStream != null) {
                    ObjectMapper objectMapper = new ObjectMapper(); // JSON 파일을 Map으로 변환
                    Map<String, int[]> weather = objectMapper.readValue(inputStream, new TypeReference<Map<String, int[]>>() {});
                    int[] coordinates = weather.get(sessionAddress);
                    if (coordinates != null) {
                        weatherX = coordinates[0];
                        weatherY = coordinates[1];
//                        System.out.println("WeatherX: " + weatherX);
//                        System.out.println("WeatherY: " + weatherY);
                    } else {
                        System.out.println(sessionAddress + "에 해당하는 것 없음.");
                    }
                } else {
                    System.out.println("이런 거 없어: " + resourcePath);
                } 
            } catch (IOException e) {
                e.printStackTrace();
            }

            
            // 현재 날짜 및 시간
            LocalDateTime currentDateTime = LocalDateTime.now();
            // 현재 날짜 시간을 "yyyy-MM-dd HH:mm" 형식으로 포맷
            String formattedDateTime = currentDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
//            System.out.println("nowData: " + formattedDateTime); // nowData
            // 현재 날짜를 "yyyyMMdd" 형식으로 포맷
            String formattedCurrentDate = currentDateTime.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            // 현재 시간을 "HH00" 형식으로 포맷
            String formattedCurrentTime = currentDateTime.minusHours(1).format(DateTimeFormatter.ofPattern("HH00"));
            // api 조회 시간(formattedCurrentTime)이 23시면 날짜를 하루 전으로 조정
            if ("2300".equals(formattedCurrentTime)) {
                formattedCurrentDate = currentDateTime.minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            }

            // 오늘의 요일은~
            String dayOfWeek = currentDateTime.getDayOfWeek().name();
            List<String> daysOfWeek = Arrays.asList("일", "월", "화", "수", "목", "금", "토");
            int index = DayOfWeek.valueOf(dayOfWeek).getValue() % 7; // DayOfWeek의 값은 1부터 7까지이므로 나머지 연산을 통해 인덱스 계산
            dayOfWeek = daysOfWeek.get(index);
            // System.out.println("오늘의 요일은~ " + dayOfWeek);
            // System.out.println("api 조회 날짜: " + formattedCurrentDate);
            // System.out.println("api 조회 시간: " + formattedCurrentTime);
            
            
            // 기상청_단기예보 조회서비스(구별 기온, 풍속 강수량, 습도)
            // HTTP 요청을 보낼 URL 구성
            String apiUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
            String serviceKey = "secret-key";
            // API 요청 URL 조합
            String apiUrlWithParams = String.format("%s?serviceKey=%s&numOfRows=10&dataType=json&pageNo=1&base_date=%s&base_time=%s&nx=%s&ny=%s",
                    apiUrl, serviceKey, formattedCurrentDate, formattedCurrentTime, weatherX, weatherY);
            URL weatherUrl = new URL(apiUrlWithParams);
            HttpURLConnection weatherConnection = (HttpURLConnection) weatherUrl.openConnection();
            weatherConnection.setRequestMethod("GET");

            StringBuilder weatherResponse = new StringBuilder(); // 응답 데이터 읽기
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(weatherConnection.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    weatherResponse.append(line);
                }
            }
            Map<String, Object> newWeatherData = new HashMap<>(); // 응답 데이터(JSON) 처리
            try {
                ObjectMapper mapper = new ObjectMapper();
                Map<String, Object> weatherData = mapper.readValue(weatherResponse.toString(), new TypeReference<Map<String, Object>>() {});

                Map<String, Object> responseBody = (Map<String, Object>) weatherData.get("response");
                if (responseBody != null) {
                    Map<String, Object> body = (Map<String, Object>) responseBody.get("body");
                    Map<String, Object> items = (body != null) ? (Map<String, Object>) body.get("items") : null;
                    List<Map<String, Object>> itemList = (items != null) ? (List<Map<String, Object>>) items.get("item") : null;

                    if (itemList != null) {
                        for (Map<String, Object> item : itemList) {
                            String category = (String) item.get("category");
                            Float obsrValue = Float.parseFloat((String) item.get("obsrValue"));
                            newWeatherData.put(category, obsrValue);
                        }
                        // System.out.println("기상청: " + newWeatherData);
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }

            
            // 서울시 시간 평균 대기오염도 정보(구별 미세먼지, 초미세먼지, 오존, 무슨 공기 등)
            apiUrl = "http://openAPI.seoul.go.kr:8088"; // HTTP 요청을 보낼 URL 구성
            serviceKey = "secret-key";
            apiUrlWithParams = String.format("%s/%s/json/TimeAverageAirQuality/1/25/%s", apiUrl, serviceKey, formattedCurrentDate);

            URL url = new URL(apiUrlWithParams); // HTTP GET 요청 보내기
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            StringBuilder response = new StringBuilder(); // 응답 데이터 읽기
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
            }
            ObjectMapper airQualityObjectMapper = new ObjectMapper(); // 응답 데이터(JSON) 처리
            Map<String, Object> airQualityMap = airQualityObjectMapper.readValue(response.toString(), Map.class);

            Map<String, Object> timeAverageAirQuality = (Map<String, Object>) airQualityMap.get("TimeAverageAirQuality");
            List<Map<String, Object>> AllAirQualityData = (List<Map<String, Object>>) timeAverageAirQuality.get("row");
            Map<String, Object> newAirQualityData = AllAirQualityData.stream()
                    .filter(data -> sessionAddress.equals(data.get("MSRSTE_NM")))
                    .findFirst()
                    .orElse(new HashMap<>());
            // System.out.println("서울시 전체 대기오염도: " + AllAirQualityData); 
            // System.out.println("사용자 맞춤 주소 대기오염도: " + newAirQualityData);


            // 교통량
            int trafficData = 0;
            resourcePath = "/traffic.json";
            try (InputStream inputStream = ApiController.class.getResourceAsStream(resourcePath)) {
                if (inputStream != null) {
                    ObjectMapper objectMapper = new ObjectMapper(); // JSON 파일을 Map으로 변환
                    Map<String, Map<String, Map<String, Integer>>> trafficDataMap = objectMapper.readValue(inputStream, Map.class);
                    Object roadTypeObject = trafficDataMap.get("road_dict").get(sessionLocCode).get("load_type");
                    String roadType = roadTypeObject.toString();  // Object를 String으로 변환
                    trafficData = trafficDataMap.get("traffic_volume").get(roadType).get(dayOfWeek);
                    // System.out.println("교통량: " + trafficData);
                } else {
                    System.out.println("파일이 존재하지 않습니다. " + resourcePath);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
    

            // 서울시 실시간 도로 소통 정보(교통 속도)
            apiUrl = "http://openapi.seoul.go.kr:8088";
            serviceKey = "secret-key";
            apiUrlWithParams = String.format("%s/%s/xml/TrafficInfo/1/10/"+ sessionLocCode,
                    apiUrl, serviceKey);
            
            url = new URL(apiUrlWithParams); // HTTP GET 요청 보내기
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            response = new StringBuilder(); // 응답 데이터 읽기
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
            }
            String xmlString = response.toString(); // 응답 데이터(XML) 처리
            String regex = "<prcs_spd>([\\d.]+)</prcs_spd>";
            Float spdValue = null;
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile(regex);
            java.util.regex.Matcher matcher = pattern.matcher(xmlString);
            if (matcher.find()) {
            	spdValue = Float.parseFloat(matcher.group(1));
            }
            // System.out.println("교통 속도: " + spdValue);

            
            Map<String, Object> responseData = new HashMap<>(); // 클라이언트에 응답할 데이터 구성
            responseData.put("newWeatherData", newWeatherData); 
            responseData.put("newAirQualityData", newAirQualityData); 
            responseData.put("AllAirQualityData", AllAirQualityData); 
            responseData.put("trafficData", trafficData); 
            responseData.put("spdValue", spdValue); 
            responseData.put("momentDateValue", formattedDateTime); 
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}