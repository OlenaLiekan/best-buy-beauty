import React from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { addItem, minusItem, removeItem } from '../redux/slices/cartSlice';
import { AuthContext } from '../context';

const CartItem = ({ path, info, isLashes, name, img, id, index, code, price, company, lengthArr, thicknessArr, curlArr, count }) => { 

    const { imagesCloud } = React.useContext(AuthContext);
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

    if (count === 0) {
        dispatch(
            removeItem(isLashes ? index : id)
        );  
    } 

    return (
        <div className="body-cart__item item__cart">
            <div className="item-cart__content">
                <div className="item-cart__product-block">
                    <div onClick={handleClick} className="item-cart__image">
                        <img src={`${imagesCloud}` + img} alt="product"/>
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
                    <div className="item-cart__quantity quantity-cart quantity">
                        <button onClick={onClickMinus} className="quantity__minus">-</button>
                        <div className="quantity__text">{count}</div>
                        <button onClick={onClickPlus} className="quantity__plus">+</button>
                    </div>
                    <div className="item-cart__price">{price} €</div>
                    <button onClick={onClickRemove} className="item-cart__delete">+</button>                                        
                </div>
            </div>
        </div>
    );
};

export default CartItem;