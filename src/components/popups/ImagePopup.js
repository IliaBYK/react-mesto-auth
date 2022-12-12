import React from "react";

function ImagePopup({card, onClose}) {

  const closePopup = (evt) => {
    if (evt.target.classList.contains('popup') || evt.target.classList.contains('popup__close-button')) {
      onClose();
    }
  }

  return (
    <div className={`popup popup_action_open-img ${card ? " popup_opened" : ""}`} id="popupOpenImg" onClick={closePopup}>
      <div className="popup__container popup__container_for_image">
        <button className="popup__close-button button" 
          id="closeButtonPopupImage" 
          type="reset" 
          aria-label="Кнопка закрытия всплывающего окна"></button>
        <img src={card ? card.link : ''} alt={card ? card.name : ''} className="popup__img" id="popupImg" />
        <p className="popup__description">{card ? card.name : ''}</p>
      </div>
    </div>
  )
}

export default React.memo(ImagePopup);