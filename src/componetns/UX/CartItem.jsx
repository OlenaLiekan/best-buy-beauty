import React from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import { addItem, minusItem, removeItem } from '../../redux/slices/cartSlice';
import { AuthContext } from '../../context';
import axios from 'axios';

const CartItem = ({ path, info, isLashes, name, img, id, index, code, price, company, lengthArr, thicknessArr, curlArr, count, available }) => { 

    const [dbItem, setDBItem] = React.useState({});
    const [itemsUpdated, setItemsUpdated] = React.useState(false);
    const [itemLoading, setItemLoading] = React.useState(false);
    const { imagesCloud, serverDomain, productUpdated, setProductUpdated, productRemoved, setProductRemoved} = React.useContext(AuthContext);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${path}/${id}`);
        window.scrollTo(0, 0);            
    }

    const dispatch = useDispatch();

    const onClickPlus = () => { 
        dispatch(
            addItem({
                id,
                lengthArr,
                thicknessArr,
                curlArr,
            }),
        );
    };

    const onClickMinus = () => { 
        dispatch(
            minusItem(isLashes ? index : id),
        );
    };

    const onClickRemove = () => { 
        if (window.confirm('Tem certeza de que deseja excluir o produto?')) {
            dispatch(
                removeItem(isLashes ? index : id)
            );            
        }
    };

    React.useEffect(() => {
        setItemLoading(true);
        axios.get(`${serverDomain}api/product/${id}`)
        .then((res) => {
            setDBItem(res.data);
            setItemLoading(false);
        });
    }, [id, itemsUpdated, available]);

    React.useEffect(() => {
        if (itemsUpdated) {
            window.location.reload(); 
        }
    }, [itemsUpdated]);

    React.useEffect(() => {
        if (productUpdated === code) {
            dispatch(
                removeItem(isLashes ? index : id)
            );
            setProductUpdated('');
        }
        if (productRemoved === code) {
            dispatch(
                removeItem(isLashes ? index : id)
            );
            setProductRemoved('');  
        }
    }, [productUpdated, productRemoved]);

    const currentItem = useSelector((state) => state.cart.items.find((obj) => obj.id === id));
    React.useEffect(() => {
        setItemsUpdated(false);
        if (dbItem.available !== undefined && dbItem.available !== null) {
            const itemPrice = +dbItem.discountPrice > 0 ? dbItem.discountPrice : dbItem.price;
            if (currentItem.available !== dbItem.available || currentItem.price !== itemPrice) {
                let itemCopy = Object.assign({}, currentItem);
                itemCopy.available = dbItem.available;
                itemCopy.price = +dbItem.discountPrice > 0 ? dbItem.discountPrice : dbItem.price;
                const data = JSON.parse(localStorage.getItem('cart'));
                const itemPosition = data.findIndex((item) => item.id === id);
                data.splice(itemPosition, 1, itemCopy);
                localStorage.setItem('cart', JSON.stringify(data));
                setItemsUpdated(true);
            } 
        }
    }, [dbItem, id]);

    if (count === 0) {
        dispatch(
            removeItem(isLashes ? index : id)
        );  
    } 

    return (
        <div className="body-cart__item item__cart">
            <div className="item-cart__content">
                <div className={dbItem.available ? "item-cart__product-block" : "item-cart__product-block item-cart__product-block_faded"}>
                    <div onClick={handleClick} className="item-cart__image">
                        <img src={`${imagesCloud}` + img} alt="product" />
                    </div>                        
                    <div className="item-cart__info info-cart">
                        <div className="info-cart__titles">
                            <h4 className='info-cart__title'>{name}</h4>                           
                        </div>
                        <div className='info-cart__line'>
                            <span>Código: </span>
                            {code}
                        </div>
                        <div className='info-cart__line'>
                            <span>Marca: </span>
                            {company}
                        </div>
                        {
                            info && !isLashes
                            ?
                            info.map((obj) => 
                                <div key={obj} className='info-cart__line'>
                                    <span>
                                        {obj.title}: 
                                    </span>
                                    {obj.description}                                     
                                </div>                                    
                            )
                            :
                            ''
                        }
                        {
                            isLashes
                            ?
                                <div className='info-cart__line'>
                                    <span>Opções: </span>
                                    {curlArr} / {thicknessArr} / {lengthArr} mm
                                </div>                                    
                            :
                            ''
                        }
                    </div>                                         
                </div>
                <div className="item-cart__actions">
                    { !itemLoading && dbItem && !dbItem.available
                        ?
                        <div className='item-cart__unavailable'>{itemLoading ? '' : "Não disponível" }</div>  
                        :
                        <>
                            <div className="item-cart__quantity quantity-cart quantity">
                                <button onClick={onClickMinus} className="quantity__minus">-</button>
                                <div className="quantity__text">{count}</div>
                                <button onClick={onClickPlus} className="quantity__plus">+</button>
                            </div>
                            <div className="item-cart__price">{(price*count).toFixed(2)} €</div>
                        </>
                    }
                    <button onClick={onClickRemove} className="item-cart__delete">+</button>                                        
                </div>
            </div>
        </div>
    );
};

export default CartItem;