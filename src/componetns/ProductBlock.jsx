import axios from 'axios';
import React from 'react';
import { AuthContext } from '../context';
import { useNavigate } from 'react-router-dom';
import { addItem, removeItem} from '../redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { camelize } from '../js/script';
import { addFavorite, minusFavorite } from '../redux/slices/favoriteSlice';

const ProductBlock = ({ type, path, id, code, info, related, name, rating, available, topProduct, exclusiveProduct, isLashes, price, brandId, img, discountPrice, isPromo, kitId, typeId, variant }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [company, setCompany] = React.useState({});
    const [brandDiscount, setBrandDiscount] = React.useState(0);
    const { isAuth, adminMode, setUpdateProductMode, serverDomain, imagesCloud, setProductRemoved, isBlackFriday } = React.useContext(AuthContext);
    const [productRatings, setProductRatings] = React.useState([]);
    const [avarageRating, setAvarageRating] = React.useState(0);

    const [kitName, setKitName] = React.useState('');

    const [variants, setVariants] = React.useState([]);
    const [allVariants, setAllVariants] = React.useState(false);

    const [activeVariant, setActiveVariant] = React.useState({
        id,
        path,        
        code,
        info,
        related,
        name,
        rating,
        available,
        topProduct,
        exclusiveProduct,
        isLashes,
        price,
        brandId,
        img,
        discountPrice,
        isPromo,
        kitId,
        typeId,
        variant
    });

    const { items } = useSelector((state) => state.cart);

    const { favoriteItems } = useSelector((state) => state.favorite);

    React.useEffect(() => {
        const cartData = JSON.stringify(items);
        localStorage.setItem('cart', cartData); 
    }, [items, activeVariant]);

    React.useEffect(() => {
        const favoritesData = JSON.stringify(favoriteItems);
        localStorage.setItem('favorite', favoritesData); 
    }, [favoriteItems, activeVariant]);

    const [activeVariantPath, setActiveVariantPath] = React.useState(path);

    const percents = +activeVariant.discountPrice > 0 ? 100 - (activeVariant.discountPrice * 100 / activeVariant.price).toFixed(0) : '';
    const finalPrice = brandDiscount > 0 && isBlackFriday ? (activeVariant.price * (100 - brandDiscount) / 100).toFixed(2) : activeVariant.price;

    const cartItem = useSelector((state) => state.cart.items.find((obj) => obj.id === activeVariant.id));
    
    const favoriteItem = useSelector((state) => state.favorite.favoriteItems.find((obj) => obj.id === activeVariant.id));

    const message = () => {
        window.alert('Ocorreu um erro!');
    };

    React.useEffect(() => {
        if (activeVariant.id) {
            axios.get(`${serverDomain}api/rating?productId=${activeVariant.id}`)
                .then((res) => {
                    setProductRatings(res.data);
                });
        }
    }, [activeVariant, serverDomain]);

    React.useEffect(() => {
        if (productRatings.length > 0) {
            const calcRating = (productRatings.map((rating) => rating.name).reduce((acc, rate) => acc + rate, 0) / productRatings.length).toFixed(1);
            setAvarageRating(calcRating ? calcRating : 0);
        } else {
            setAvarageRating(0);
        }
    }, [productRatings, activeVariant]);

    React.useEffect(() => {
        axios.get(`${serverDomain}api/brand`)
            .then((res) => {
                setCompany(res.data.find((brand) => brand.id === activeVariant.brandId));
                setBrandDiscount(res.data.find((brand) => brand.id === activeVariant.brandId).discount);
            });
    }, [serverDomain, activeVariant]);

    React.useEffect(() => {
        if (activeVariant) {
            axios.get(`${serverDomain}api/type`)
                .then((res) => {
                    const type = res.data.find((type) => type.id == activeVariant.typeId);
                    setActiveVariantPath(`${type ? `/${camelize(type.name)}/${activeVariant.id}` : `/produtos/${activeVariant.id}`}`);
                });               
        }
    }, [serverDomain, activeVariant]);

    React.useEffect(() => {
        if (activeVariant.kitId > 0) {
            axios.get(`${serverDomain}api/product?limit=24&kitId=${activeVariant.kitId}`)
            .then((res) => {
                setVariants(res.data.rows);
            });
        }
    }, [serverDomain, activeVariant]);

    React.useEffect(() => {
        if (activeVariant.kitId > 0) {
            axios.get(`${serverDomain}api/kit/${activeVariant.kitId}`)
            .then((res) => {
                setKitName(res.data.name);
            });
        }
    }, [serverDomain, activeVariant]);

    const removeProduct = () => {
        if (window.confirm('Tem certeza de que deseja excluir o produto?')) {
            axios.delete(`${serverDomain}api/product?id=${activeVariant.id}`)
                .then(() => {
                    window.alert('O produto foi excluído com sucesso!');
                    setProductRemoved(activeVariant.code);
                    navigate('/auth');
                    window.scrollTo(0, 0);
                }).catch(err => message());      
        } else {
            window.alert('Cancelar exclusão.');
        }
    }

    const updateProductOn = () => {
        setUpdateProductMode(true);
        navigate(`${activeVariantPath}`);
    }

    const onClickAdd = () => {
        dispatch(addItem({ ...activeVariant, available: activeVariant.available, price: finalPrice, prevPrice: price, company: company.name, path: activeVariantPath}));
    };

    const onClickMinus = (activeVariant) => { 
        dispatch(
            removeItem(activeVariant)
        );
    };

    const showMoreVariants = () => {
        setAllVariants(true);
    };

    const onClickAddFavorite = (activeVariant) => {
        dispatch(
            addFavorite(activeVariant)
        );
    };

    const onClickMinusFavorite = (activeVariant) => {
        dispatch(
            minusFavorite(activeVariant)
        );
    };

    return (
        <div className="product-main__item item-product">
            <div className="item-product__body">
                {activeVariant.topProduct || activeVariant.exclusiveProduct
                    ?
                    <div className={activeVariant.available ? 'item-product__top-product' : 'item-product__top-product item-product__top-product-faded'}>{activeVariant.topProduct ? 'Best-seller' : 'Exclusive price'}</div>
                    :
                    ''
                }
                <div className="item-product__image">
                    <img onClick={() => navigate(`${activeVariantPath}`)} className={activeVariant.available ? '' : 'faded'} src={`${imagesCloud}` + activeVariant.img} alt="product" />
                    <div className={isAuth && adminMode ? 'item-product__actions' : 'item-product__actions_hidden'}>
                        <svg className='delete-product' onClick={removeProduct} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                            <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z" />
                        </svg>
                        <svg className='update-product' onClick={updateProductOn} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                            <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                        </svg>                                                
                    </div>
                    { 
                        activeVariant.available
                            && 
                            !(activeVariant.isLashes && !activeVariant.kitId) 
                        ?
                        (
                            
                            cartItem
                                ?
                                <div onClick={() => onClickMinus(activeVariant)} className='added-product__block'>
                                    <div className='added-product__wrapper'>
                                        <svg className='added-product__icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                            <path d="M400 480H48c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h352c26.51 0 48 21.49 48 48v352c0 26.51-21.49 48-48 48zm-204.686-98.059l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.248-16.379-6.249-22.628 0L184 302.745l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.25 16.379 6.25 22.628.001z" />
                                        </svg>   
                                    </div>
                                </div>
                                :
                                <div onClick={onClickAdd} className='add-product__block'>
                                    <div className='add-product__wrapper'>
                                        <svg className='quick-purchase__icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                            <path d="M352 240v32c0 6.6-5.4 12-12 12h-88v88c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-88h-88c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h88v-88c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v88h88c6.6 0 12 5.4 12 12zm96-160v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-48 346V86c0-3.3-2.7-6-6-6H54c-3.3 0-6 2.7-6 6v340c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z" />
                                        </svg>                                            
                                    </div>
                                </div>
                        )
                        : 
                        ''
                    }
                    {
                        kitId
                        &&
                        <div className='item-product__favorite'>
                            {
                                favoriteItem
                                    ?
                                    <svg onClick={() => onClickMinusFavorite(activeVariant)} className='item-product__favorite-icon_checked' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" />
                                    </svg>
                                    :
                                    <svg onClick={() => onClickAddFavorite(activeVariant)} className='item-product__favorite-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z" />
                                    </svg>                                
                            }
                        </div>                        
                    }

                </div>  
                <div className={activeVariant.available ? "item-product__info" : "item-product__info item-product__info-faded"}>
                    <div className='item-product__top'>
                        <div className="item-product__titles">
                            <h2 onClick={() => navigate(`${activeVariantPath}`)} className="item-product__title">
                                {activeVariant.isLashes ? kitName : activeVariant.name } 
                            </h2>
                        </div>
                        <div className="item-product__brand">
                            {company.name}
                        </div>
                        <div className="item-product__rating item-rating">
                            <svg className={avarageRating === 0 ? 'empty-star' : 'rating-star'} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                            </svg>
                            <span>{avarageRating}</span>
                        </div>
                        { 
                            variants.length > 1 && !isLashes
                            &&
                            <>
                                <ul className='item-product__variants'>
                                    <li key={activeVariant.id} className={'activeVariant'}>
                                        {activeVariant.variant}
                                    </li>
                                    {variants.length > 3 && variants[0].variant.length > 5 && !allVariants
                                        ?
                                        variants.slice(0, 3).map((product) =>  
                                            product.id !== activeVariant.id
                                                &&
                                                <li key={product.id} className={product.id === activeVariant.id ? 'activeVariant' : 'itemVariant'} onClick={() => setActiveVariant(product)}>
                                                    {product.variant}
                                                </li>)                                                
                                        :
                                        variants.map((product) =>
                                            product.id !== activeVariant.id
                                                &&
                                                <li key={product.id} className={product.id === activeVariant.id ? 'activeVariant' : 'itemVariant'} onClick={() => setActiveVariant(product)}>
                                                    {product.variant}
                                                </li>)      
                                    }
                                </ul>
                                {
                                    variants.length > 3 && variants[0].variant.length > 5 && !allVariants
                                    &&
                                    <div onClick={showMoreVariants} className='item-product__more-variants'>
                                        <span>+</span> mais {variants.length - 3} {variants.length - 3 === 1 ? 'variação' : 'variações'}
                                    </div>
                                }
                            </>
                        }
                        <div className={activeVariant.info.length && !activeVariant.isLashes ? "item-product__sizes" : "sizes_hidden"}>
                            {activeVariant.info.length
                                ?
                                activeVariant.info.map((obj) => 
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
                        <div className={activeVariant.available ? "item-product__available" : "item-product__available item-product__available_no"}>
                            {activeVariant.available ? 'Disponível' : 'Esgotado'}
                        </div> 
                        <div className="item-product__price-block">
                            <div className="item-product__price-row">
                                {percents && !activeVariant.exclusiveProduct
                                    ?
                                    <div className='item-product__price_percents'>
                                        -{percents}%
                                    </div>
                                    :
                                    ''
                                }
                                {
                                    brandDiscount > 0 && isBlackFriday && !percents && !activeVariant.exclusiveProduct
                                    ?
                                    <div className='item-product__price_percents'>
                                        -{brandDiscount}%
                                    </div>
                                    :
                                    '' 
                                }
                                <div className={+activeVariant.discountPrice > 0 || (brandDiscount > 0 && isBlackFriday && !activeVariant.exclusiveProduct) ? ("item-product__price item-product__price_strike") : "item-product__price"}>
                                    {activeVariant.price} €
                                </div>
                            </div>
                            {+activeVariant.discountPrice > 0 || (+brandDiscount > 0 && isBlackFriday && !activeVariant.exclusiveProduct)
                                ?
                                <div className={activeVariant.exclusiveProduct ? "item-product__price item-product__price_red item-product__price_discount" : "item-product__price item-product__price_discount"}>     
                                    {activeVariant.discountPrice > 0 ? activeVariant.discountPrice : finalPrice} €</div>
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