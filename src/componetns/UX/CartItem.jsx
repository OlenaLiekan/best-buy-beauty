import React from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import { addItem, minusItem, removeItem, clearItems  } from '../../redux/slices/cartSlice';
import { AuthContext } from '../../context';
import axios from 'axios';
    
const CartItem = ({obj, path, info, isLashes, name, img, id, index, code, price, company, lengthArr, thicknessArr, curlArr, count, available, exclusiveProduct, discountPrice, kitId, variant }) => {

    const [dbItem, setDBItem] = React.useState({});
    const [itemLoading, setItemLoading] = React.useState(false);
    const [brandDiscount, setBrandDiscount] = React.useState('');
    const {
        imagesCloud,
        serverDomain,
        productUpdated,
        setProductUpdated,
        productRemoved,
        setProductRemoved,
        isBlackFriday,
        updatedCart,
        setUpdatedCart,
    } = React.useContext(AuthContext);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isOldLashesModel = isLashes && (!kitId);
    const isNewLashesModel = isLashes && kitId > 0;

    React.useEffect(() => {
        setItemLoading(true);
        axios.get(`${serverDomain}api/product/${id}`)
        .then((res) => {
            setDBItem(res.data);
            setItemLoading(false);
        })
        .catch(() => setItemLoading(false));
    }, [id, serverDomain]);

    const handleClick = () => {
        navigate(`/${path}/${id}`);
        window.scrollTo(0, 0);
    }

    const onClickPlus = () => {
        if (isLashes && !kitId) {
            dispatch(addItem({ ...obj, curlArr, thicknessArr, lengthArr }));
        } else {
            dispatch(addItem(obj));            
        }
    };

    const onClickMinus = () => {
        if (isLashes && !kitId) {
            dispatch(minusItem({ ...obj, curlArr, thicknessArr, lengthArr }));
        } else {
            dispatch(minusItem(obj));             
        }
    };
    

    const onClickRemove = () => {
        if (window.confirm('Tem certeza de que deseja excluir o produto?')) {
            if (isLashes && !kitId) {
                dispatch(removeItem({...obj, curlArr, thicknessArr, lengthArr}));              
            } else {
                dispatch(removeItem(obj));
            }
        }
    };
    

    React.useEffect(() => {
        axios.get(`${serverDomain}api/brand`)
            .then((res) => {
                if (dbItem && dbItem.brandId) {
                    setBrandDiscount(res.data.find((brand) => brand.id === dbItem.brandId).discount);
                }
            });
    }, [serverDomain, dbItem]);

    React.useEffect(() => {
        if (productUpdated === code) {
            if (isOldLashesModel) {
                dispatch(removeItem({...obj, 
                    id, 
                    isLashes: true, 
                    kitId: 0,
                    lengthArr, 
                    thicknessArr, 
                    curlArr 
                }));
            } else {
                dispatch(removeItem(obj));
            }
            setProductUpdated('');
        }
    }, [productUpdated, code]);
    
    React.useEffect(() => {
        if (productRemoved === code) {
            if (isOldLashesModel) {
                dispatch(removeItem({...obj, 
                    id, 
                    isLashes: true, 
                    kitId: 0,
                    lengthArr, 
                    thicknessArr, 
                    curlArr 
                }));
            } else {
                dispatch(removeItem(obj));
            }
            setProductRemoved('');
        }
    }, [productRemoved, code]);

    React.useEffect(() => {
        if (!itemLoading && !dbItem) {
            if (isOldLashesModel) {
                dispatch(removeItem({ ...obj,
                    id, 
                    isLashes: true, 
                    kitId: 0,
                    lengthArr, 
                    thicknessArr, 
                    curlArr 
                }));
            } else {
                dispatch(removeItem(obj));
            }
        }
    }, [itemLoading, dbItem]);

    const currentItem = useSelector((state) => {
        if (isOldLashesModel) {
        return state.cart.items.find(
            obj => obj.isLashes && 
                !obj.kitId &&
                obj.id === id &&
                obj.curlArr === curlArr &&
                obj.thicknessArr === thicknessArr &&
                obj.lengthArr === lengthArr
        );
        } else {
            return state.cart.items.find(obj => obj.id === id);
        }
    });

    React.useEffect(() => {
        setUpdatedCart(false);
        if (dbItem) {
            if (dbItem.available !== undefined && dbItem.available !== null) {
                const itemPrice = +dbItem.discountPrice > 0 ? dbItem.discountPrice : (brandDiscount == 0 && !isBlackFriday ? dbItem.price : (dbItem.price * (100 - brandDiscount) / 100).toFixed(2));
                
                if (currentItem.available !== dbItem.available || currentItem.price !== itemPrice && brandDiscount == 0 && !isBlackFriday) {
                    let itemCopy = Object.assign({}, currentItem);
                    itemCopy.available = dbItem.available;
                    itemCopy.price = +dbItem.discountPrice > 0 ? dbItem.discountPrice : (brandDiscount == 0 && !isBlackFriday ? dbItem.price : (dbItem.price * (100 - brandDiscount) / 100).toFixed(2));
                    const data = JSON.parse(localStorage.getItem('cart'));
                    let itemPosition;
                    if (isLashes && !kitId) {
                        itemPosition = data.findIndex((item) => item.id === id && item.curlArr === curlArr && item.thicknessArr === thicknessArr && item.lengthArr === lengthArr);
                    } else {
                        itemPosition = data.findIndex((item) => item.id === id);                        
                    }

                    data.splice(itemPosition, 1, itemCopy);
                    localStorage.setItem('cart', JSON.stringify(data));
                    setUpdatedCart(true);
                }
            }
        }

        if (!dbItem && !itemLoading && count > 0) {
            if (isOldLashesModel) {
                dispatch(removeItem({...obj, 
                id, 
                isLashes: true, 
                kitId: 0,
                lengthArr, 
                thicknessArr, 
                curlArr 
                }));
            } else {
                dispatch(removeItem(obj));
            }
        }

    }, [dbItem, itemLoading]);

   /* React.useEffect(() => {
        setUpdatedCart(false);
        
        if (dbItem && currentItem) {

            let actualPrice;
            if (+dbItem.discountPrice > 0) {
                actualPrice = dbItem.discountPrice;
            } else if (brandDiscount > 0 && isBlackFriday) {
                actualPrice = (+dbItem.price * (100 - brandDiscount) / 100).toFixed(2);
            } else {
                actualPrice = +dbItem.price;
            }

            const priceChanged = currentItem.price !== actualPrice;
            const availableChanged = currentItem.available !== dbItem.available;

            if (priceChanged || availableChanged) {

                let itemCopy = { ...currentItem };
                itemCopy.available = dbItem.available;
                itemCopy.price = actualPrice;

                const data = JSON.parse(localStorage.getItem('cart')) || [];
                
                if (isOldLashesModel) {

                    const itemPosition = data.findIndex(
                        item => item.isLashes && 
                                !item.kitId &&
                                item.id === id &&
                                item.curlArr === curlArr &&
                                item.thicknessArr === thicknessArr &&
                                item.lengthArr === lengthArr
                    );
                    if (itemPosition !== -1) {
                        data.splice(itemPosition, 1, itemCopy);
                    }
                    } else {

                    const itemPosition = data.findIndex(item => item.id === id);
                    if (itemPosition !== -1) {
                        data.splice(itemPosition, 1, itemCopy);
                    }
                }
                
                localStorage.setItem('cart', JSON.stringify(data));
                setUpdatedCart(true);
            }
        }

        if (!dbItem && !itemLoading && count > 0) {
            if (isOldLashesModel) {
                dispatch(removeItem({...obj, 
                id, 
                isLashes: true, 
                kitId: 0,
                lengthArr, 
                thicknessArr, 
                curlArr 
                }));
            } else {
                dispatch(removeItem(obj));
            }
        }
    }, [dbItem, itemLoading, brandDiscount, isBlackFriday]);*/

    if (count === 0) {
        if (isOldLashesModel) {
            dispatch(removeItem({ ...obj,
                id, 
                isLashes: true, 
                kitId: 0,
                lengthArr, 
                thicknessArr, 
                curlArr 
            }));
        } else {
            dispatch(removeItem(obj));
        }
    }

    if (dbItem && dbItem.available === false) {
        if (isOldLashesModel) {
            dispatch(removeItem({...obj,
                id, 
                isLashes: true, 
                kitId: 0,
                lengthArr, 
                thicknessArr, 
                curlArr 
            }));
        } else {
            dispatch(removeItem(obj));
        }
    }

    const isAvailable = dbItem?.available !== undefined ? dbItem.available : available;

    return (
        <div className="body-cart__item item__cart">
            <div className="item-cart__content">
                <div className={isAvailable ? "item-cart__product-block" : "item-cart__product-block item-cart__product-block_faded"}>
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
                            isOldLashesModel
                            &&
                                <div className='info-cart__line'>
                                    <span>Opções: </span>
                                    {curlArr} / {thicknessArr} / {lengthArr} mm
                                </div>                                    
                        }

                        {
                            isNewLashesModel
                            &&
                            <div className='info-cart__line'>
                                {variant}
                            </div>                       
                        }
                    </div>                                         
                </div>
                <div className="item-cart__actions">
                    {!isAvailable
                        ?
                        <div className='item-cart__unavailable'>{itemLoading && "Esgotado" }</div>  
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