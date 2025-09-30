import React from 'react';
import axios from 'axios';
import styles from './AdminPanel.module.scss';
import { AuthContext } from '../../context';
import AdminOrderItems from './AdminOrderItems';

const AdminOrders = () => {

    const [transactions, setTransactions] = React.useState([]);
    const [activeOrderIndex, setActiveOrderIndex] = React.useState('');

    const { serverDomain } = React.useContext(AuthContext);

    React.useEffect(() => {
        axios.get(`${serverDomain}api/sibs`)
            .then((res) => {
                setTransactions(res.data.slice(0, 50));
            });
    }, []);

    const showOrderDetails = (i) => {
        setActiveOrderIndex(i);
    };

    return (
        <div className={styles.ordersWrapper}>
            {transactions.length > 0
                ?
                <ul className={styles.ordersList}>
                    {transactions.map((transaction, i) =>
                        <li key={transaction.transactionID} className={styles.ordersItem}>
                            <div className={styles.ordersItemTop}>
                                <div className={styles.ordersItemIdentifier}>
                                    <span className={activeOrderIndex === i ? styles.activeOrderNumber : styles.orderNumber}>
                                        {transaction.orderID}
                                    </span>
                                </div>
                                <div className={styles.aside}>
                                    <span className={
                                        transaction.paymentStatus === 'Success'
                                            ?
                                            styles.orderStatusSuccess
                                            :
                                            (transaction.paymentStatus === 'Declined'
                                                ?
                                                styles.orderStatusDeclined
                                                :
                                                (transaction.paymentStatus === 'Pending'
                                                    ?
                                                    styles.orderStatusPending
                                                    :
                                                    styles.orderStatus
                                                )
                                            )}>
                                        {transaction.paymentStatus
                                            ?
                                            (transaction.paymentStatus === 'Success'
                                                ?
                                                'Sucesso'
                                                : 
                                                (transaction.paymentStatus === 'Declined'
                                                    ?
                                                    'Rejeitado'
                                                    :
                                                    (transaction.paymentStatus === 'Pending'
                                                        && 'Pendente'
                                                    )
                                                )
                                            )
                                            :
                                            'Cancelado'}
                                    </span>
                                    <svg
                                        onClick={() => showOrderDetails(i)}
                                        className={
                                            i === activeOrderIndex
                                                ?
                                                styles.ordersItemIconActive
                                                :
                                                styles.ordersItemIcon
                                        }
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                                    </svg>                                    
                                </div>
                            </div>
                            <span className={styles.orderDate}>
                                {transaction.startTime.replace('T', ' ').slice(0,19)}
                            </span>
                            {i === activeOrderIndex
                                && 
                                (
                                    <div className={styles.ordersItemDetails}>
                                        <div className={styles.orderTransactionId}>
                                            <span className={styles.orderLabel}>
                                                transactionID:
                                            </span>
                                            {transaction.transactionID}
                                        </div>
                                        <div className={styles.orderPaymentMethod}>
                                            <span className={styles.orderLabel}>
                                                Método de pagamento:
                                            </span>
                                            {transaction.paymentMethod
                                                ?
                                                transaction.paymentMethod
                                                +
                                                (transaction.paymentMethod === 'REFERENCE'
                                                    ?
                                                    ` (${transaction.reference})`
                                                    :
                                                    ''
                                                )
                                                :
                                                'Não selecionada'
                                            }
                                        </div>
                                        <div className={styles.userData}>
                                            <span>
                                                {transaction.customerName}
                                            </span>
                                            {transaction.customerCompany && 
                                                <span>
                                                    {transaction.customerCompany}
                                                </span>
                                            }
                                            {
                                                transaction.phoneNumber || transaction.customerPhone
                                                    ?
                                                    <span>
                                                        {transaction.paymentMethod === "MBWAY"
                                                            ?
                                                            (transaction.phoneNumber
                                                                ?
                                                                `+${transaction.phoneNumber.split('#').join('')}`
                                                                :
                                                                transaction.customerPhone
                                                            )
                                                            :
                                                            (transaction.customerPhone && transaction.customerPhone)
                                                        }
                                                    </span>   
                                                    :
                                                    ''
                                            }

                                            <span>{transaction.customerEmail}</span>
                                        </div>
                                        
                                        <div className={styles.userAddress}>
                                            {transaction.orderAddress
                                                ?
                                                <>
                                                    <div>
                                                        <span className={styles.orderLabel}>Rua: </span>
                                                        {transaction.orderAddress.split(', ')[0]},
                                                    </div>
                                                    <div>
                                                        <span className={styles.orderLabel}>Número da porta: </span>
                                                        {transaction.orderAddress.split(', ')[1]},
                                                    </div>
                                                    <div>
                                                        <span className={styles.orderLabel}>Código postal/ZIP: </span>
                                                        {transaction.orderAddress.split(', ')[2]},
                                                    </div>
                                                    <div>
                                                        {transaction.orderAddress.split(', ')[3] + ', '} 
                                                        {transaction.orderAddress.split(', ')[4] + ', '} 
                                                        {transaction.orderAddress.split(', ')[5]}
                                                    </div>
                                                </>
                                                :
                                                <span className={styles.warnOrderMsg}>
                                                    Endereço indisponível
                                                </span>
                                            }
                                        </div>
                                        <AdminOrderItems
                                            key={transaction.id}
                                            userId={transaction.userId}
                                            transactionOrderId={transaction.orderID}
                                        />
                                    </div>                                
                                )
                            }

                        </li>
                    )}
                </ul> 
                :
                <span className={styles.loadingMsg}>
                    Carregando pedidos...
                </span>
            }
        </div>
    );
};

export default AdminOrders;