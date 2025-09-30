import React from 'react';
import styles from './AuthAsideMenu.module.scss';
import { AuthContext } from '../../context';

const AuthAsideMenu = ({ user, menuItems }) => {

    const { activeAuthOption, setActiveAuthOption } = React.useContext(AuthContext);

    const onClickMenuItem = (id) => {
        setActiveAuthOption(id)
        window.scrollTo(0, 100);
    };
    
    return (
        <div className={styles.aside}>
            <div className={styles.asideTop}>
                <div>{user.email ? user.email : ''}</div>                            
            </div>
            <ul className={styles.asideMenu}>
                {menuItems.map((option, id) => 
                    <li key={id}
                        value={option}
                        onClick={() => onClickMenuItem(id)}
                        className={activeAuthOption === id ? styles.asideMenuItemBlack : styles.asideMenuItem}>
                        {option}
                    </li>                                
                )}
            </ul>
        </div>

    );
};

export default AuthAsideMenu;