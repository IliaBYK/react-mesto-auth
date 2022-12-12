import { memo} from "react";
import PopupWithForm from "./PopupWithForm";

const PopupConfirm = ({ card, isLoading, isOpen, onClose, onSubmit }) => {

  function handleSubmit() {
    onSubmit(card);
  }
  return (
    <PopupWithForm 
      name="confirm" 
      title="Вы уверены?" 
      textButton={isLoading ? "Удаление..." : "Да"} 
      onClose={onClose} 
      isOpen={isOpen} 
      onSubmit={handleSubmit}
    />
  )
}

export default memo(PopupConfirm);