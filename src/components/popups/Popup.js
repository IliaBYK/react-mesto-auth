import { useEffect, memo } from 'react';

function Popup({
  name,
  children,
  isOpen,
  onClose
}) {

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.code === "Escape") onClose();
    };

    if (isOpen) document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  const closePopup = (evt) => {
    if (evt.target.classList.contains('popup') || evt.target.classList.contains('popup__close-button')) {
      onClose();
    }
  }

  return (
    <div className={`popup popup-${name}` + (isOpen ? " popup_opened" : "")} onClick={closePopup}>
      {children}
    </div>
  )
}

export default memo(Popup);