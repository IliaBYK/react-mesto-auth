import React from 'react';
import Card from './Card';
import CurrentUserContext from './context/CurrentUserContext';

function Main({ 
  onEditAvatar, 
  onEditProfile, 
  onAddPlace, 
  onCardClick, 
  onDeleteClick, 
  cards, 
  onCardLike, 
  onCardDelete 
}) {
  
  const currentUser = React.useContext(CurrentUserContext);

  const cardElements = cards.map((cardItem) => (<Card key={cardItem._id} 
    card={cardItem} 
    onCardClick={onCardClick} 
    onDeleteClick={onDeleteClick} 
    onCardLike={onCardLike} 
    onCardDelete={onCardDelete} />))

  return (
    <main className="container">

      <section className="profile">
        <div className="profile__avatar-container">
          <div className="profile__avatar-overlay">
            <div className="profile__avatar-pen" onClick={onEditAvatar} />
          </div>
          <img src={currentUser.avatar} alt="Аватар профиля" className="profile__avatar" />
        </div>

        <div className="profile__info">
          <div className="profile__head">
            <h1 className="profile__title">{currentUser.name}</h1>
            <p className="profile__subtitle">{currentUser.about}</p>
          </div>
          <button 
            className="profile__edit-button button" 
            type="button" 
            onClick={onEditProfile} 
            aria-label="Кнопка редактирования профиля" 
          />
        </div>
        <button 
          className="profile__add-button button" 
          type="button" 
          onClick={onAddPlace} 
          aria-label="Кнопка добавления" 
        />
      </section>

      <section className="elements">
        {cardElements}
      </section>
    </main>
  )
}

export default React.memo(Main);
