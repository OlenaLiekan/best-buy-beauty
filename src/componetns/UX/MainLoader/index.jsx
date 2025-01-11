import React from 'react';
import styles from './MainLoader.module.scss';
import loaderLogo from '../../../assets/img/logo2.png';

const MainLoader = () => {
    return (
        <div className="main__content">
            <div className={styles.loaderWrapper}>
                <div className={styles.loaderLogo}>
                    <img src={loaderLogo} alt="loader"/>
                </div>                
            </div>
        </div>
    );
};

export default MainLoader;