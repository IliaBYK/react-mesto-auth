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
import CurrentUserContext from '../context/CurrentUserContext';
import api from '../utils/Api';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/Auth';

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
  const [error, setError] = useState('');

  const history = useHistory();

  useEffect(() => {
    if(loggedIn) {
      api.getServerUserInfo()
        .then((userData) => {
          setCurrentUser(userData)
        })
        .catch((err) => console.log(err))
    }
  }, [loggedIn])

  useEffect(() => {
    if (loggedIn) {
      api.getInitialCards()
        .then((cards) => {
          setCards(cards);
        }).catch((err) => console.log(err))
    }
  }, [loggedIn])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.checkToken(token).then((res) => {
        if (res) {
          setLoggedIn(true);
          history.push("/");
          setEmail(res.data.email);
        }
      }).catch(err => console.log(err));
    }
  }, [history, loggedIn])

  const handleSubmitReg = (values) => {
    if (values.password === values.confirmPassword) {
      auth.register(values.password, values.email)
        .then((res) => {
          if (res.statusCode !== 400) {
            setSuccess(true);
            setError('');
            history.push('/sign-in');
          } else {
            setSuccess(false);
          }
        }).catch(err => setError(err.message || err.error))
        .finally(() => setIsInfoTooltipOpen(true));
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
          setError('');
        }
      })
      .catch((err) => {
        setError(err.message);
        setIsInfoTooltipOpen(true);
      })
    }

  const handleSignOut = () => {
    setLoggedIn(false);
    setEmail('');
    localStorage.removeItem('token');
    history.push('/sign-in');
  }
  
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

        <InfoTooltip 
          isOpen={isInfoTooltipOpen} 
          onClose={closeAllPopups} 
          success={isSucces} 
          error={error}/>

        <Footer />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
