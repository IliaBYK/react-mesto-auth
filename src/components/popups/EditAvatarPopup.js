import {useEffect, memo} from 'react';
import PopupWithForm from './PopupWithForm';
import { useFormAndValidation } from "../../hooks/useFormAndValidation";

const EditAvatarPopup = ({ isLoading, isOpen, onClose, onSubmit }) => {

  /* const avatarRef = React.useRef(); */

  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation({
    avatar: ''
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
      name="avatar" 
      title="Обновить аватар" 
      onClose={onClose} 
      isOpen={isOpen} 
      isValid={isValid}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      >

      <fieldset className="popup__set">
        <label className="popup__field popup__field_place_popup-update">
          <input 
            /* ref={avatarRef}  */
            value={values.avatar || ''} 
            onChange={handleChange} 
            type="url" 
            className="popup__input" 
            id="popup-link"
            name="avatar" 
            placeholder="Ссылка на аватар" 
            required />
          <span className={`popup-link-error ${inputErrorClassName(errors.avatar)}`}>{errors.avatar}</span>
        </label>
      </fieldset>
    </PopupWithForm>
  )
}

export default memo(EditAvatarPopup);