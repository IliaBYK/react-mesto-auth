import { withRouter, Link } from 'react-router-dom'; 
import { useFormAndValidation } from '../hooks/useFormAndValidation';

function Login(props) {

  const { values, errors, isValid, handleChange } = useFormAndValidation({
    email: "",
    password: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    return props.onSubmit(values);
  }

  const spanErrorClassName = (error) => "login__error" + (error ? " login__error_active" : "");

  const inputErrorClassName = (error) => "login__input" + (error ? " login__input_type_error" : "");

  return (
    <div className="login">
      <h2 className="login__title">Вход</h2>
      <form className="login__form" onSubmit={handleSubmit}>
        <fieldset className="login__set">
          <label className="login__field">
            <input 
              className={inputErrorClassName(errors.email)} 
              placeholder="Email"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
            <span className={spanErrorClassName(errors.email)}>{errors.email}</span>
          </label>

          <label className="login__field">
            <input
              className={inputErrorClassName(errors.password)}
              placeholder="Пароль"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange} 
            />
            <span className={spanErrorClassName(errors.password)}>{errors.password}</span>
          </label>
        </fieldset>
        <button 
          className={"login__submit-button button" + (isValid ? "" : " button_disabled")} 
          type="submit">Войти</button>
      </form>
      <span className='login__span'>Нет аккаунта?
        <Link className="login__link" to="/sign-up"> Зарегистрироваться</Link>
      </span>
    </div>
  )
}

export default withRouter(Login);