import React from 'react';
import styles from './UpdateSlide.module.scss';
import { AuthContext } from '../../../../context';
import { updateSlide } from '../../../../http/productAPI';
import { useNavigate } from 'react-router-dom';

const UpdateSlide = ({slideItem}) => {

    const inputRef = React.useRef();
    const navigate = useNavigate();
    const { setUpdateSlideMode } = React.useContext(AuthContext);

    const [img, setImg] = React.useState(null);
    const [url, setUrl] = React.useState('');

    React.useEffect(() => {
        setUrl(slideItem.url);   
    }, [slideItem]);

    const success = () => {
        window.alert('Novo slide foi atualizado com sucesso!');
        setUpdateSlideMode(false);  
        navigate('/auth');
        window.scrollTo(0, 0);
    }

    const selectFile = (event) => {
        setImg(event.target.files[0]);
    }

    const onChangeUrl = (event) => {
        setUrl(event.target.value);
    }

    const closeUpdatePopup = () => {
        setUpdateSlideMode(false);
    }

    const pushSlide = (e) => {
        e.preventDefault();
        const id = slideItem.id;
        const formData = new FormData();
        if (img) {
            formData.append('img', img);            
        }
        formData.append('url', url)
        updateSlide(formData, id).then(data => success());
    }

    return (
        <div className={styles.updateSlide}>
            <svg onClick={closeUpdatePopup} className={styles.close} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 352 512">
                <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
            </svg>
            <form onSubmit={pushSlide} className={styles.formSlide}>
                <div className={styles.line}>
                    <label htmlFor="slide-file" className={styles.label}>Imagem:</label>
                    <input id="slide-file" tabIndex="1" type='file' className={styles.formFile}
                        onChange={selectFile}/>                    
                </div>
                <div className={styles.line}>
                    <label htmlFor="slide-url" className={styles.label}>Url:</label>
                    <input id="slide-url" tabIndex="2" type='text' className={styles.formInput}
                        ref={inputRef}    
                        value={url}
                        onChange={onChangeUrl} />                    
                </div>
                <button type='submit' tabIndex='3' className={styles.button}>Atualizar slide</button>
            </form>            
        </div>
    );
};

export default UpdateSlide;