import {useEffect, useContext, memo} from "react";
import PopupWithForm from "./PopupWithForm";
import { useFormAndValidation } from "../../hooks/useFormAndValidation";
import CurrentUserContext from "../../context/CurrentUserContext";

const EditProfilePopup = ({ isLoading, isOpen, onClose, onSubmit }) => {

  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation({
    name: '',
    about: ''
  })

  const currentUser = useContext(CurrentUserContext);
  
    useEffect(() => {
      if (isOpen) {
        resetForm({ name: currentUser.name, about: currentUser.about });
      }
    }, [isOpen, resetForm, currentUser]);
  
  const inputErrorClassName = (error) =>
    "popup__input-error" + (error ? " popup__input-error_active" : "");

  function handleSubmit() {
    return onSubmit(values);
  }

  return(
    <PopupWithForm 
      name="edit" 
      title="Редактировать профиль" 
      onClose={onClose} 
      isOpen={isOpen}
      onSubmit={handleSubmit}
      isValid={isValid}
      isLoading={isLoading}
      >

      <fieldset className="popup__set">
        <label className="popup__field">
          <input 
            value={values.name || ""} 
            onChange={handleChange} 
            type="text" 
            className="popup__input" 
            id="popup-name" 
            name="name" 
            placeholder="Имя" 
            required 
            minLength={2} 
            maxLength={40} />
          <span className={`popup-name-error ${inputErrorClassName(errors.name)}`}>{errors.name}</span>
        </label>

        <label className="popup__field">
          <input 
            value={values.about || ""} 
            onChange={handleChange} 
            type="text" 
            className="popup__input" 
            id="popup-about" 
            name="about" 
            placeholder="О себе" 
            required
            minLength={2} 
            maxLength={200} />
          <span className={`popup-about-error ${inputErrorClassName(errors.description)}`}>{errors.about}</span>
        </label>
      </fieldset>
    </PopupWithForm>
  )
}

export default memo(EditProfilePopup);