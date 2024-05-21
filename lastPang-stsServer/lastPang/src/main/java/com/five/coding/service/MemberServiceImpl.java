package com.five.coding.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.five.coding.mapper.MemberMapper;
import com.five.coding.vo.MemberVO;

import lombok.Setter;

@Service
public class MemberServiceImpl  implements MemberService{
   
   @Setter(onMethod_=@Autowired)
   private MemberMapper mapper;
   
   @Override
   public void register(MemberVO vo) {
      System.out.println("여기는 서비스 회원 가입");
      mapper.register(vo);
   }

   @Override
   public MemberVO isSignup(MemberVO  vo){//멤버 정보 불러오기 {
      System.out.println("여기는 서비스 회원가입 목록 확인 ");
      return mapper.isSignup(vo);
   }

   @Override
   public MemberVO searchUserById(String id) {
      // TODO Auto-generated method stub
      System.out.println("id 서비스 : " +id);
      return mapper.searchUserById(id);
   }
   @Override
   public boolean checkDuplicateId(String id) {
      System.out.println("여기는 서비스 아이디 중복 확인:"+mapper.checkDuplicateId(id));
      return mapper.checkDuplicateId(id);
   }

   @Override
   public void mypageUpdate(MemberVO vo) {//회원 정보 수정
      System.out.println("여기는 회원 정보 수정");
      mapper.mypageUpdate(vo);
      
   }

};