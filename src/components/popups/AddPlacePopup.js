import { useEffect, memo } from "react";
import PopupWithForm from "./PopupWithForm";
import { useFormAndValidation } from "../../hooks/useFormAndValidation";

const AddPlacePopup = ({ isLoading, isOpen, onClose, onSubmit }) => {

  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation({
    name: '',
    link: ''
  })

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const inputErrorClassName = (error) =>
    "popup__input-error" + (error ? " popup__input-error_active" : "");

  function handleSubmit() {
    return onSubmit(values);
  }

  return (
    <PopupWithForm 
      name="add-card" 
      title="Новое место" 
      onClose={onClose} 
      isOpen={isOpen} 
      isValid={isValid}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <fieldset className="popup__set">
        <label className="popup__field">
          <input 
            value={values.name || ''}
            onChange={handleChange} 
            type="text" 
            className="popup__input" 
            id="popup-place-name" 
            name="name" 
            placeholder="Название" 
            required 
            minLength={2}
            maxLength={30} 
          />
          <span className={`popup-place-name-error ${inputErrorClassName(errors.name)}`}>{errors.name}</span>
        </label>

        <label className="popup__field">
          <input 
            value={values.link || ''}
            onChange={handleChange}
            type="url" 
            className="popup__input" 
            id="popup-src" 
            name="link" 
            placeholder="Ссылка на картинку" 
            required 
          />
          <span className={`popup-src-error ${inputErrorClassName(errors.link)}`}>{errors.link}</span>
        </label>
      </fieldset>
    </PopupWithForm>
  )
}

export default memo(AddPlacePopup);