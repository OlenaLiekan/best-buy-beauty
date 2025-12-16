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
                setTransactions(res.data.slice(0, 100));
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
                                                    'Cancelbank'
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
                                {transaction.startTime.replace('T', ' ').slice(0, 19)}
                                {transaction.sentToClient || transaction.sentToShop || transaction.sentReferencePaid
                                    ?
                                    <svg
                                        className={
                                            (
                                                transaction.paymentMethod === 'REFERENCE'
                                                    ?
                                                    transaction.sentToClient === "Success" && transaction.sentToShop === "Success" && transaction.sentReferencePaid === 'Success'
                                                    :
                                                    transaction.sentToClient === "Success" && transaction.sentToShop === "Success"
                                            )
                                                ?
                                                styles.sentEmailsIcon
                                                :
                                                (transaction.paymentMethod === 'REFERENCE' && (transaction.sentToClient === 'Success' || (transaction.sentToClient === null && transaction.paymentStatus === 'Pending'))
                                                    ?
                                                    styles.sentEmailsIconPending
                                                    :
                                                    styles.sentEmailsIconError
                                                )
                                        }
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 640 640">
                                        <path
                                            d="M125.4 128C91.5 128 64 155.5 64 189.4C64 190.3 64 191.1 64.1 192L64 192L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 192L575.9 192C575.9 191.1 576 190.3 576 189.4C576 155.5 548.5 128 514.6 128L125.4 128zM528 256.3L528 448C528 456.8 520.8 464 512 464L128 464C119.2 464 112 456.8 112 448L112 256.3L266.8 373.7C298.2 397.6 341.7 397.6 373.2 373.7L528 256.3zM112 189.4C112 182 118 176 125.4 176L514.6 176C522 176 528 182 528 189.4C528 193.6 526 197.6 522.7 200.1L344.2 335.5C329.9 346.3 310.1 346.3 295.8 335.5L117.3 200.1C114 197.6 112 193.6 112 189.4z"
                                        />
                                    </svg>
                                    :
                                    (transaction.paymentStatus === "Success" && (transaction.sentToClient === null || transaction.sentToShop === null || (transaction.paymentMethod === 'REFERENCE' && transaction.sentReferencePaid === null))
                                        ?
                                        <svg
                                            className={styles.sentEmailsIconError}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 640 640">
                                            <path
                                                d="M125.4 128C91.5 128 64 155.5 64 189.4C64 190.3 64 191.1 64.1 192L64 192L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 192L575.9 192C575.9 191.1 576 190.3 576 189.4C576 155.5 548.5 128 514.6 128L125.4 128zM528 256.3L528 448C528 456.8 520.8 464 512 464L128 464C119.2 464 112 456.8 112 448L112 256.3L266.8 373.7C298.2 397.6 341.7 397.6 373.2 373.7L528 256.3zM112 189.4C112 182 118 176 125.4 176L514.6 176C522 176 528 182 528 189.4C528 193.6 526 197.6 522.7 200.1L344.2 335.5C329.9 346.3 310.1 346.3 295.8 335.5L117.3 200.1C114 197.6 112 193.6 112 189.4z"
                                            />
                                        </svg>
                                        :
                                        ''
                                    )
                                }

                            </span>

                            {i === activeOrderIndex
                                && 
                                (                                
                                    <div className={styles.ordersItemDetails}>
                                    {
                                        transaction.paymentStatus === 'Success' || transaction.paymentStatus === 'Pending'
                                            ?
                                            <div className={styles.orderTransporterDetails}>
                                                <div className={styles.TDText}>
                                                    E-mails enviados: {
                                                        0 +
                                                        (transaction.sentToClient === "Success" ? 1 : 0) +
                                                        (transaction.sentToShop === "Success" ? 1 : 0) +
                                                        (transaction.sentReferencePaid === "Success" ? 1 : 0)
                                                    }
                                                </div>
                                                <div className={styles.TDText}>
                                                    Erro ao enviar: {
                                                        0 +
                                                        (transaction.sentToClient === "Failed" ? 1 : 0) +
                                                        (transaction.sentToShop === "Failed" ? 1 : 0) +
                                                        (transaction.sentReferencePaid === "Failed" ? 1 : 0)                                    
                                                    }                                    
                                                </div>
                                                <div className={styles.TDTextPending}>
                                                    {transaction.paymentMethod === 'REFERENCE' && transaction.sentToClient === 'Success' && !transaction.sentReferencePaid
                                                        &&
                                                        'O cliente recebeu um e-mail com os detalhes do pagamento.'
                                                    }
                                                </div>
                                                <div className={styles.TDTextError}>
                                                    {(transaction.sentToClient === 'Failed' && !transaction.paymentMethod === "REFERENCE") || transaction.sentReferencePaid === 'Failed' || transaction.sentToShop === 'Failed'
                                                        ?
                                                        <div className={styles.errorsList}>
                                                            <span>Não enviado:</span>
                                                            <span>{transaction.sentToClient === "Failed" && 'E-mail para o cliente'}</span>
                                                            <span>{transaction.sentToShop === "Failed" && 'E-mail para a loja'}</span>
                                                            <span>{transaction.sentReferencePaid === "Failed" && 'E-mail ao cliente confirmando o pagamento da referência.'}</span>
                                                        </div>
                                                        :
                                                        ''
                                                    }
                                                </div>
                                            </div>   
                                            :
                                            ''
                                    }
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