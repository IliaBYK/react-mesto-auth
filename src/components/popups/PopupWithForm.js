import { memo} from 'react';
import Popup from './Popup';

function PopupWithForm({ 
  name, 
  title, 
  children, 
  textButton = 'Сохранить', 
  isOpen, 
  onClose, 
  onSubmit ,
  isValid = true,
  isLoading
}) {

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit();
  }

  return (
    <Popup name={name} isOpen={isOpen} onClose={onClose}>
      <div className="popup__container">
        <h2 className="popup__title">{title}</h2>
        <form name={name} onSubmit={handleSubmit} className="popup__form">
          {children}
          <button className={
            "popup__submit-button button" + (isValid ? "" : " button_disabled")
          }
            disabled={!isValid || isLoading}
            type="submit"
            aria-label="Кнопка подтверждения">{isLoading ? "Сохранение..." : textButton}</button>
        </form>
        <button className="popup__close-button button"
          type="reset"
          aria-label="Кнопка закрытия всплывающего окна"/>
      </div>
    </Popup>
  )
}

export default memo(PopupWithForm);
