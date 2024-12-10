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
    const [hiddenPass, setHiddenPass] = React.useState(true);
    const { setIsAuth, serverDomain } = React.useContext(AuthContext);

    const data = localStorage.getItem("redirected") ? localStorage.getItem("redirected") : '';
    const backToOrderPage = data ? JSON.parse(data) : "";

    React.useEffect(() => {
        if (emailValue.length) {
            async function fetchUser() {
                try {
                    const { data } = await axios
                        .get(
                            `${serverDomain}api/user?email=${emailValue}`,
                    );
                    if (data) {
                        setUser(data);                        
                    }
                } catch (error) {
                    window.alert('User não encontrado!');
                    navigate('/login');
                }
            }
            window.scrollTo(0, 0);
            fetchUser();
        } 
    }, [emailValue, navigate, serverDomain]);     

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (currentUser.id) {
            try {
                await login(email, password);
                localStorage.setItem("auth", "true");
                const loginDate = Date.now();
                localStorage.setItem("date", loginDate);
                setIsAuth(true);
                const userData = JSON.stringify(currentUser);   
                localStorage.setItem("user", userData); 
                if (backToOrderPage) {
                    localStorage.removeItem('redirected');
                    navigate('/order');
                } else {
                    navigate('/auth');                     
                }
            } catch (error) {
                setError(true);
            }
        } else {
            console.log('Autocomplete');
        }
    }

    const updateEmailValue = React.useCallback(
        debounce((str) => {
            setUser({});
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
        setEmail(event.target.value.toLowerCase());
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

    /*React.useEffect(() => {

        setIsAuth(false);
            localStorage.removeItem("auth", "true");
        localStorage.removeItem("user");
    }, []);*/

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
                            <input required id="userEmail" type="email" name='email' autoComplete='new-password' tabIndex="1" className="form-login__input form-login__input_access"
                                ref={inputRef}
                                value={email}
                                onChange={onChangeInputEmail} />   
                        </div>
                        <div className={(!currentUser.id && emailValue.length) ? "form-login__line form-login__line_err _error" : "form-login__line form-login__line_err"}>
                            E-mail inválido!
                        </div>
                        <div className="form-login__line">
                            <label htmlFor="userPassword" className="form-login__label">Palavra-passe</label>
                            <input required id="userPassword" type={hiddenPass ? "password" : "text"} name='password' autoComplete='off' tabIndex="2" className="form-login__input form-login__input_access"
                                ref={inputRef}
                                value={password}
                                onChange={onChangeInputPass} />     
                            {hiddenPass
                                ?
                                <svg onClick={() => setHiddenPass(false)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M572.5 241.4C518.3 135.6 410.9 64 288 64S57.7 135.6 3.5 241.4a32.4 32.4 0 0 0 0 29.2C57.7 376.4 165.1 448 288 448s230.3-71.6 284.5-177.4a32.4 32.4 0 0 0 0-29.2zM288 400a144 144 0 1 1 144-144 143.9 143.9 0 0 1 -144 144zm0-240a95.3 95.3 0 0 0 -25.3 3.8 47.9 47.9 0 0 1 -66.9 66.9A95.8 95.8 0 1 0 288 160z" />
                                </svg>  
                                : 
                                <svg onClick={() => setHiddenPass(true)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                    <path d="M320 400c-75.9 0-137.3-58.7-142.9-133.1L72.2 185.8c-13.8 17.3-26.5 35.6-36.7 55.6a32.4 32.4 0 0 0 0 29.2C89.7 376.4 197.1 448 320 448c26.9 0 52.9-4 77.9-10.5L346 397.4a144.1 144.1 0 0 1 -26 2.6zm313.8 58.1l-110.6-85.4a331.3 331.3 0 0 0 81.3-102.1 32.4 32.4 0 0 0 0-29.2C550.3 135.6 442.9 64 320 64a308.2 308.2 0 0 0 -147.3 37.7L45.5 3.4A16 16 0 0 0 23 6.2L3.4 31.5A16 16 0 0 0 6.2 53.9l588.4 454.7a16 16 0 0 0 22.5-2.8l19.6-25.3a16 16 0 0 0 -2.8-22.5zm-183.7-142l-39.3-30.4A94.8 94.8 0 0 0 416 256a94.8 94.8 0 0 0 -121.3-92.2A47.7 47.7 0 0 1 304 192a46.6 46.6 0 0 1 -1.5 10l-73.6-56.9A142.3 142.3 0 0 1 320 112a143.9 143.9 0 0 1 144 144c0 21.6-5.3 41.8-13.9 60.1z" />
                                </svg>
                            }

                        </div>
                        <div className={error && currentUser && passValue.length ? "form-login__line form-login__line_error _error" : "form-login__line form-login__line_error"}>
                            Palavra-passe inválida!
                        </div>
                        <button type="submit" tabIndex="3" className={ email && password ? "form-login__button _active" : "form-login__button"}>Entre</button>
                    </form>
                    <p className="login-main__text">
                        Não tem uma conta pessoal?
                        <Link to="/registration" onClick={scroll} className="login-main__link">                            
                            Crie aqui.
                        </Link>                            
                    </p>
                    <p className="login-main__text">
                        Esqueceu sua palavra-passe?
                        <Link to="/reset-password" onClick={scroll} className="login-main__link">                            
                            Redefinir aqui.
                        </Link>                            
                    </p>                    
                </div>
            </div>
        </div>
    );
};

export default UserLogIn;