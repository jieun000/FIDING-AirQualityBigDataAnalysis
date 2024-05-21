package com.five.coding.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.five.coding.service.MemberService;
import com.five.coding.vo.MemberVO;
import com.five.coding.vo.ResultVO;

import lombok.Setter;

@Controller
@RequestMapping("/")
public class MemberController {
   
   private HttpSession session;
   
   @Setter(onMethod_=@Autowired)
   private MemberService service;
   
   @RequestMapping(value = "/", method = RequestMethod.GET)
   @CrossOrigin()
   @ResponseBody
    public ResponseEntity<ResultVO> main(HttpServletRequest request) {
      System.out.println("컨트롤러 접근성공.");
      ResultVO v= new ResultVO("");
      v.setResult("객체 저장");
      request.getSession().invalidate();
      System.out.println("세션이 사라졌어요.");
      System.out.println(v);
      return new ResponseEntity<>(v,HttpStatus.OK);
         
   }
   
   //아이디 중복확인
   @PostMapping("/checkDuplicateId")
   @ResponseBody
   public ResponseEntity<Boolean> checkDuplicateId(@RequestBody MemberVO vo) {
       boolean result;

       if (vo.getId() == null || vo.getId().trim().isEmpty()) {
           result = false;
       } else {
           result = service.checkDuplicateId(vo.getId());
       }

       return new ResponseEntity<>(result, HttpStatus.OK);
   }
   
   // 회원가입 페이지로
   @GetMapping("/signup")
   public String register_get() {
      return "signup";
   }
   
   //회원가입 DB연동
   @PostMapping("/signup")
   public String register_post(MemberVO vo, HttpServletResponse response) {
       System.out.println("회원가입 페이지:"+vo);
       if(vo.getId()==null) return null;
       service.register(vo);
       

       // 회원가입 후 알림창 띄우고 로그인 페이지로 이동
       response.setContentType("text/html;charset=UTF-8");
       try (PrintWriter out = response.getWriter()) {
           out.println("<script>");
           out.println("alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');");
           out.println("window.location.href='/login';");
           out.println("</script>");
       } catch (IOException e) {
           // IOException 처리
           e.printStackTrace();
       }
       return null; // 알림창을 띄웠으므로 다른 뷰로 이동할 필요가 없음
   }

   
   // 로그인 페이지로
//   @GetMapping("/login")
//   public String login(HttpServletRequest request) {
//      System.out.println("여기는 로그인 컨트롤러 ");
//      HttpSession existingSession = request.getSession(false);
//      if (existingSession != null && existingSession.getAttribute("miseId") != null) {
//         System.out.println("세션 같아, 메인페이지로 이동.");
//         return "redirect:/LoginMain";
//      }
//      else return "login22";
//   }

   
   // 로그인 DB연동
//   @PostMapping("/login")
//   public String loginPost(HttpSession session, MemberVO vo ,Model model) {
//      // 로그인 성공 시 세션에 정보 설정
//      //session.setAttribute("vo", session); // 세션에 원하는 정보를 설정하세요
//      // 리다이렉트 설정
//      if(vo.getId()!=null)      {
//         model.addAttribute("id",vo);
//         System.out.println("로그인 컨트롤러 : "+vo);
//         session.setAttribute("vo",vo);
//      }
//      return "redirect:http://localhost:3000/LoginMain";
//   }
   
   // 로그인 DB연동
      @PostMapping("/login")
      public String login_post(MemberVO vo, HttpServletRequest request, HttpServletResponse response, Model model) {
         System.out.println(vo);
          MemberVO mUser = service.isSignup(vo);

          if (mUser == null) {
              // 로그인 실패 시 경고창을 띄우는 JavaScript 코드를 응답에 추가
              response.setContentType("text/html;charset=UTF-8");
              try (PrintWriter out = response.getWriter()) {
                  out.println("<script>");
                  out.println("alert('로그인에 실패했습니다. 회원가입을 해주세요.');");
                  out.println("window.location.href='/signup';");
                  out.println("</script>");
              } catch (IOException e) {
                  // IOException 처리
                  e.printStackTrace();
              }
              return null; // 경고창을 띄웠으므로 다른 뷰로 이동할 필요가 없음
          } else {
             session = request.getSession(true);
             session.setAttribute("miseId", mUser.getId());
             session.setAttribute("mUser", mUser);
             System.out.println("로그인 후 컨트롤러:"+mUser);
             System.out.println("로그인 후 세션:"+session);
              return "redirect:http://localhost:3000/LoginMain";
          }
      }

      
      @GetMapping("/loginWebcam")
      @CrossOrigin()
      public String login_face_recognition(MemberVO vo, HttpServletRequest request, HttpServletResponse response, Model model) {
          // MemberVO mUser =(MemberVO) request.getSession().getAttribute("mUser");
          System.out.println("로그인 메인 페이지컨트롤러 : " + vo);
          String userId = vo.getId();

          // userId가 null이 아닌지 확인 후 세션에 설정
          if (userId != null && !userId.equals("unknown") && !userId.equals("") && !userId.equals("null")) {
              session = request.getSession(true);
              session.setAttribute("miseId", userId);
              MemberVO mUser = service.searchUserById(userId);
              session.setAttribute("mUser", mUser);
              System.out.println("로그인 후 컨트롤러:" + mUser);
              System.out.println("로그인 후 세션:" + session);
              return "redirect:http://localhost:3000/LoginMain";
          } else {
             response.setContentType("text/html;charset=UTF-8");
              try (PrintWriter out = response.getWriter()) {
                  out.println("<script>");
                  out.println("alert('얼굴과 일치하는 id가 없습니다. 계정 로그인으로 진행해주세요');");
                  out.println("window.location.href='http://localhost:3000/login';");
                  out.println("</script>");
              } catch (IOException e) {
                  // IOException 처리
                  e.printStackTrace();
              }
              return null; // 경고창을 띄웠으므로 다른 뷰로 이동할 필요가 없음
          }
      }

      
   @GetMapping("/LoginMain")
   @CrossOrigin()
   public ResponseEntity<MemberVO> LoginMain(MemberVO vo, HttpServletRequest request) throws InterruptedException {
      MemberVO mUser =(MemberVO) request.getSession().getAttribute("mUser");
      System.out.println("로그인 메인 페이지컨트롤러 : "+mUser);
      return new ResponseEntity<>(mUser,HttpStatus.OK);
   }

   // 로그아웃
   @GetMapping("/logout")
   public String logout(MemberVO vo, HttpServletRequest request) throws InterruptedException {
      System.out.println("로그아웃 컨트롤러");
      HttpSession session = request.getSession(false); // Session이 없으면 null return
      if(session != null)  {
         System.out.println("Before invalidate: " + session.getId());
         session.invalidate();
         session = request.getSession(false);
         System.out.println("로그아웃 후 세션: "+session);
         return "redirect:/login";
      }
      return "null";
   }
   
   @PostMapping("/mypage")
   public String mypageUpdate(MemberVO vo, HttpServletRequest request, Model model) {
       System.out.println(vo);
       service.mypageUpdate(vo);
       session = request.getSession(true);
       session.setAttribute("mUser", vo);
       System.out.println("여기에서 수정을 하는 컨트롤러 들어옴");
       return "redirect:/LoginMain";
   }

}