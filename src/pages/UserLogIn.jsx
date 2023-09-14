import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/index.js';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { login } from '../http/userAPI.js';

const UserLogIn = () => {

    const inputRef = React.useRef();

    const navigate = useNavigate();
    const [error, setError] = React.useState(false);
    const [currentUser, setUser]  = React.useState({});
    const [email, setEmail] = React.useState('');
    const [emailValue, setEmailValue] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passValue, setPassValue] = React.useState('');
    const { setIsAuth} = React.useContext(AuthContext);

    React.useEffect(() => {
            async function fetchUser() {
                try {
                    const { data } = await axios
                        .get(
                            `http://localhost:3001/api/user?email=${emailValue}`,
                        );
                    setUser(data[0]);
                } catch (error) {
                    window.alert('User não encontrado!');
                    navigate('/login');
                }
            }
            window.scrollTo(0, 0);
        fetchUser();
    }, [emailValue]);     

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            localStorage.setItem("auth", "true");
            const loginDate = Date.now();
            localStorage.setItem("date", loginDate);
            setIsAuth(true);
            const userData = JSON.stringify(currentUser);   
            localStorage.setItem("user", userData); 
            navigate('/auth'); 
        } catch (error) {
            setError(true);
        }
    }

    const updateEmailValue = React.useCallback(
        debounce((str) => {
            setEmailValue(str);
        }, 600),
        [],
    );

    const updatePassValue = React.useCallback(
        debounce((str) => {
            setPassValue(str);
        }, 600),
        [],
    );

    const onChangeInputEmail = (event) => { 
        setError(false);
        setEmail(event.target.value);
        updateEmailValue(event.target.value);
    };

    const onChangeInputPass = (event) => { 
        setError(false);
        setPassword(event.target.value);
        updatePassValue(event.target.value);
    };

    const scroll = () => {
        window.scrollTo(0, 0);
    };
    return (
        <div className="main__login login-main">
            <div className="login-main__container">
                <div className="login-main__content">
                    <form onSubmit={handleFormSubmit} className="login-main__form form-login">
                        <h2 className="form-login__title">
                            Faça login na sua conta pessoal. 
                        </h2>
                        <div className="form-login__line">
                            <label htmlFor="userEmail" className="form-login__label">E-mail</label>
                            <input required id="userEmail" type="email" name='email' autoComplete='off' tabIndex="1" className="form-login__input form-login__input_access"
                                ref={inputRef}
                                value={email}
                                onChange={onChangeInputEmail} />                            
                        </div>
                        <div className={currentUser && !emailValue.length || currentUser && emailValue.length ? "form-login__line form-login__line_err" : "form-login__line form-login__line_err _error"}>
                            E-mail inválido!
                        </div>
                        <div className="form-login__line">
                            <label htmlFor="userPassword" className="form-login__label">Senha</label>
                            <input required id="userPassword" type="password" name='password' autoComplete='off' tabIndex="2" className="form-login__input form-login__input_access"
                                ref={inputRef}
                                value={password}
                                onChange={onChangeInputPass}/>                            
                        </div>
                        <div className={error && currentUser && passValue.length ? "form-login__line form-login__line_error _error" : "form-login__line form-login__line_error"}>
                            Senha inválida!
                        </div>
                        <button type="submit" tabIndex="3" className={ email && password ? "form-login__button _active" : "form-login__button"}>Entre</button>
                    </form>
                    <p className="login-main__text">
                        Não tem uma conta pessoal?
                        <Link to="/registration" onClick={scroll} className="login-main__link">                            
                            Crie aqui.
                        </Link>                            
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserLogIn;