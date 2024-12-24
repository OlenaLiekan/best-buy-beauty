import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkedCheckbox } from '../js/script';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { registration } from '../http/userAPI.js';
import { AuthContext } from '../context';

const Registration = () => {

    const inputRef = React.useRef();
    const navigate = useNavigate();
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');    
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [emailValue, setEmailValue] = React.useState('');
    const [password, setPass] = React.useState('');
    const [checkPass, setCheckPass] = React.useState('');
    const [checkPassValue, setCheckPassValue] = React.useState('');
    const [currentUser, setUser] = React.useState({});
    const [hiddenPass, setHiddenPass] = React.useState(true);
    const [hiddenCheckPass, setHiddenCheckPass] = React.useState(true);
    const { serverDomain } = React.useContext(AuthContext);

    React.useEffect(() => {
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
            }
        }
        window.scrollTo(0, 0);
        fetchUser();
    }, [emailValue, serverDomain]); 

    const createAccount = async (e) => {
        e.preventDefault();
        try {
            await registration(email, password, firstName, lastName, phone); 
            navigate('/login');
            window.scrollTo(0, 0);
            window.alert('Parabéns! Sua conta foi criada com sucesso.');
        } catch (error) {
            window.alert('error');
        }
    }


    const updateEmailValue = React.useCallback(
        debounce((str) => {
            setEmailValue(str);
        }, 600),
        [],
    );

    const updateCheckPassValue = React.useCallback(
        debounce((str) => {
           setCheckPassValue (str);
        }, 600),
        [],
    );

    const onChangeUsername = (event) => { 
        setFirstName(event.target.value ? event.target.value[0].toUpperCase() + event.target.value.slice(1) : '');
    };

    const onChangeSurname = (event) => { 
        setLastName(event.target.value ? event.target.value[0].toUpperCase() + event.target.value.slice(1) : '');
    };

    const onChangePhone = (event) => { 
        setPhone(event.target.value.slice(0, 13));
    };

    const onChangeEmail = (event) => { 
        setEmail(event.target.value.toLowerCase());
        updateEmailValue(event.target.value);
    };

    const onChangePass = (event) => { 
        setPass(event.target.value);
    };

    const onChangeCheckPass = (event) => { 
        setCheckPass(event.target.value);
        updateCheckPassValue(event.target.value);
    };

    const scroll = () => {
        window.scrollTo(0, 0);
    }
    return (
        <div className="main__login login-main">
            <div className="login-main__container">
                <div className="login-main__content">
                    <form onSubmit={createAccount} className="login-main__form form-login">
                        <h2 className="form-login__title">
                            Crie sua conta pessoal.
                        </h2>
                        <div className="form-login__line">
                            <label htmlFor="userName" className="form-login__label">Primeiro Nome <span>*</span></label>
                            <input required id="userName" type="text" tabIndex="1" name='name' placeholder="Primeiro Nome" className="form-login__input"
                                ref={inputRef}
                                value={firstName}
                                onChange={onChangeUsername}/>                            
                        </div>
                        <div className="form-login__line">
                            <label htmlFor="userSurname" className="form-login__label">Último Nome</label>
                            <input required id="userSurname" type="text" tabIndex="2" name='surname' placeholder="Último Nome" className="form-login__input"
                                ref={inputRef}
                                value={lastName}
                                onChange={onChangeSurname}/>                            
                        </div>
                        <div className="form-login__line">
                            <label htmlFor="userEmail" className="form-login__label">E-mail <span>*</span></label>
                            <input required id="userEmail" type="email" tabIndex="3" name='email' placeholder="example@email.com" className="form-login__input" 
                                ref={inputRef}
                                value={email}
                                onChange={onChangeEmail}/> 
                        </div>
                        <div className={emailValue && currentUser.email === emailValue ? "form-login__line form-login__line_error _error" : "form-login__line form-login__line_error"}>
                            Este e-mail já existe!
                        </div>
                        <div className="form-login__line">
                            <label htmlFor="userPhone" className="form-login__label">Telemóvel</label>
                            <input required id="userPhone" type="tel" tabIndex="4" name='phone' pattern="\+?[0-9\s\-\(\)]+" placeholder="+351XXXXXXXXX" className="form-login__input" 
                                ref={inputRef}
                                value={phone}
                                onChange={onChangePhone}
                            />
                        </div>

                        <div className="form-login__line">
                            <label htmlFor="userPassword" className="form-login__label">Palavra-passe <span>*</span></label>
                            <input required id="userPassword" type={hiddenPass ? "password" : "text"} name='password' tabIndex="5" placeholder="Criar uma palavra-passe" className="form-login__input" 
                                ref={inputRef}
                                value={password}
                                onChange={onChangePass} /> 
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
                        <div className="form-login__line">
                            <label htmlFor="userCheckPassword" className="form-login__label">Сonfirmar a palavra-passe <span>*</span></label>
                            <input required id="userCheckPassword" type={hiddenCheckPass ? "password" : 'text'} name='checkPass' tabIndex="6" placeholder="Repita a palavra-passe" className="form-login__input" 
                                ref={inputRef}
                                value={checkPass}
                                onChange={onChangeCheckPass} /> 
                                {hiddenCheckPass
                                ?
                                <svg onClick={() => setHiddenCheckPass(false)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M572.5 241.4C518.3 135.6 410.9 64 288 64S57.7 135.6 3.5 241.4a32.4 32.4 0 0 0 0 29.2C57.7 376.4 165.1 448 288 448s230.3-71.6 284.5-177.4a32.4 32.4 0 0 0 0-29.2zM288 400a144 144 0 1 1 144-144 143.9 143.9 0 0 1 -144 144zm0-240a95.3 95.3 0 0 0 -25.3 3.8 47.9 47.9 0 0 1 -66.9 66.9A95.8 95.8 0 1 0 288 160z" />
                                </svg>  
                                : 
                                <svg onClick={() => setHiddenCheckPass(true)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                    <path d="M320 400c-75.9 0-137.3-58.7-142.9-133.1L72.2 185.8c-13.8 17.3-26.5 35.6-36.7 55.6a32.4 32.4 0 0 0 0 29.2C89.7 376.4 197.1 448 320 448c26.9 0 52.9-4 77.9-10.5L346 397.4a144.1 144.1 0 0 1 -26 2.6zm313.8 58.1l-110.6-85.4a331.3 331.3 0 0 0 81.3-102.1 32.4 32.4 0 0 0 0-29.2C550.3 135.6 442.9 64 320 64a308.2 308.2 0 0 0 -147.3 37.7L45.5 3.4A16 16 0 0 0 23 6.2L3.4 31.5A16 16 0 0 0 6.2 53.9l588.4 454.7a16 16 0 0 0 22.5-2.8l19.6-25.3a16 16 0 0 0 -2.8-22.5zm-183.7-142l-39.3-30.4A94.8 94.8 0 0 0 416 256a94.8 94.8 0 0 0 -121.3-92.2A47.7 47.7 0 0 1 304 192a46.6 46.6 0 0 1 -1.5 10l-73.6-56.9A142.3 142.3 0 0 1 320 112a143.9 143.9 0 0 1 144 144c0 21.6-5.3 41.8-13.9 60.1z" />
                                </svg>
                                }
                        </div>
                        <div className={checkPassValue && password !== checkPassValue ? 'form-login__line form-login__line_error _error' : "form-login__line form-login__line_error" }>
                            As palavras-passe não coincidem.
                        </div>
                        <div className="form-login__text">
                            Seus dados não serão repassados a terceiros.                           
                        </div>
                        <div className="form-login__line form-login__line_checkbox">
                            <label onClick={checkedCheckbox} htmlFor="userCheckBox" className="form-login__label checkbox-label">
                                Eu concordo com o processamento dos meus dados<span>*</span>
                            </label>
                            <input required id="userCheckBox" type="checkbox" name="agree" tabIndex="7" className="form-login__checkbox" /> 
                        </div>
                        <button type="submit" tabIndex="8" className="form-login__button form-login__button _active">Crie a sua conta aqui</button>
                    </form>
                    <p className="login-main__text">
                        Já tem uma conta pessoal?
                        <Link to="/login" onClick={scroll} className="login-main__link">                            
                            Entre aqui.
                        </Link>                            
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;