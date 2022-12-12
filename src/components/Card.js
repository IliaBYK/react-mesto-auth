import React from 'react';
import CurrentUserContext from './context/CurrentUserContext';

function Card({ card, onCardClick, onDeleteClick, onCardLike, onCardDelete }) {

  const currentUser = React.useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner._id === currentUser._id;

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = (
    `element__delete-button button ${isOwn ? '' : 'element__delete-button_hidden'}`
  );

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some(i => i._id === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `element__like-button button button ${isLiked ? 'element__like-button_active' : ''}`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <article className="element">
      <button className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
      <img src={card.link} alt={card.name} className="element__img" onClick={handleClick}/>
      <div className="element__footer">
        <h3 className="element__title">{card.name}</h3>
        <button className={cardLikeButtonClassName} type="button" aria-label="Кнопка 'понравилось'" onClick={handleLikeClick}></button>
        <p className="element__like-counter">{card.likes.length}</p>
      </div>
    </article>
  )
}

export default React.memo(Card);