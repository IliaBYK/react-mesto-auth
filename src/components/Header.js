import React, {useState} from "react";
import { Link, Route, Switch } from 'react-router-dom';

function Header(props) {

  /* const [isOpen, setIsopen] = useState(false); */
  const [btnClass, setBtnClass] = useState("header__btn")
  const [menu_class, setMenuClass] = useState("header__menu")
  const [isMenuClicked, setIsMenuClicked] = useState(false)

  const updateMenu = () => {
    if (!isMenuClicked) {
      setBtnClass("header__btn_active")
      setMenuClass("header__menu_opened")
    }
    else {
      setBtnClass("header__btn")
      setMenuClass("header__menu")
    }
    setIsMenuClicked(!isMenuClicked);
  }

  const signOut = () => {
    props.onSignOut();
    setIsMenuClicked(false);
  }

  return (
    <>
      <div className={isMenuClicked ? menu_class : "header__menu"}>
        <span className="header__email header__email_placed_burger">{props.email}</span>
        <Link 
          className="header__link header__link_placed_burger" 
          onClick={signOut} 
          to="/sign-in">Выйти</Link>
      </div>

      <header className="header">
        <div className="header__logo"/>
        <div className="header__navbar">
          <Switch>
            <Route exact path="/">
              <div className="header__burger button" onClick={updateMenu}>
                <span className={isMenuClicked ? btnClass : "header__btn"}/>
              </div>
              <div className="header__profile">
                <span className="header__email">{props.email}</span>
                <Link className="header__link" onClick={props.onSignOut} to="/sign-in">Выйти</Link>
              </div>
            </Route>
            <Route path="/sign-in">
              <Link className="header__link" to="/sign-up">Зарегистрироваться</Link>
            </Route>
            <Route path="/sign-up">
              <Link className="header__link" to="/sign-in">Войти</Link>
            </Route>
          </Switch>
        </div>
      </header>
    </>
  )
}

export default React.memo(Header);