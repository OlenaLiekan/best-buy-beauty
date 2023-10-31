import React from 'react';
import { AuthContext } from '../context';
import AdminPanel from '../componetns/AdminPanel';
import UserPanel from '../componetns/UserPanel/UserPanel';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {

    const {isAuth, setIsAuth, adminMode, setAdminMode, createMode, updateMode} = React.useContext(AuthContext);

    const navigate = useNavigate();
    const data = localStorage.getItem("user");
    const user = JSON.parse(data);
    
    React.useEffect(() => {
        if (user.role === "ADMIN") {
            setAdminMode(true);
        } else {
            setAdminMode(false);
            localStorage.removeItem("adminMode", "true");
        }

        if (adminMode) {
            localStorage.setItem("adminMode", "true");            
        }

        if (isAuth) {
            const loginDate = localStorage.getItem("date");        
            let result = Date.now() - loginDate;
                if ( result > 86399998) {
                    if (adminMode) {
                        setAdminMode(false);
                        localStorage.removeItem("adminMode", "true");
                    }
                    localStorage.removeItem('user');
                    setIsAuth(false);    
                    localStorage.removeItem('auth');
                    localStorage.removeItem('date');
                    navigate("/login");
                } 
        }
    }, [isAuth, createMode, updateMode, adminMode, user.role, setAdminMode, navigate, setIsAuth]);

    return (
        <div className="main__account account-main">
            <div className="account-main__container">
                <div className="account-main__content">
                    <h2 className="account-main__title">
                        Ola, {adminMode ? 'administrador' : ''} <span>{user.firstName && user.lastName ? user.firstName + ' ' + user.lastName + ' !' : "Usuário !"}</span> 
                    </h2>
                    <h2 className="account-main__subtitle">
                        Fico feliz em vê-lo novamente
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" />
                        </svg>
                    </h2>
                    <div className="account-main__body body-account">
                        {
                            !adminMode
                                ?
                                <UserPanel user={user} />
                                :
                                <AdminPanel />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;