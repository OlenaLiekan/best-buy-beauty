import React from 'react';

import axios from 'axios';
import styles from './AdminPanel.module.scss';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context';
import { setCategoryId } from '../../redux/slices/filterSlice';
import { useDispatch } from 'react-redux';
import { updateDelivery } from '../../http/productAPI';

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
    const dispatch = useDispatch();
    const inputRef = React.useRef();

    const [deliveries, setDeliveries] = React.useState([]);
    const [editPricesMode, setEditPricesMode] = React.useState(false);
    const [activeDelivery, setActiveDelivery] = React.useState(0);
    const [deliveryId, setDeliveryId] = React.useState('');
    const [deliveryPrice, setDeliveryPrice] = React.useState('');
    const [deliverySum, setDeliverySum] = React.useState('');

    React.useEffect(() => {
        axios.get(`${serverDomain}api/delivery`)
            .then((res) => {
                setDeliveries(res.data);
            });
    }, [serverDomain, editPricesMode]);

    React.useEffect(() => {
        if (path) {
            if (path === 'produtos') {
                dispatch(setCategoryId(0));
                localStorage.removeItem('categoryId');
                localStorage.removeItem('subItems');
            }
            navigate(`/${path}`);
            window.scrollTo(0, 0);
        }
    }, [path, navigate, dispatch]);

    const setDelivery = (index, id) => {
        setActiveDelivery(index);
        setDeliveryId(id);
    }

    const editDeliveryPrices = () => {
        setEditPricesMode(true);
    }

    const onChangePrice = (event) => { 
        setDeliveryPrice(event.target.value);            
    };

    const onChangeSum = (event) => { 
        setDeliverySum(event.target.value);            
    };

    const cancelEdit = () => {
        setEditPricesMode(false);
        setActiveDelivery(0);
        setDeliveryId('');
        setDeliveryPrice('');
        setDeliverySum('');
    }

    const success = () => {
        window.alert('Condições alteradas com sucesso!');
        setEditPricesMode(false);
    }

    const updateConditions = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const id = deliveryId;
        formData.set('price', deliveryPrice);
        formData.set('requiredSum', deliverySum);                     
        updateDelivery(formData, id).then(data => success());
    }

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
                    {!editPricesMode
                        ?
                        <>
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
                            <button type='button' onClick={editDeliveryPrices} className={styles.upBtn}>Atualizar</button>
                        </>
                        :
                        <form onSubmit={updateConditions} className={styles.deliveryForm}>
                            <div className={styles.formLineList}>
                                <ul className={styles.deliveriesList}>
                                    {deliveries.map((delivery, i) => 
                                        <li className={i === activeDelivery ? styles.deliveryTypeActive : styles.deliveryType} key={i} onClick={() => setDelivery(i, delivery.id)}>{delivery.type}</li>
                                    )}
                                </ul>
                            </div>
                            <div className={styles.formLine}> 
                                <label htmlFor="delivery-price" className={styles.deliveryLabel}>Preço:</label>
                                <input required id="delivery-price" className={styles.deliveryInput} placeholder='0.00'
                                    ref={inputRef}
                                    value={deliveryPrice}
                                    onChange={onChangePrice}
                                />
                            </div>
                            <div className={styles.formLine}>
                                <label htmlFor="delivery-sum" className={styles.deliveryLabel}>Montante total:</label>
                                <input required id="delivery-sum" className={styles.deliveryInput} placeholder='0.00'
                                    ref={inputRef}
                                    value={deliverySum}
                                    onChange={onChangeSum}
                                />
                            </div>
                           <button type='submit' className={styles.subBtn}>Confirme</button> 
                           <button type='button' onClick={cancelEdit} className={styles.cancelBtn}>Cancelar</button> 
                        </form>
                    }
                </div>
                :
                ''
            }
        </div>
    );
};

export default AdminPanel;