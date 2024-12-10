import React from 'react';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/index.js';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { updateUser } from '../http/userAPI';
import { sendNewPass } from '../http/productAPI.js';

const ResetPassword = () => {

    const inputRef = React.useRef();
    const navigate = useNavigate();

    const [error, setError] = React.useState(false);
    const [currentUser, setUser]  = React.useState({});
    const [email, setEmail] = React.useState('');
    const [emailValue, setEmailValue] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const { serverDomain } = React.useContext(AuthContext);

    const symbols = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!";

    React.useEffect(() => {
        if (currentUser.id) {
            let random = symbols[Math.floor(Math.random() * symbols.length)];
            let newSymbols = "";
            while (newSymbols.length < 8) {
            newSymbols += random;
            random = symbols[Math.floor(Math.random() * symbols.length)];
            }
            setNewPassword(newSymbols);            
        }
    }, [currentUser]);

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
                    navigate('/reset-password');
                }
            }
            window.scrollTo(0, 0);
            fetchUser();
        } 
    }, [emailValue, serverDomain]); 

    const success = () => {
        window.alert('Palavra-passe alterada com sucesso! Verifique seu e-mail.');
        window.scrollTo(0, 0);
        navigate('/login');        
    }

    const updatedSuccessfully = () => {
        const formData = new FormData();
        formData.set('userEmail', email);
        formData.set('userName', currentUser.firstName);
        formData.set('userNewPass', newPassword); 
        console.log(newPassword);
        sendNewPass(formData)
            .then((data) => success())
            .catch((err) => console.log("Erro ao enviar e-mail"));
    }

    const message = () => {
        window.alert('Ocorreu um erro!');        
    }

    const updateUserPassword = async (e) => {
        e.preventDefault();
        if (currentUser.id && newPassword) {
            try {
                const formData = new FormData();
                const id = currentUser.id;
                formData.set('id', id);
                formData.set('password', newPassword);
                updateUser(formData, id).then((data) => updatedSuccessfully()).catch(err => message());
            } catch (error) {
                setError(true);
            }    
        }
    }

    const updateEmailValue = React.useCallback(
        debounce((str) => {
            setUser({});
            setNewPassword('')
            setEmailValue(str);
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
        setNewPassword(event.target.value);
    };
    
    return (
        <div className="main__login login-main">
            <div className="login-main__container">
                <div className="login-main__content">
                    <form onSubmit={updateUserPassword} className="login-main__form form-login">
                        <h2 className="form-login__title">
                            Por favor, insira o endereço de e-mail que já foi usado para fazer login em sua conta.
                        </h2>
                        <div className="form-login__line">
                            <label htmlFor="userEmail" className="form-login__label">E-mail</label>
                            <input required id="userEmail" type="email" name='email' autoComplete='new-password' tabIndex="1" className="form-login__input form-login__input_access"
                                ref={inputRef}
                                value={email}
                                onChange={onChangeInputEmail} />                            
                        </div>
                        <div className={(!currentUser.id && emailValue.length) ? "form-login__line form-login__line_err _error" : "form-login__line form-login__line_err"}>
                            Não há nenhuma conta com este e-mail.
                        </div>
                        <div className="form-login__line">
                            <label hidden htmlFor="userPassword" className="form-login__label">Palavra-passe</label>
                            <input hidden id="userPassword" type="text" name='password' autoComplete='off' tabIndex="2" className="form-login__input form-login__input_access"
                                ref={inputRef}
                                value={newPassword}
                                onChange={onChangeInputPass}/>                            
                        </div>
                        <h3 className="form-login__title">Enviaremos uma nova palavra-passe para seu e-mail.</h3>
                        <button type="submit" tabIndex="3" className={ email && newPassword ? "form-login__button _active" : "form-login__button"}>Enviar palavra-passe</button>
                    </form>         
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;