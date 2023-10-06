import React from 'react';

import axios from 'axios';
import styles from './AdminPanel.module.scss';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context';

const AdminPanel = () => {

    const arr = [
        { name: 'Tipo', path: 'catalog' },
        { name: 'Produto', path: 'produtos' },
        { name: 'Marca', path: ' ' },
        { name: 'Slide', path: ' ' }
    ];
    const [path, setPath] = React.useState('');
    const { serverDomain } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const [deliveries, setDeliveries] = React.useState([]);

    React.useEffect(() => {
        axios.get(`${serverDomain}api/delivery`)
            .then((res) => {
                setDeliveries(res.data);
            });
    }, []);

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
            {deliveries.length
                ?
                <div className={styles.deliveryBlock}>
                    <h4>Valor da entrega</h4>
                    <div className={styles.deliveryItems}>
                        {deliveries.map((delivery, i) => 
                            <div key={i} className={styles.deliveryItem}>
                                <div className={styles.deliveryTitle}>
                                    {delivery.type}: 
                                </div>
                                <div className={styles.deliveryPrice}>
                                    {delivery.price === '0.00' ? '' : delivery.price + ' €'}
                                    {delivery.requiredSum === '0.00' ? '' : ` num total de ${delivery.requiredSum} €`}
                                </div>
                            </div>                    
                        )}
                    </div>
                    <button type='button' className={styles.upBtn}>Atualizar</button>
                </div>
                :
                ''
            }
        </div>
    );
};

export default AdminPanel;