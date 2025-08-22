import React from 'react';
import axios from 'axios';
import styles from './AdminPanel.module.scss';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context';
import LogoLoader from '../UI/Skeletons/LogoSkeleton';
import LogoTextLoader from '../UI/Skeletons/LogoTextSkeleton';
import { ADMIN_INITIAL_OPTIONS } from '../../constants';
import {
    updateLogo,
} from '../../http/productAPI';

const AdminInitial = () => {

    const [editLogoMode, setEditLogoMode] = React.useState(false);
    const [logoName, setLogoName] = React.useState('');
    const [logoImg, setLogoImg] = React.useState(null);
    const [logo, setLogo] = React.useState('');
    const [logoLoading, setLogoLoading] = React.useState(false);
    const {
        serverDomain,
        imagesCloud,
        isPromoPage,
        setIsPromoPage,
    } = React.useContext(AuthContext);

    const inputRef = React.useRef();

    const message = () => {
        window.alert('Ocorreu um erro!');
    };

    React.useEffect(() => {
        setLogoLoading(true);
        axios.get(`${serverDomain}api/logo/1`)
            .then((res) => {
                setLogo(res.data);
                setLogoLoading(false);
            });
    }, [serverDomain, editLogoMode]);

    React.useEffect(() => {
        if (!logoLoading && logo) {
            setLogoImg(logo.img);
            setLogoName(logo.logoName);
        }
    }, [logoLoading, logo]);

    const onChangeLogoName = (event) => {
        setLogoName(event.target.value);
    };

    const selectFile = (event) => {
        setLogoImg(event.target.files[0]);
    };

     const cancelEdit = () => {
        if (editLogoMode) {
            setEditLogoMode(false);
            setLogoName('');
            setLogoImg(null);
        }
    };

    const success = () => {
        if (editLogoMode) {
            window.alert('Logotipo atualizado com sucesso!');
            setEditLogoMode(false);
        }
    };

    const pushLogo = (e) => {
        e.preventDefault();
        const logoId = 1;
        const formData = new FormData();
        formData.set('logoImg', logoImg);
        formData.set('logoName', logoName);
        updateLogo(formData, logoId).then(data => success()).catch(err => message());
    };

    const showLogoMenu = () => {
        setEditLogoMode(true);
        window.scrollTo(0, 0);
    };

    const toTop = () => {
        if (isPromoPage) {
            setIsPromoPage(false);
        }
        window.scrollTo(0, 0);
    };


    return (
        <>
            {!editLogoMode
                ?
                <div className={styles.logo}>
                    <div className={styles.logoBox}>
                        <div className={styles.logoImg}>
                            {
                                !logoLoading && logo
                                ?
                                <img src={`${imagesCloud}` + logo.img} alt='logo' />
                                :
                                <LogoLoader/>
                            }
                        </div>
                        <svg onClick={showLogoMenu} className={styles.logoAction} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                            <path d="M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z" />
                        </svg>
                    </div>
                    <div className={styles.logoText}>
                        {!logoLoading && logo ? logo.logoName : <LogoTextLoader />}
                    </div>
                </div>
                :
                <form onSubmit={pushLogo} className={styles.logoForm}>
                    <div className={styles.formLogoLine}>
                        <label htmlFor="logo-file" className={styles.logoLabel}>Imagem:</label>
                        <input id="logo-file" tabIndex="1" type='file' className={styles.logoFile}
                            onChange={selectFile}/>                    
                    </div>
                    <div className={styles.formLogoLine}>
                        <label htmlFor="logo-name" className={styles.logoLabel}>Nome:</label>
                        <input required id="logo-name" tabIndex="2" className={styles.logoInput} placeholder='Nome'
                            ref={inputRef}
                            value={logoName}
                            onChange={onChangeLogoName}
                        />
                    </div>
                    <button type='submit' className={styles.subBtn}>Confirme</button> 
                    <button type='button' onClick={cancelEdit} className={styles.cancelBtn}>Cancelar</button> 
                </form>
            }
            {
                !editLogoMode &&
                    <form className={styles.form}>
                        <h3 className={styles.formTitle}>
                            Onde você gostaria de fazer alterações?
                        </h3>
                        
                        <div className={styles.formBody}>
                            {ADMIN_INITIAL_OPTIONS.map((item, i) => 
                                <Link to={'/' + item.path} key={item.name}>
                                    <button onClick={toTop} className={styles.button}>
                                        {item.name}
                                    </button>
                                </Link>
                            )}
                        </div>
                    </form>                
            }

        </>
    );
}

export default AdminInitial;