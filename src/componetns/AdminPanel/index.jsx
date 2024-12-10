import React from 'react';

import axios from 'axios';
import styles from './AdminPanel.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context';
import { setCategoryId } from '../../redux/slices/filterSlice';
import { useDispatch } from 'react-redux';
import { updateDelivery, updateLogo } from '../../http/productAPI';
import Loader from '../UI/Loader';
import LogoLoader from '../UI/Skeletons/LogoSkeleton';
import LogoTextLoader from '../UI/Skeletons/LogoTextSkeleton';
import { updateProduct } from '../../http/productAPI';

const AdminPanel = () => {

    const arr = [
        { name: 'Tipo', path: 'catalog' },
        { name: 'Produto', path: 'produtos?sortProperty=rating&categoryId=0&brandId=0&currentPage=1' },
        { name: 'Marca', path: ' ' },
        { name: 'Slide', path: ' ' },
    ];
    const [path, setPath] = React.useState('');
    const { serverDomain, imagesCloud, isPromoPage, setIsPromoPage } = React.useContext(AuthContext);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const inputRef = React.useRef();

    const [deliveries, setDeliveries] = React.useState([]);
    const [editPricesMode, setEditPricesMode] = React.useState(false);
    const [editLogoMode, setEditLogoMode] = React.useState(false);
    const [showList, setShowList] = React.useState(false);
    const [activeDelivery, setActiveDelivery] = React.useState(0);
    const [deliveryId, setDeliveryId] = React.useState(1);
    const [deliveryPrice, setDeliveryPrice] = React.useState('');
    const [deliverySum, setDeliverySum] = React.useState('');
    const [logoName, setLogoName] = React.useState('');
    const [logoImg, setLogoImg] = React.useState(null);
    const [logo, setLogo] = React.useState('');
    const [logoLoading, setLogoLoading] = React.useState(false);
    const [listLoading, setListLoading] = React.useState(false);
    const [items, setItems] = React.useState(false);
    const [unavailableProducts, setUnavailableProducts] = React.useState([]);
    const [deletedItemId, setDeletedItemId] = React.useState(null);

    const message = () => {
        window.alert('Ocorreu um erro!');
    };

    React.useEffect(() => {
        setLogoLoading(true);
        axios.get(`${serverDomain}api/logo/1`)
            .then((res) => {
                setLogo(res.data);
                setLogoLoading(false);
            });
    }, [serverDomain, editLogoMode]);

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


    React.useEffect(() => {
        if (path) {
            if (path === 'produtos?sortProperty=rating&categoryId=0&brandId=0&currentPage=1') {
                dispatch(setCategoryId(0));
                localStorage.removeItem('categoryId');
                localStorage.removeItem('subItems');
            }
            navigate(`/${path}`);
            window.scrollTo(0, 0);
        }
    }, [path, navigate, dispatch]);

    React.useEffect(() => {
        if (!logoLoading && logo) {
            setLogoImg(logo.img);
            setLogoName(logo.logoName);
        }
    }, [logoLoading, logo]);

    const setDelivery = (index, id) => {
        setActiveDelivery(index);
        setDeliveryId(id);
    };

    const editDeliveryPrices = () => {
        setEditLogoMode(false);
        setEditPricesMode(true);
    };

    const onChangePrice = (event) => { 
        setDeliveryPrice(event.target.value);            
    };

    const onChangeSum = (event) => { 
        setDeliverySum(event.target.value);            
    };

    const onChangeLogoName = (event) => {
        setLogoName(event.target.value);
    };

    const selectFile = (event) => {
        setLogoImg(event.target.files[0]);
    };

    const cancelEdit = () => {
        if (editPricesMode) {
            setEditPricesMode(false);
            setActiveDelivery(0);
            setDeliveryId('');
            setDeliveryPrice('');
            setDeliverySum('');
        }
        if (editLogoMode) {
            setEditLogoMode(false);
            setLogoName('');
            setLogoImg(null);
        }
    };

    const success = () => {
        if (editPricesMode) {
            window.alert('Condições alteradas com sucesso!');
            setEditPricesMode(false);
            setDeliveryId(1);
            setActiveDelivery(0);
        }
        if (editLogoMode) {
            window.alert('Logotipo atualizado com sucesso!');
            setEditLogoMode(false);
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

    const pushLogo = (e) => {
        e.preventDefault();
        const logoId = 1;
        const formData = new FormData();
        formData.set('logoImg', logoImg);
        formData.set('logoName', logoName);
        updateLogo(formData, logoId).then(data => success()).catch(err => message());
    };

    const showLogoMenu = () => {
        setEditLogoMode(true);
        window.scrollTo(0, 0);
        setEditPricesMode(false);
    };

    const toTop = () => {
        if (isPromoPage) {
            setIsPromoPage(false);
        }
        window.scrollTo(0, 0);
    };

    const onClickShowList = () => {
        if (showList) {
            setShowList(false);
        } else {
            setShowList(true);
        }
    };

    return (
        <div className={styles.actions}>
            {!editLogoMode
                ?
                <div className={styles.logo}>
                    <div className={styles.logoBox}>
                        <div className={styles.logoImg}>
                            {
                                !logoLoading && logo
                                ?
                                <img src={`${imagesCloud}` + logo.img} alt='logo' />
                                :
                                <LogoLoader/>
                            }
                        </div>
                        <svg onClick={showLogoMenu} className={styles.logoAction} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                            <path d="M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z" />
                        </svg>
                    </div>
                    <div className={styles.logoText}>{!logoLoading && logo ? logo.logoName : <LogoTextLoader/>}</div>
                </div>
                :
                <form onSubmit={pushLogo} className={styles.logoForm}>
                    <div className={styles.formLogoLine}>
                        <label htmlFor="logo-file" className={styles.logoLabel}>Imagem:</label>
                        <input id="logo-file" tabIndex="1" type='file' className={styles.logoFile}
                            onChange={selectFile}/>                    
                    </div>
                    <div className={styles.formLogoLine}>
                        <label htmlFor="logo-name" className={styles.logoLabel}>Nome:</label>
                        <input required id="logo-name" tabIndex="2" className={styles.logoInput} placeholder='Nome'
                            ref={inputRef}
                            value={logoName}
                            onChange={onChangeLogoName}
                        />
                    </div>
                    <button type='submit' className={styles.subBtn}>Confirme</button> 
                    <button type='button' onClick={cancelEdit} className={styles.cancelBtn}>Cancelar</button> 
                </form>
            }
            <form className={styles.form}>
                <h3 className={styles.formTitle}>
                    Onde você gostaria de fazer alterações?
                </h3>
                
                <div className={styles.formBody}>
                    {arr.map((item, i) => 
                        <Link to={'/' + item.path} key={item.name}>
                            <button onClick={toTop} className={styles.button}>
                                {item.name}
                            </button>
                        </Link>
                    )}
                </div>
            </form>

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
                <Loader/>
            }
        </div>
    );
};

export default AdminPanel;