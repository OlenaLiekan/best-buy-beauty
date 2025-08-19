import React from 'react';
import axios from 'axios';
import styles from './AdminPanel.module.scss';
import { updateDelivery } from '../../http/productAPI';
import { AuthContext } from '../../context';

const AdminDeliveryPrices = () => {

    const inputRef = React.useRef();

    const [deliveries, setDeliveries] = React.useState([]);
    const [editPricesMode, setEditPricesMode] = React.useState(false);
    const [activeDelivery, setActiveDelivery] = React.useState(0);
    const [deliveryId, setDeliveryId] = React.useState(1);
    const [deliveryPrice, setDeliveryPrice] = React.useState('');
    const [deliverySum, setDeliverySum] = React.useState('');

    const { serverDomain } = React.useContext(AuthContext);

    const message = () => {
        window.alert('Ocorreu um erro!');
    };

    React.useEffect(() => {
        axios.get(`${serverDomain}api/delivery`)
            .then((res) => {
                setDeliveries(res.data);
            });
    }, [serverDomain, editPricesMode]);

    React.useEffect(() => {
        if (deliveries.length && deliveryId) {
            setDeliveryPrice(deliveries.find((delivery) => delivery.id === deliveryId).price);
            setDeliverySum(deliveries.find((delivery) => delivery.id === deliveryId).requiredSum);
        }
    }, [deliveryId, deliveries]);

    const setDelivery = (index, id) => {
        setActiveDelivery(index);
        setDeliveryId(id);
    };

    const editDeliveryPrices = () => {
        //setEditLogoMode(false);
        setEditPricesMode(true);
    };

    const onChangePrice = (event) => {
        setDeliveryPrice(event.target.value);
    };

    const onChangeSum = (event) => {
        setDeliverySum(event.target.value);
    };

    const cancelEdit = () => {
        if (editPricesMode) {
            setEditPricesMode(false);
            setActiveDelivery(0);
            setDeliveryId('');
            setDeliveryPrice('');
            setDeliverySum('');
        }
    };

    const success = () => {
        if (editPricesMode) {
            window.alert('Condições alteradas com sucesso!');
            setEditPricesMode(false);
            setDeliveryId(1);
            setActiveDelivery(0);
        }
    };

    const updateConditions = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const id = deliveryId;
        formData.set('price', deliveryPrice);
        formData.set('requiredSum', deliverySum);
        updateDelivery(formData, id).then(data => success()).catch(err => message());
    };

    return (
        <> 
            { deliveries.length ?  
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
                                <input required id="delivery-price" tabIndex="1" className={styles.deliveryInput} placeholder='0.00'
                                    ref={inputRef}
                                    value={deliveryPrice}
                                    onChange={onChangePrice}
                                />
                            </div>
                            <div className={styles.formLine}>
                                <label htmlFor="delivery-sum" className={styles.deliveryLabel}>Montante total:</label>
                                <input required id="delivery-sum" tabIndex="2" className={styles.deliveryInput} placeholder='0.00'
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
                <div className={styles.deliveryBlock}>
                    Carregando...
                </div>
            }
        </>
    );
};

export default AdminDeliveryPrices;