import axios from 'axios';
import React from 'react';
import { AuthContext } from '../context';
import { useNavigate } from 'react-router-dom';


const ProductBlock = ({ path, id, code, info, name, rating, available, topProduct, exclusiveProduct, isLashes, price, brandId, img, discountPrice, isPromo }) => {

    const navigate = useNavigate();

    const [company, setCompany] = React.useState({});
    const [brandDiscount, setBrandDiscount] = React.useState(0);
    const { isAuth, adminMode, setUpdateProductMode, serverDomain, imagesCloud, setProductRemoved, isBlackFriday } = React.useContext(AuthContext);

    const percents = +discountPrice > 0 ? 100 - (discountPrice * 100 / price).toFixed(0) : '';
    const finalPrice = brandDiscount > 0 && isBlackFriday ? (price * (100 - brandDiscount) / 100).toFixed(2) : price;

    const message = () => {
        window.alert('Ocorreu um erro!');        
    }

    React.useEffect(() => {
        axios.get(`${serverDomain}api/brand`)
            .then((res) => {
                setCompany(res.data.find((brand) => brand.id === brandId));
                setBrandDiscount(res.data.find((brand) => brand.id === brandId).discount);
            });
    }, [serverDomain]);

    const removeProduct = () => {
        if (window.confirm('Tem certeza de que deseja excluir o produto?')) {
            axios.delete(`${serverDomain}api/product?id=${id}`)
                .then(() => {
                    window.alert('O produto foi excluído com sucesso!');
                    setProductRemoved(code);
                    navigate('/auth');
                    window.scrollTo(0, 0);
                }).catch(err => message());      
        } else {
        window.alert('Cancelar exclusão.');
        }
    }

    const updateProductOn = () => {
        setUpdateProductMode(true);
        navigate(`${path}`);
    }

    return (
        <div className="product-main__item item-product">
            <div className="item-product__body">
                {topProduct || exclusiveProduct
                    ?
                    <div className={available ? 'item-product__top-product' : 'item-product__top-product item-product__top-product-faded'}>{topProduct ? 'Best-seller' : 'Exclusive price'}</div>
                    :
                    ''
                }
                <div className={isAuth && adminMode ? 'item-product__actions' : 'item-product__actions_hidden'}>
                    <svg className='delete-product' onClick={removeProduct} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                        <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z" />
                    </svg>
                    <svg className='update-product' onClick={updateProductOn} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                        <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                    </svg>                                                
                </div>
                <div onClick={() => navigate(`${path}`)} className="item-product__image">
                    <img className={available ? '' : 'faded'} src={`${imagesCloud}` + img} alt="product"/>
                </div>  
                <div className={available ? "item-product__info" : "item-product__info item-product__info-faded"}>
                    <div className='item-product__top'>
                        <div className="item-product__titles">
                            <h2 onClick={() => navigate(`${path}`)} className="item-product__title">
                                {name} 
                            </h2>
                        </div>
                        <div className="item-product__brand">
                            {company.name}
                        </div>
                        <div className="item-product__rating item-rating">
                            <svg className={rating === '0' ? 'empty-star' : 'rating-star'} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                            </svg>
                            <span>{rating}</span>
                        </div>
                        <div className={info.length && !isLashes ? "item-product__sizes" : "sizes_hidden"}>
                            {info.length && !isLashes ? info.map((obj) => 
                                <div key={obj.id} className='item-product__details'>
                                    <span className="label-bold">
                                        {obj.title}:
                                    </span>
                                    <div className="item-product__value">
                                        {obj.description}
                                    </div>                                      
                                </div>                                    
                            ) :
                                ''
                            }
                        </div>                                        
                    </div>
                    <div className='item-product__bottom'>
                        <div className={available ? "item-product__available" : "item-product__available item-product__available_no"}>
                            {available ? 'Disponível' : 'Não disponível'}
                        </div> 
                        <div className="item-product__price-block">
                            <div className="item-product__price-row">
                                {percents
                                    ?
                                    <div className='item-product__price_percents'>
                                        -{percents}%
                                    </div>
                                    :
                                    ''
                                }
                                {
                                    brandDiscount > 0 && isBlackFriday && !percents
                                    ?
                                    <div className='item-product__price_percents'>
                                        -{brandDiscount}%
                                    </div>
                                    :
                                    '' 
                                }
                                <div className={+discountPrice > 0 || (brandDiscount > 0 && isBlackFriday) ? "item-product__price item-product__price_strike" : "item-product__price"}>{price} €</div>
                            </div>
                            {+discountPrice > 0 || (+brandDiscount > 0 && isBlackFriday)
                                ?
                                <div className="item-product__price item-product__price_discount">
                                    {discountPrice > 0 ? discountPrice : finalPrice} €</div>
                                : ''
                            }
                        </div>
                    </div>                    
                </div>
            </div>
        </div>                  
    );
};

export default ProductBlock;