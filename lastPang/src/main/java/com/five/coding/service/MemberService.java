package com.five.coding.service;

import com.five.coding.vo.MemberVO;

public interface MemberService {
   public void register(MemberVO vo); //회원가입
   public MemberVO isSignup(MemberVO  vo); //멤버 정보 불러오기
   public void mypageUpdate(MemberVO vo); //회원정보 수정
   public boolean checkDuplicateId(String id);  //아이디 중복확인
   public MemberVO searchUserById(String id); //아이디 중복확인

}