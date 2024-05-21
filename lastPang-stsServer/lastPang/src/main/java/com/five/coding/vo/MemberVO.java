package com.five.coding.vo;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class MemberVO {
	
	private String id;
	private String pw;
	private String username;
	private String nickname;
	private String phone;
	private String email;
    private String vGroups;
    private String address1;
    private String address2;
    private String address3;
    private String workPlace1;
    private String workPlace2;
    private String workPlace3;
    private String workPlaceYN;
    private String addLoccode;
    private String workLoccode;
    private String spotNum;
    private String xSpot;
    private String ySpot;
    
}