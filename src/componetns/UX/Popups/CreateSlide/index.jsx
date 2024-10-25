import React from 'react';
import styles from './CreateSlide.module.scss';
import { AuthContext } from '../../../../context';
import { createSlide } from '../../../../http/productAPI';
import { useNavigate } from 'react-router-dom';

const CreateSlide = () => {

    const inputRef = React.useRef();
    const navigate = useNavigate();
    const { setCreateSlideMode } = React.useContext(AuthContext);
    const [img, setImg] = React.useState(null);
    const [url, setUrl] = React.useState('');

    const success = () => {
        window.alert('Novo slide adicionado com sucesso!');
        setCreateSlideMode(false);  
        navigate('/auth');
        window.scrollTo(0, 0);
    }

    const message = () => {
        window.alert('Ocorreu um erro!');        
    }

    const selectFile = (event) => {
        setImg(event.target.files[0]);
    }

    const onChangeUrl = (event) => {
        setUrl(event.target.value.trim());
    }

    const closeCreatePopup = () => {
        setCreateSlideMode(false);
    }

    const pushSlide = (e) => {
        e.preventDefault();
        const newUrl = url.split('#').pop();
        const formData = new FormData();
        formData.append('img', img);
        formData.append('url', newUrl);
        createSlide(formData).then(data => success()).catch(err => message());
    }

    return (
        <div className={styles.createSlide}>
            <svg onClick={closeCreatePopup} className={styles.close} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 352 512">
                <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
            </svg>
            <form onSubmit={pushSlide} className={styles.formSlide}>
                <div className={styles.line}>
                    <label htmlFor="slide-file" className={styles.label}>Imagem:</label>
                    <input id="slide-file" required tabIndex="1" type='file' className={styles.formFile}
                        onChange={selectFile}/>                    
                </div>
                <div className={styles.line}>
                    <label htmlFor="slide-url" className={styles.label}>Url:</label>
                    <input id="slide-url" required tabIndex="2" type='text' className={styles.formInput}
                        ref={inputRef}    
                        value={url}
                        onChange={onChangeUrl} />                    
                </div>
                <button type='submit' tabIndex='3' className={styles.button}>Criar slide</button>
            </form>            
        </div>
    );
};

export default CreateSlide;