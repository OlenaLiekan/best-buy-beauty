import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { popupInit, scrollTop } from '../js/script';

import PopupSubmitForm from '../componetns/UX/Popups/PopupSubmitForm';
import CartItem from '../componetns/UX/CartItem';
import CartEmpty from '../componetns/CartEmpty';
import { clearItems } from '../redux/slices/cartSlice';
import axios from 'axios';
import { AuthContext } from '../context';

const Cart = () => { 
    const dispatch = useDispatch();
    const { totalPrice, items } = useSelector((state) => state.cart);
    const { serverDomain } = React.useContext(AuthContext);
    const totalCount = items.reduce((sum, item) => sum + item.count, 0);
    const [deliveryPrices, setDeliveryPrices] = React.useState([]);
    const [deliveryPrice, setDeliveryPrice] = React.useState('0.00');
    //const isMounted = React.useRef(false);

    React.useEffect(() => {
        axios.get(`${serverDomain}api/delivery`)
            .then((res) => {
                setDeliveryPrices(res.data);
            });
    }, [serverDomain]);

    React.useEffect(() => {
        if (deliveryPrices.length) {
            const oneProduct = deliveryPrices.find((delivery) => delivery.type === 'Um produto');
            const moreProducts = deliveryPrices.find((delivery) => delivery.type === 'Mais produtos');
            const freeDelivery = deliveryPrices.find((delivery) => delivery.type === 'Entrega grátis');
            if (totalCount === 1 && totalPrice < freeDelivery.requiredSum) {
                setDeliveryPrice(oneProduct.price);
            } else if (totalCount > 1 && totalPrice < freeDelivery.requiredSum) {
                setDeliveryPrice(moreProducts.price);
            } else {
                setDeliveryPrice(freeDelivery.price);
            }                 
        }
    }, [totalCount, totalPrice, deliveryPrices]);


    const onClickClear = () => { 
        if (window.confirm('Tem certeza de que deseja esvaziar o carrinho?')) {
            dispatch(
                clearItems()
            );            
        }
    };

    React.useEffect(() => {
        //if (isMounted.current) {
            const cartData = JSON.stringify(items);
            localStorage.setItem('cart', cartData);
        //}
        //isMounted.current = true;
    }, [items]);

    if (!totalPrice) {
        return <CartEmpty />
    }

    return (
        <div className="main__cart cart">
            <PopupSubmitForm totalCount={totalCount} deliveryPrice={deliveryPrice} />
            <div className="cart__container">
                <div className="cart__content">
                    <div className="cart__header header-cart">
                        <div className="header-cart__content">
                            <h2 className="header-cart__title">
                                Carrinho
                            </h2>
                            <button onClick={onClickClear} className="header-cart__clear">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"/></svg>
                                Limpar tudo
                            </button>
                        </div>
                    </div>
                    <div className="cart__body body-cart">
                        <div className="body-cart__items">
                            {
                                items.map((item, i) => (
                                    <CartItem key={i} {...item} />
                                ))
                            }
                        </div>
                    </div>
                    <div className="cart__bottom bottom-cart">
                        <div className="bottom-cart__content">
                            <div className="bottom-cart__total total">
                                <div className="total__number">
                                    Quantidade total: {totalCount}
                                </div>
                                <div className="total__sum">
                                    <div>Custo de entrega: {deliveryPrice} €</div>
                                    <div>Montante total: {(+totalPrice.toFixed(2) + Number(deliveryPrice)).toFixed(2)} €</div>
                                </div>
                            </div>               

                            <div className="bottom-cart__actions">
                                <Link to="/catalog" onClick={scrollTop} className="go-shopping scroll-top">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/></svg>
                                    Voltar às compras
                                </Link>
                                <button onClick={popupInit} type="button" className="button__submit checkout">
                                    Confirme a ordem
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>
                                </button>
                            </div>   
                        </div>
                    </div>    
                </div>

            </div>
      </div>
    );
};

export default Cart;