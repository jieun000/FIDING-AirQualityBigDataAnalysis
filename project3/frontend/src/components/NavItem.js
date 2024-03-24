import React from 'react'
import { Link } from 'react-router-dom';
// import "./navigation.css";

// NavItemLogin 컴포넌트
const NavItemLogin = ({ setIsLoggedIn  }) => {
    return (
    <>
        <Link to={'/'} className="menu__item">
        <img src='logo.png' width="80" />
        </Link>
        <Link to="/login" className="menu__item">
        <span style={{ margin: "10px"}} onClick={()=>setIsLoggedIn(false)}>로그인</span>
        </Link>
        <Link to="/signup" className="menu__item menu__item_Right">
        <span style={{ margin: "10px" }} onClick={()=>setIsLoggedIn(false)}>회원가입</span>
        </Link>
    </>
    );
};

//NavItemLogout 컴포넌트 
const NavItemLogout = ({ setIsLoggedIn }) => {
    return (
    <>
        <Link to={'LoginMain'} className="menu__item">
        <img src='logo.png' width="80"/>
        </Link>
        <Link to="/" className="menu__item">
        <span style={{ margin: "10px"}} onClick={()=>setIsLoggedIn(false)} >로그아웃</span>
        </Link>
        <Link to="/mypage" className="menu__item menu__item_Right">
        <span style={{ margin: "10px" }} onClick={()=>setIsLoggedIn(false)} >마이페이지</span>
        </Link>
    </>
    );
};

export { NavItemLogin, NavItemLogout };