import React from 'react';
import styles from './UpdatePassword.module.scss';
import { updateUser, login } from '../../../../http/userAPI';
import { AuthContext } from '../../../../context';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = ({userId}) => {

    const inputRef = React.useRef();
    const navigate = useNavigate();

    const { setIsAuth, setUpdatePassMode } = React.useContext(AuthContext);
    const [password, setPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');    
    const [checkPassword, setCheckPassword] = React.useState('');
    const [error, setError] = React.useState(false);

    const data = localStorage.getItem('user');
    const user = JSON.parse(data);

    const onChangePassword = (event) => { 
        setError(false);
        setPassword(event.target.value);
    };

    const onChangeNewPassword = (event) => { 
        setNewPassword(event.target.value);
    };    

    const onChangeCheckPassword = (event) => { 
        setCheckPassword(event.target.value);
    };  

    const success = () => {
        window.alert('Senha alterada com sucesso!');
        setUpdatePassMode(false);
        window.scrollTo(0, 0);
        setIsAuth(false);
        localStorage.removeItem('auth');
        navigate('/login');
    }

    const message = () => {
        window.alert('Ocorreu um erro!');        
    }


    const updateUserData = async (e) => {
        e.preventDefault();
        try {
            const email = user.email;
            await login(email, password);
            if (newPassword === checkPassword) {
                const formData = new FormData();
                const id = userId;
                formData.set('id', id);
                formData.set('password', newPassword);
                updateUser(formData, id).then((data) => success()).catch(err => message());
            }
        } catch (error) {
            setError(true);
        }    
    }
    
    return (
        <div className={styles.body}>     
            <form onSubmit={updateUserData} id="passwordForm" className={styles.userPasswordForm}>
                <div className={styles.formLine}>
                    <label htmlFor="user-password-input" className={styles.formLabel}>Senha</label>
                    <input required id="user-password-input" tabIndex="1" autoComplete="off" type="password" name="password" className={styles.formInput}
                        ref={inputRef}
                        value={password}
                        onChange={onChangePassword}/>
                </div>
                <div className={error ? styles.error : styles.hidden}>Senha incorreta!</div>
                <div className={styles.formLine}>
                    <label htmlFor="user-newPassword-input" className={styles.formLabel}>Nova Senha</label>
                    <input required id="user-newPassword-input" tabIndex="2" autoComplete="off" type="password" name="newPassword" className={styles.formInput}
                        ref={inputRef}
                        value={newPassword}
                        onChange={onChangeNewPassword}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-checkPassword-input" className={styles.formLabel}>Repita</label>
                    <input required id="user-checkPassword-input" tabIndex="3" autoComplete="off" type="password" name="checkPassword" className={styles.formInput}
                        ref={inputRef}
                        value={checkPassword}
                        onChange={onChangeCheckPassword}/>
                </div>
                <div className={checkPassword.length && checkPassword !== newPassword ? styles.error : styles.hidden}>Senhas nao sao as mesmas!</div>
                <button type='submit' tabIndex="4" className={styles.formBtnSubmit}>
                    Atualizar
                </button>
            </form>                   
        </div>
    );
};

export default UpdatePassword;