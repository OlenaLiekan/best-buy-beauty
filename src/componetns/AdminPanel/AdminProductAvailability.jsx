import React from 'react';
import axios from 'axios';
import styles from './AdminPanel.module.scss';
import { AuthContext } from '../../context';
import { updateProduct } from '../../http/productAPI';

const AdminProductAvailability = () => {

    const {
        serverDomain,
        imagesCloud,
    } = React.useContext(AuthContext);

    const [listLoading, setListLoading] = React.useState(false);
    const [items, setItems] = React.useState(false);
    const [unavailableProducts, setUnavailableProducts] = React.useState([]);
    const [deletedItemId, setDeletedItemId] = React.useState(null);
    const [showList, setShowList] = React.useState(false);

    React.useEffect(() => {
        setListLoading(true);
        const sortBy = 'id';
        const order = 'ASC';
        axios.get(`${serverDomain}api/product?limit=1000&sort=${sortBy}&order=${order}`)
            .then((res) => {
                setItems(res.data.rows);
                setListLoading(false);
            });
    }, [serverDomain, deletedItemId]);

    React.useEffect(() => {
        if (items.length) {
            setUnavailableProducts(items.filter((item) => !item.available));
        }
    }, [items]);

    const showSuccess = (id) => {
        setDeletedItemId(id);
        window.alert('O produto já está disponível!');
    };

    const showMessage = () => {
        window.alert('Erro!');
    };

    const setAvailability = (id) => {
        const formData = new FormData();
        formData.append('available', true);
        updateProduct(formData, id).then(data => showSuccess(id)).catch(err => showMessage());
    };

    const onClickShowList = () => {
        if (showList) {
            setShowList(false);
        } else {
            setShowList(true);
        }
    };

    return (
        <div className={styles.productsListBlock}>
            <h4>Gerenciamento de disponibilidade de produto</h4>
            {showList
                ?
                <ul className={styles.productList}>
                    {listLoading
                        ?
                        <div className={styles.loadingText}>Os dados estão sendo carregados...</div>
                        :
                        unavailableProducts.length
                        ?
                        unavailableProducts.map((item) => 
                            <li key={item.id} className={styles.productItem}>
                                <svg onClick={() => setAvailability(item.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 48c110.5 0 200 89.5 200 200 0 110.5-89.5 200-200 200-110.5 0-200-89.5-200-200 0-110.5 89.5-200 200-200m140.2 130.3l-22.5-22.7c-4.7-4.7-12.3-4.7-17-.1L215.3 303.7l-59.8-60.3c-4.7-4.7-12.3-4.7-17-.1l-22.7 22.5c-4.7 4.7-4.7 12.3-.1 17l90.8 91.5c4.7 4.7 12.3 4.7 17 .1l172.6-171.2c4.7-4.7 4.7-12.3 .1-17z" />
                                </svg>
                                <div className={styles.productImg}>
                                    <img src={`${imagesCloud}` + item.img} alt="product"/>                                        
                                </div>
                                <div className={styles.productInfo}>
                                    <div>{item.name}</div>
                                    <div>{item.code}</div> 
                                </div>
                            </li>                        
                        )
                        :
                        <div className={styles.alertText}>Nenhum produto</div>
                    }
                </ul>
                :
                ''
            }
            <button onClick={onClickShowList} className={styles.upBtn}>
                {showList ? 'Ocultar lista' : 'Mostrar lista'}
            </button>
        </div>
    );
};

export default AdminProductAvailability;
