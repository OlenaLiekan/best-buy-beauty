import React from 'react';
import styles from './UpdateBrand.module.scss';
import { AuthContext } from '../../../../context';
import { updateBrand } from '../../../../http/productAPI';
import { useNavigate } from 'react-router-dom';

const UpdateBrand = ({brandItem}) => {

    const inputRef = React.useRef();
    const navigate = useNavigate();
    const { setUpdateCompanyMode } = React.useContext(AuthContext);

    const [img, setImg] = React.useState(null);
    const [name, setName] = React.useState('');

    React.useEffect(() => {
        setName(brandItem.name);   
    }, [brandItem]);

    const success = () => {
        window.alert('A marca foi atualizada com sucesso!');
        setUpdateCompanyMode(false);  
        navigate('/auth');
        window.scrollTo(0, 0);
    }

    const selectFile = (event) => {
        setImg(event.target.files[0]);
    }

    const onChangeName = (event) => { 
        setName(event.target.value);
    };

    const closeUpdatePopup = () => {
        setUpdateCompanyMode(false);
    }

    const pushBrand = (e) => {
        e.preventDefault();
        const id = brandItem.id;
        const formData = new FormData();
        formData.set('name', name);
        if (img) {
            formData.set('img', img);            
        }
        updateBrand(formData, id).then(data => success());
    }

    return (
        <div className={styles.updateBrand}>
            <svg onClick={closeUpdatePopup} className={styles.close} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 352 512">
                <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
            </svg>
            <form onSubmit={pushBrand} className={styles.formBrand}>
                <div className={styles.line}>
                    <label htmlFor="brand-name" className={styles.label}>Nome:</label>
                    <input id="brand-name" required tabIndex="1" type='text' className={styles.formInput}
                        ref={inputRef}    
                        value={name}
                        onChange={onChangeName} />                   
                </div>
                <div className={styles.line}>
                    <label htmlFor="brand-file" className={styles.label}>Imagem:</label>
                    <input id="brand-file" tabIndex="6" type='file' className={styles.formFile}
                        onChange={selectFile}
                    />                   
                </div>
                <button type='submit'tabIndex='13' className={styles.button}>Atualizar marca</button>
            </form>            
        </div>
    );
};

export default UpdateBrand;