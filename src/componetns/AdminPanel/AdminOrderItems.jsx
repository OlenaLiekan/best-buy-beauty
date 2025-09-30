import React from 'react';
import axios from 'axios';
import styles from './AdminPanel.module.scss';
import { AuthContext } from '../../context';

const AdminOrderItems = ({ userId, transactionOrderId }) => {
    
    const [userOrders, setUserOrders] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { serverDomain } = React.useContext(AuthContext);

    React.useEffect(() => {
        setIsLoading(true);
        axios.get(`${serverDomain}api/user/${userId}`)
            .then((res) => {
                setUserOrders(res.data.order);
                setIsLoading(false);
            });
    }, [serverDomain, userId]);
 
    return (
        userOrders.length > 0
            ?
            <>
                <div>
                    <span className={styles.orderLabel}>
                        Comentário:
                    </span>
                    {userOrders.filter((order) => order.orderNumber === transactionOrderId)[0]?.userComment
                        ?
                        userOrders.filter((order) => order.orderNumber === transactionOrderId)[0]?.userComment
                        :
                        'Sem comentários'
                    }
                </div>
                <ul className={styles.userItems}>
                    {
                        userOrders.filter((order) => order.orderNumber === transactionOrderId)[0]?.item?.map((product, i) => 
                            <li key={product.id} className={styles.userItem}>
                                <span className={styles.orderLabel}>{i + 1}. {product.title}</span>
                                {product.description && product.description.split('\n').map((info, index) => 
                                    <div key={index}>{info}</div>
                                )}
                            </li>                        
                        )
                    }

                </ul>
                <div className={styles.orderResume}>
                    {
                        userOrders.filter((order) => order.orderNumber === transactionOrderId)[0]?.promocodeName
                        &&
                        <div className={styles.userPromocode}>
                            <span className={styles.orderLabel}>
                                Código promocional:
                            </span>
                            <span>
                                {userOrders.filter((order) => order.orderNumber === transactionOrderId)[0]?.promocodeName}
                                - {userOrders.filter((order) => order.orderNumber === transactionOrderId)[0]?.promocodeValue}%
                            </span>
                        </div>                    
                    }
                    <div className={styles.orderTotalSum}>
                        <span className={styles.orderLabel}>
                            Quantidade total:
                        </span>
                        {userOrders.filter((order) => order.orderNumber === transactionOrderId)[0]?.quantity}
                    </div> 
                    <div className={styles.orderDeliveryPrice}>
                        <span className={styles.orderLabel}>
                            Custo de entrega:
                        </span>
                        {userOrders.filter((order) => order.orderNumber === transactionOrderId)[0]?.deliveryPrice} €
                    </div>
                    <div className={styles.orderTotalSum}>
                        <span className={styles.orderLabel}>Montante total:</span>
                        {userOrders.filter((order) => order.orderNumber === transactionOrderId)[0]?.sum} €
                    </div>    
                </div>    
            </>
            :
            (isLoading && userOrders === 0
                ?
                <span className={styles.loadingMsg}>
                    Os dados do pedido estão sendo carregados...
                </span>
                :
                <span className={styles.warnOrderMsg}>
                    Os dados do produto não estão disponíveis
                </span>
            )
    );
};

export default AdminOrderItems;