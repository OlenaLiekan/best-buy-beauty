import React from 'react';

import axios from 'axios';
import styles from './AdminPanel.module.scss';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context';
import { setCategoryId } from '../../redux/slices/filterSlice';
import { useDispatch } from 'react-redux';
import { updateDelivery, updatePayment } from '../../http/productAPI';

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
    const [editPaymentDataMode, setEditPaymentDataMode] = React.useState(false);
    const [activeDelivery, setActiveDelivery] = React.useState(0);
    const [deliveryId, setDeliveryId] = React.useState('');
    const [deliveryPrice, setDeliveryPrice] = React.useState('');
    const [deliverySum, setDeliverySum] = React.useState('');
    const [visiblePaymentData, setVisiblePaymentData] = React.useState(false);
    const [iban, setIban] = React.useState('');
    const [paymentDetails, setPaymentDetails] = React.useState('');
    const [recipient, setRecipient] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        setIsLoading(true);
        axios.get(`${serverDomain}api/payment/1`)
            .then((res) => {
                setPaymentDetails(res.data);
                setIsLoading(false);
            });
    }, [serverDomain, editPaymentDataMode]);    

    React.useEffect(() => {
        if (paymentDetails) {
            setIban(paymentDetails.iban);
            setRecipient(paymentDetails.recipient);
        }
    }, [paymentDetails]);

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
        setEditPaymentDataMode(false);
        setEditPricesMode(true);
    }

    const editPaymentData = () => {
        setEditPricesMode(false);
        setEditPaymentDataMode(true);
    }

    const onChangePrice = (event) => { 
        setDeliveryPrice(event.target.value);            
    };

    const onChangeSum = (event) => { 
        setDeliverySum(event.target.value);            
    };

    const onChangeIban = (event) => { 
        setIban(event.target.value);            
    };

    const onChangeRecipient = (event) => { 
        setRecipient(event.target.value);            
    };

    const cancelEdit = () => {
        if (editPricesMode) {
            setEditPricesMode(false);
            setActiveDelivery(0);
            setDeliveryId('');
            setDeliveryPrice('');
            setDeliverySum('');            
        }
        if (editPaymentDataMode) {
            setEditPaymentDataMode(false);    
            setIban('');
            setRecipient('');
        }
    }

    const success = () => {
        if (editPricesMode) {
            window.alert('Condições alteradas com sucesso!');
            setEditPricesMode(false);            
        }
        if (editPaymentDataMode) {
            window.alert('Detalhes de pagamento alterados com sucesso!');
            setEditPaymentDataMode(false);            
        }       
    }

    const updateConditions = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const id = deliveryId;
        formData.set('price', deliveryPrice);
        formData.set('requiredSum', deliverySum);                     
        updateDelivery(formData, id).then(data => success());
    }

    const updatePaymentData = (e) => {
        e.preventDefault();
        const paymentId = 1;
        const formData = new FormData();
        formData.set('iban', iban);
        formData.set('recipient', recipient);                     
        updatePayment(formData, paymentId).then(data => success());
    }

    const showIban = () => {
        if (!visiblePaymentData) {
            setVisiblePaymentData(true);            
        } else {
            setVisiblePaymentData(false);
        }
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
            {!isLoading && paymentDetails
                ?
                <div className={styles.dataPaymentBlock}>
                    <h4>Detalhes do pagamento</h4>
                    {!editPaymentDataMode
                        ? 
                        <>   
                            <div className={styles.dataPaymentItems}>
                                <div className={styles.dataPaymentItem}>
                                    <div className={styles.dataPaymentTitle}>
                                        IBAN:
                                    </div>
                                    <div className={styles.dataPaymentValue}>
                                        {!visiblePaymentData 
                                            ?
                                                paymentDetails.iban.slice(0, 2) + '*******************' + paymentDetails.iban.slice(21)
                                            :
                                                paymentDetails.iban}
                                        {!visiblePaymentData
                                            ?
                                            <svg onClick={showIban} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                                <path d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z" />
                                            </svg>
                                            :
                                            <svg onClick={showIban} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">
                                                <path d="M634 471L36 3.51A16 16 0 0 0 13.51 6l-10 12.49A16 16 0 0 0 6 41l598 467.49a16 16 0 0 0 22.49-2.49l10-12.49A16 16 0 0 0 634 471zM296.79 146.47l134.79 105.38C429.36 191.91 380.48 144 320 144a112.26 112.26 0 0 0-23.21 2.47zm46.42 219.07L208.42 260.16C210.65 320.09 259.53 368 320 368a113 113 0 0 0 23.21-2.46zM320 112c98.65 0 189.09 55 237.93 144a285.53 285.53 0 0 1-44 60.2l37.74 29.5a333.7 333.7 0 0 0 52.9-75.11 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64c-36.7 0-71.71 7-104.63 18.81l46.41 36.29c18.94-4.3 38.34-7.1 58.22-7.1zm0 288c-98.65 0-189.08-55-237.93-144a285.47 285.47 0 0 1 44.05-60.19l-37.74-29.5a333.6 333.6 0 0 0-52.89 75.1 32.35 32.35 0 0 0 0 29.19C89.72 376.41 197.08 448 320 448c36.7 0 71.71-7.05 104.63-18.81l-46.41-36.28C359.28 397.2 339.89 400 320 400z" />
                                            </svg>
                                        }
                                    </div>
                                </div>
                                <div className={styles.dataPaymentItem}>
                                    <div className={styles.dataPaymentTitle}>
                                        Nome:
                                    </div>
                                    <div className={styles.dataPaymentValue}>
                                        {paymentDetails.recipient}
                                    </div>
                                </div>
                            </div>
                            
                            <button type='button' onClick={editPaymentData} className={styles.upBtn}>Atualizar</button>       
                        </>
                    :    
                    <form onSubmit={updatePaymentData} className={styles.dataPaymentForm}>
                        <div className={styles.formLinePayment}> 
                            <label htmlFor="payment-data-iban" className={styles.dataPaymentLabel}>IBAN:</label>
                            <input required id="payment-data-iban" className={styles.dataPaymentInput} placeholder='PT00000000000000000000000'
                                ref={inputRef}
                                value={iban}
                                onChange={onChangeIban}
                            />
                        </div>
                        <div className={styles.formLinePayment}>
                            <label htmlFor="payment-data-name" className={styles.dataPaymentLabel}>Montante total:</label>
                            <input required id="payment-data-name" className={styles.dataPaymentInput} placeholder='Nome'
                                ref={inputRef}
                                value={recipient}
                                onChange={onChangeRecipient}
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