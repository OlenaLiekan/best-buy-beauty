import React from 'react';
import styles from './UpdateUser.module.scss';
import { updateUser } from '../../http/userAPI';
import { AuthContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash.debounce';

const UpdateUser = ({userId}) => {

    const inputRef = React.useRef();
    const navigate = useNavigate();

    const { setIsAuth, setUpdateUserMode } = React.useContext(AuthContext);
    const [username, setUsername] = React.useState('');
    const [surname, setSurname] = React.useState('');    
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [emailValue, setEmailValue] = React.useState('');
    const [existingUser, setExistingUser] = React.useState('');

    const data = localStorage.getItem('user');
    const user = JSON.parse(data);

    React.useEffect(() => {
        if (user) {
            setUsername(user.firstName);
            setSurname(user.lastName);
            setPhone(user.phone);
            setEmail(user.email);         
        }
    }, []);

    React.useEffect(() => {
        if (emailValue !== user.email) {
            axios.get(`http://localhost:3001/api/user?email=${emailValue}`)
                .then((res) => {
                    setExistingUser(...res.data);                        
                });            
        }
    }, [emailValue]);

    const onChangeUsername = (event) => { 
        setUsername(event.target.value ? event.target.value[0].toUpperCase() + event.target.value.slice(1) : '');            
    };

    const onChangeSurname = (event) => { 
        setSurname(event.target.value ? event.target.value[0].toUpperCase() + event.target.value.slice(1) : '');
    };

    const onChangePhone = (event) => { 
        setPhone(event.target.value);
    };

    const updateEmailValue = React.useCallback(
        debounce((str) => {
            setEmailValue(str);
        }, 600),
        [],
    );

    const onChangeEmail = (event) => { 
        setEmail(event.target.value);
        updateEmailValue(event.target.value);
    };

    const success = () => {
        window.alert('Dados alterados com sucesso!');
        setUpdateUserMode(false);
        window.scrollTo(0, 0);
        setIsAuth(false);
        localStorage.removeItem('auth');
        navigate('/login');
    }

    const updateUserData = (e) => {
        e.preventDefault();
        if (!existingUser || existingUser.email !== emailValue) {
            const formData = new FormData();
            const id = userId;
            formData.set('id', id);
            formData.set('firstName', username);
            formData.set('lastName', surname);
            formData.set('email', email);
            formData.set('phone', phone);
            updateUser(formData, id).then((data) => success());            
        }
    }
    
    return (
        <div className={styles.body}>     
            <form onSubmit={updateUserData} id="addressForm" className={styles.userDataForm}>
                <div className={styles.formLine}>
                    <label htmlFor="user-name-input" className={styles.formLabel}>Primeiro Nome</label>
                    <input required id="user-name-input" tabIndex="1" autoComplete="off" type="text" name="name" data-error="Error" placeholder='Nome' className={styles.formInput}
                        ref={inputRef}
                        value={username}
                        onChange={onChangeUsername}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-surname-input" className={styles.formLabel}>Último Nome</label>
                    <input required id="user-surname-input" tabIndex="2" autoComplete="off" type="text" name="surname" data-error="Error" placeholder="Sobrenome" className={styles.formInput}
                        ref={inputRef}
                        value={surname}
                        onChange={onChangeSurname}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-contact-input" className={styles.formLabel}>Telefone</label>
                    <input required id="user-contact-input" tabIndex="3" autoComplete="off" type="tel" pattern="[+]{1}[0-9]{12}" name="contact" data-error="Error" placeholder="+351XXXXXXXXXX" className={styles.formInput}
                        ref={inputRef}
                        value={phone}
                        onChange={onChangePhone}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-email-input" className={styles.formLabel}>E-mail</label>
                    <input required id="user-email-input" tabIndex="4" autoComplete="off" type="email" name="email" data-error="Error" placeholder="example@email.com" className={styles.formInput} 
                        ref={inputRef}
                        value={email}
                        onChange={onChangeEmail}/>
                </div>
                <div className={existingUser && emailValue.length ? styles.error : styles.hidden}>Já existe usuário com este endereço de email!</div>
                <button type='submit' tabIndex="5" className={styles.formBtnSubmit}>
                    Atualizar
                </button>
            </form>                   
        </div>
    );
};

export default UpdateUser;