import Popup from "./Popup";

function InfoTooltip({ success, isOpen, onClose, error }) {
  return (
    <Popup 
      onClose={onClose} 
      name="info" 
      isOpen={isOpen}
    >
      <div className="popup__container">
        <div
          className={
            "popup__info-image " +
            (success
              ? "popup__info-image_type_success"
              : "popup__info-image_type_fail")
          }
        ></div>
        <h2 className="popup__info-title">
          {success
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте ещё раз."}
        </h2>
        <span className="popup__error">{error}</span>
        <button className="popup__close-button button"
          type="reset"
          aria-label="Кнопка закрытия всплывающего окна" />
      </div>
    </Popup>
  );
}

export default InfoTooltip;