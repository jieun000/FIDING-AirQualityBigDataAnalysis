package com.five.coding.controller;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.five.coding.vo.ResultVO;

/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {
	
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value = "/a", method = RequestMethod.GET)
		@CrossOrigin()
		@ResponseBody
	    public ResponseEntity<ResultVO> main() {
			System.out.println("컨트롤러 접근성공");
			ResultVO v= new ResultVO("");
			v.setResult("사랑합니다");
			System.out.println(v);
			return new ResponseEntity<>(v,HttpStatus.OK);
				
		}
	
}
