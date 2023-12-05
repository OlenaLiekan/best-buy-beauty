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
        setPhone(event.target.value);
    };

    const onChangeEmail = (event) => { 
        setEmail(event.target.value);
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
                            <label htmlFor="userName" className="form-login__label">Nome <span>*</span></label>
                            <input required id="userName" type="text" tabIndex="1" name='name' placeholder="Nome" className="form-login__input"
                                ref={inputRef}
                                value={firstName}
                                onChange={onChangeUsername}/>                            
                        </div>
                        <div className="form-login__line">
                            <label htmlFor="userSurname" className="form-login__label">Sobrenome</label>
                            <input required id="userSurname" type="text" tabIndex="2" name='surname' placeholder="Sobrenome" className="form-login__input"
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
                            Este e-mail já existe.
                        </div>
                        <div className="form-login__line">
                            <label htmlFor="userPhone" className="form-login__label">Número de telefone</label>
                            <input required id="userPhone" type="tel" tabIndex="4" name='phone' pattern="[+]{1}[0-9]{12}" placeholder="+351XXXXXXXXX" className="form-login__input" 
                                ref={inputRef}
                                value={phone}
                                onChange={onChangePhone}/> 
                        </div>
                        <div className="form-login__line">
                            <label htmlFor="userPassword" className="form-login__label">Senha <span>*</span></label>
                            <input required id="userPassword" type="password" name='password' tabIndex="5" placeholder="Criar uma senha" className="form-login__input" 
                                ref={inputRef}
                                value={password}
                                onChange={onChangePass}/> 
                        </div>
                        <div className="form-login__line">
                            <label htmlFor="userCheckPassword" className="form-login__label">Verifique a senha <span>*</span></label>
                            <input required id="userCheckPassword" type="password" name='checkPass' tabIndex="6" placeholder="Repita a senha" className="form-login__input" 
                                ref={inputRef}
                                value={checkPass}
                                onChange={onChangeCheckPass}/> 
                        </div>
                        <div className={checkPassValue && password !== checkPassValue ? 'form-login__line form-login__line_error _error' : "form-login__line form-login__line_error" }>
                            As senhas não correspondem.
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
                        <button type="submit" tabIndex="8" className="form-login__button">Crie a sua conta aqui</button>
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