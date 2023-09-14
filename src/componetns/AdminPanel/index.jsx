import React, { useState } from 'react';

import styles from './AdminPanel.module.scss';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {

    const arr = [
        { name: 'Tipo', path: 'catalog' },
        { name: 'Produto', path: 'produtos' },
        { name: 'Marca', path: ' ' },
        { name: 'Slide', path: ' ' }
    ];
    const [path, setPath] = useState('');
    const navigate = useNavigate();

    React.useEffect(() => {
        if (path) {
            navigate(`/${path}`);
            window.scrollTo(0, 0);
        }
    }, [path]);

    return (
        <div className={styles.actions}>
            <form className={styles.form}>
                <h3 className={styles.formTitle}>
                    Onde você gostaria de fazer alterações?
                </h3>
                <div className={styles.formBody}>
                    {arr.map((item, i) => 
                        <button key={item.name} value={item.path} onClick={() => setPath(item.path)} className={styles.button}>
                            {item.name}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AdminPanel;