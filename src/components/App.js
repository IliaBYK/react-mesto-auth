import {useState, useEffect} from 'react';
import { Route, Switch, Redirect, withRouter, useHistory } from 'react-router-dom';
import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import AddPlacePopup from './popups/AddPlacePopup';
import PopupConfirm from './popups/PopupConfirm';
import EditProfilePopup from './popups/EditProfilePopup';
import EditAvatarPopup from './popups/EditAvatarPopup';
import ImagePopup from './popups/ImagePopup';
import InfoTooltip from './popups/InfoTooltip';
import CurrentUserContext from './context/CurrentUserContext';
import api from '../utils/Api';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import * as auth from './Auth';

function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [deletingCard, setDeletingCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSucces, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
/*   const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); */

  const history = useHistory();

  useEffect(() => {
    api.getServerUserInfo()
      .then((userData) => {
        setCurrentUser(userData)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    api.getInitialCards()
      .then((cards) => {
        setCards(cards);
      }).catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // проверяем токен пользователя
      auth.checkToken(token).then((res) => {
        if (res) {
          // если есть цель, добавляем её в стейт
          setLoggedIn(true);
          history.push("/");
          setEmail(res.data.email);
        }
      });
    }
  }, [history, loggedIn])

  /* const handleSubmitReg = useCallback((values) => {
    if (password === confirmPassword) {
      auth.register(values).then((res) => {
        if (res.statusCode !== 400) {
          history.push('/sign-in');
        }
      }).then(() => handleInfoToolTipClick());
    }
  }, [password, confirmPassword, history]) */

  /* const handleSignUp = useCallback((values) => {
    return authApi
      .register(values)
      .then(
        ({ data }) => {
          setSuccessSignUp(true);
          history.push("/sign-in")
        },
        (err) => {
          setSuccessSignUp(false);
          console.log(err.message);
        }
      )
      .then(() => setInfoPopupOpen(true));
  }, []); */

  /* const handleSubmitReg = useCallback((values) => {
    if (values.password === values.confirmPassword) {
      auth.register(values).then(({res}) => {
        if (res.statusCode !== 400) {
          setSuccess(true);
          history.push('/login')
        } else {
          setSuccess(false);
        }
      }).then(() => setIsInfoTooltipOpen(true));
    }
  }, []); */

  const handleSubmitReg = (values) => {
    if (values.password === values.confirmPassword) {
      auth.register(values.password, values.email)
        .then((res) => {
          if (res.statusCode !== 400) {
            setSuccess(true)
            history.push('/sign-in');
          } else {
            setSuccess(false);
          }
        }).finally(() => setIsInfoTooltipOpen(true));
    }
  }

  const handleSubmitLog = (values) => {
    if (!values.email || !values.password) {
      return;
    }
    auth.authorize(values.email, values.password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          auth.checkToken(res.token);
          setLoggedIn(true);
          history.push('/');
        }
      })
      .catch(err => console.log(err));
    }

  const handleSignOut = () => {
    setLoggedIn(false);
    setEmail('');
    localStorage.removeItem('token');
    history.push('/sign-in');
  }
    

  /* useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      duckAuth.getContent(token).then((res) => {
        if (res) {
          let userData = {
            username: res.username,
            email: res.email,
          };
          handleLogin(userData)
          history.push('/ducks');
        }
      });
    }
  }, []) */
  /* const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.username || !data.password) {
      return;
    }
    duckAuth.authorize(data.username, data.password)
      .then((res) => {
        if (res.jwt) {
          setData({ username: '', password: '' })
          localStorage.setItem('jwt', res.jwt)
          const userData = {
            username: res.user.username,
            email: res.user.email
          }
          handleLogin(userData);
          history.push('/ducks');
        }
      })
      .catch(err => console.log(err));
  } */

  
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleConfirmClick(card) {
    setDeletingCard(card);
    setIsConfirmPopupOpen(true);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
      .catch((err) => console.error(err.message));;
  }
  
  function handleCardDelete(card) {
    setIsLoading(true);
    return api.deleteCard(card._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
        closeAllPopups();
      })
      .catch((err) => console.error(err.message))
      .finally(() => setIsLoading(false));
  }

  function handleAddPlaceSubmit(inputs) {
    setIsLoading(true);
    return api.postServerCard(inputs)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.error(err.message))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateUser(inputs) {
    setIsLoading(true);
    return api.setServerUserInfo(inputs)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => console.error(err.message))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar(inputs) {
    setIsLoading(true);
    return api.setUserAvatar(inputs)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => console.error(err.message))
      .finally(() => setIsLoading(false));
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard(null);
    setIsInfoTooltipOpen(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">

        <Header email={email} isOpen={email} onSignOut={handleSignOut}/>

        <Switch>
          <ProtectedRoute 
            exact path="/"
            loggedIn={loggedIn}
            component={Main}
            onAddPlace={handleAddPlaceClick}
            onEditProfile={handleEditProfileClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onDeleteClick={handleConfirmClick}
            onCardLike={handleCardLike}
            onCardDelete={handleConfirmClick}
            cards={cards} 
          />
          <Route path="/sign-in">
            <Login onSubmit={handleSubmitLog}/>
          </Route>
          <Route path="/sign-up">
            <Register onSubmit={handleSubmitReg} />
          </Route>
          <Route>
            <Redirect to="/" />
          </Route>        
        </Switch>

        <AddPlacePopup 
          isLoading={isLoading}
          isOpen={isAddPlacePopupOpen} 
          onClose={closeAllPopups} 
          onSubmit={handleAddPlaceSubmit}/>

        <EditProfilePopup 
          isLoading={isLoading}
          isOpen={isEditProfilePopupOpen} 
          onClose={closeAllPopups} 
          onSubmit={handleUpdateUser}/>

        <PopupConfirm 
          isLoading={isLoading}
          isOpen={isConfirmPopupOpen} 
          onClose={closeAllPopups} 
          onSubmit={() => handleCardDelete(deletingCard)}
          card={deletingCard}/>

        <EditAvatarPopup 
          isLoading={isLoading}
          isOpen={isEditAvatarPopupOpen} 
          onClose={closeAllPopups} 
          onSubmit={handleUpdateAvatar} 
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

        <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} success={isSucces} />

        <Footer />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
