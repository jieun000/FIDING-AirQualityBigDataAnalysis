import React, { useState, useEffect } from 'react'
import "./navigation.css";
import './util.css';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { NavItemLogin, NavItemLogout } from './NavItem';

const Navigation = ({ isLoggedIn, setIsLoggedIn }) => {
    // console.log('Navigation:',isLoggedIn)
    const [menuToggle, setMenuToggle] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    //const [loginToggle, setLoginToggle] = useState(isLoggedIn)

    const navigate = useNavigate();
    
    useEffect(() => {
        const handleScroll = () => {
          const menuVisible = document.querySelector('.menu__box__visible');
          if (menuVisible) {
            if (window.scrollY > 76) {
              setScrolled(true);
              menuVisible.style.top = '0';
            } else {
              setScrolled(false);
              menuVisible.style.top = '76px';
            }
          }
        };
        //setIsLoggedIn(!isLoggedIn)
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []); 

    return (
        <nav className={`navigation__wrapper ${scrolled ? 'scrolled' : ''}`}>
            <div
                className={!menuToggle ? "burger__menu" : "x__menu"}
                onClick={() =>
                menuToggle ? setMenuToggle(false) : setMenuToggle(true)
                }
            >
                <div className="burger_line1" ></div>
                <div className="burger_line2"></div>
                <div className="burger_line3" ></div>
            </div>

            <div
                className={[
                "menu__box",
                !menuToggle ? "menu__box__hidden" : "menu__box__visible",
                ].join(" ")}
            >
                <div className="menu__list">
                {isLoggedIn ? <NavItemLogout setIsLoggedIn={setIsLoggedIn} />
                        : (
                        <NavItemLogin setIsLoggedIn={setIsLoggedIn}  />
                        )
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navigation