package com.five.coding.mapper;

import com.five.coding.vo.MemberVO;

public interface MemberMapper {
   
   public void register(MemberVO vo);
   public MemberVO isSignup(MemberVO  vo); //멤버 정보 불러오기
   public void mypageUpdate(MemberVO vo); //회원 정보 수정
   public boolean checkDuplicateId(String id); //아이디 중복확인
   public MemberVO searchUserById(String id); //아이디 중복확인
   
}