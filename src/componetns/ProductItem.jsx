import React from 'react';
import axios from 'axios';
import parse from 'html-react-parser';

import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, minusItem } from '../redux/slices/cartSlice';
import { camelize, addItemToCart } from '../js/script';
import { AuthContext } from '../context';
import { setCurrentPage } from '../redux/slices/filterSlice';
import ProductCardSlider from './UX/ProductCardSlider';

import UpdateProduct from './UX/Popups/UpdateProduct';

import ReviewItem from './ReviewItem';
import NewReview from './UX/Popups/NewReview';
import RelatedProductsBlock from './RelatedProductsBlock';

const ProductItem = ({ obj, id, info, text, applying, compound, slide, typeId, rating, isLashes, available, brandId, name, code, price, discountPrice, exclusiveProduct, img}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activeCurl, setActiveCurl] = React.useState(null);
    const [curl, setCurl] = React.useState({});
    const [curlArr, setCurlArr] = React.useState([]);
    const [activeThickness, setActiveThickness] = React.useState(null);
    const [thickness, setThickness] = React.useState({});
    const [thicknessArr, setThicknessArr] = React.useState([]);
    const [activeLength, setActiveLength] = React.useState(null);
    const [lengthArr, setLengthArr] = React.useState([]);
    const [lengthP, setLengthP] = React.useState({});
    const [types, setTypes] = React.useState([]);
    const [userRate, setUserRate] = React.useState({});
    const [productRatings, setProductRatings] = React.useState([]);
    const [avarageRating, setAvarageRating] = React.useState(0);
    const [index, setIndex] = React.useState('');
    const [activeTitles, setActiveTitles] = React.useState([]);
    const [isWarning, setIsWarning] = React.useState(false);
    const [popupSlides, setPopupSlides] = React.useState([]);
    const [company, setCompany] = React.useState({});
    const [brandDiscount, setBrandDiscount] = React.useState(0);
    const [productAdded, setProductAdded] = React.useState(false);
    const [productDownvoted, setProductDownvoted] = React.useState(false);
    const {
        isAuth,
        adminMode,
        updateProductMode,
        serverDomain,
        isBlackFriday,
        imagesCloud
    } = React.useContext(AuthContext);
    
    const cartItem = useSelector((state) => state.cart.items.find((obj) => obj.id === id));
    const lashesItem = useSelector((state) => state.cart.items.find((obj) => obj.index === index));
    const addedCount = cartItem ? cartItem.count : 0;
    const lashesCount = lashesItem ? lashesItem.count : 0;

    const percents = +discountPrice > 0 ? 100 - (discountPrice * 100 / price).toFixed(0) : '';
    const finalPrice = brandDiscount > 0 && isBlackFriday ? (price * (100 - brandDiscount) / 100).toFixed(2) : price;
    const priceValue = +discountPrice > 0 ? discountPrice : ( brandDiscount > 0 && isBlackFriday && !exclusiveProduct ? finalPrice : price);

    const tabs = ['Descrição', 'Método de uso', 'Ingredientes'];

    const data = localStorage.getItem("user");
    const user = JSON.parse(data);

    React.useEffect(() => {
        if (user) {
            setUserRate(productRatings.find((productRating) => productRating.userId === user.id));
        }
    }, [user, productRatings]);

    React.useEffect(() => {
        if (id) {
            axios.get(`${serverDomain}api/rating?productId=${id}`)
                .then((res) => {
                    setProductRatings(res.data);
                });
        }
    }, [id, serverDomain]);

    React.useEffect(() => {
        if (productRatings.length > 0) {
            const calcRating = (productRatings.map((rating) => rating.name).reduce((acc, rate) => acc + rate, 0) / productRatings.length).toFixed(1);
            setAvarageRating(calcRating ? calcRating : 0);
        }
    }, [productRatings]);

    React.useEffect(() => {
        axios.get(`${serverDomain}api/brand`)
            .then((res) => {
                setCompany(res.data.find((brand) => brand.id === brandId));
                setBrandDiscount(res.data.find((brand) => brand.id === brandId).discount);
            });
    }, [serverDomain]);


    React.useEffect(() => {
        axios.get(`${serverDomain}api/type`)
            .then((res) => {
                setTypes(res.data);
            });
    }, [serverDomain]);

    const productType = types.find((type) => type.id === typeId);
    const path = productType ? camelize(productType.name) : "produtos";

    const showCart = () => {
        if (isLashes ? lashesCount : addedCount) {
            window.scrollTo(0, 0);
            navigate('/cart');                
        } else {
            setIsWarning(true);
        }
    };

    const onClickAdd = () => {
        if (isWarning) {
            setIsWarning(false);
        }
        const item = {
            id,
            name,
            info,
            code,
            price: priceValue,
            company: company.name,
            img,
            path,
            isLashes,
            curlArr: curlArr[activeCurl],
            thicknessArr: thicknessArr[activeThickness],
            lengthArr: lengthArr[activeLength],
            index,
            available,
            promoProduct: brandDiscount > 0 && isBlackFriday || discountPrice > 0 ? true : false,
            exclusiveProduct,
        };
        dispatch(addItem(item));
        setProductDownvoted(false);
        setProductAdded(true);
        addItemToCart();
        setTimeout(() => {
            setProductAdded(false);
        }, 2000);
    };

    const onClickMinus = () => { 
        dispatch(
            minusItem(isLashes ? index : id)
        );
        if (lashesCount || addedCount > 0) {
            setProductAdded(false);
            setProductDownvoted(true);
            setTimeout(() => {
                setProductDownvoted(false);
            }, 2000);            
        }
    };

    const changePage = () => {
        dispatch(
            setCurrentPage(1)
        );
    }

    const reviewItem = productRatings ? productRatings.map((productRating) => <ReviewItem key={productRating.createdAt} {...productRating} /> ) : '';


    React.useEffect(() => {
        if (isLashes) {
            setCurlArr((Object.values(info).find((obj) => obj.title === 'Curvatura')).description.split(','));
            setCurl(Object.values(info).find((obj) => obj.title === 'Curvatura'));
            setThicknessArr((Object.values(info).find((obj) => obj.title === 'Grossura')).description.split(','));
            setThickness(Object.values(info).find((obj) => obj.title === 'Grossura'));
            setLengthArr((Object.values(info).find((obj) => obj.title === 'Tamanho')).description.split(','));
            setLengthP(Object.values(info).find((obj) => obj.title === 'Tamanho'));
        }       
    }, [isLashes, info]);

    React.useEffect(() => {
        setIndex(id + curlArr[activeCurl] + thicknessArr[activeThickness] + lengthArr[activeLength]); 
    }, [id, activeCurl, activeLength, activeThickness, curlArr, thicknessArr, lengthArr]);
    
    const paragraphs = text.length ? text[0].text.split('\r\n') : '';
    const paragraphsApplying = applying.length ? applying[0].text.split('\r\n') : '';
    const paragraphsCompound = compound.length ? compound[0].text.split('\r\n') : '';

    React.useEffect(() => {
        let props = [];
        props = [...props, img];
        if (slide) {
            slide.forEach((s) => {
                props = [...props, s.slideImg];
            });
        }
        setPopupSlides(props); 

    }, [img, slide]);

    return (
        <div className='product-card__content'>
            <div className="product-card__go-back go-back">
                <Link to={`/${path}`} className='go-back__link'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z" />
                    </svg>
                    <span onClick={changePage}>Voltar</span>
                </Link>
            </div>
            <div className="product-card__body">
                {isAuth && adminMode && updateProductMode ? <UpdateProduct obj={obj} id={id} /> : ''}
                <div className="images-product__wrapper">
                    <div className="product-card__images images-product">
                        <ProductCardSlider img={img} slides={slide} popupSlides={popupSlides} />                                
                    </div>
                    <div className="product-card__aside">
                        <div className="product-card__info info-product">
                            <div className="info-product__titles">
                                <h1 className="info-product__title">
                                    {name} 
                                </h1>   
                                <div className="info-product__rating item-rating">
                                    <svg className={avarageRating === 0 ? 'empty-star' : 'rating-star'} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                        <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                                    </svg>
                                    <span>{avarageRating}</span>
                                </div>
                            </div>
                            <div className="info-product__number">
                                <span className="label-bold">
                                    Código do produto:
                                </span>
                                {code}
                            </div>
                            <div className="info-product__brand"><span className="label-bold">Marca:</span> {company.name}</div>
                            {info.length && !isLashes ? info.map((obj) => 
                                <div key={obj.id} className='info-product__volume'>  
                                    <span className="label-bold">
                                        {obj.title}:
                                    </span>
                                    <div className="volume__value">
                                        {obj.description}
                                    </div>
                                </div>                                    
                            ) :
                                ''
                            }
                            
                            {isLashes
                                ?
                                <>
                                    <div className="info-product__curl">
                                        <label htmlFor="curlList" className="label-bold">{curl.title}:</label>
                                        <div className="curl__select select-curl">   
                                            <ul id="curlList" className="curl__list list-curl">
                                                {curlArr.map((itemCurl, curlIndex) =>
                                                    <li key={curlIndex}
                                                        onClick={() => setActiveCurl(curlIndex)}
                                                        className={activeCurl === curlIndex ? 'activeCurl' : 'curlItem'}>
                                                        {itemCurl}
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>      
                                    <div className="info-product__thick">
                                        <label className="label-bold">{thickness.title}: </label>
                                        <div className="thick__select select-thick"> 
                                            <ul className="thick__list list-thick">
                                                {thicknessArr.map((itemThick, thickIndex) => 
                                                    <li key={itemThick} onClick={() => setActiveThickness(thickIndex)} className={activeThickness === thickIndex ? "activeThick" : "thickItem"}>
                                                        {itemThick}
                                                    </li>
                                                )}                              
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="info-product__length">
                                        <label htmlFor="lengthList" className="label-bold">{lengthP.title}, mm: </label>
                                        <div className="length__select select-length"> 
                                            <ul className="length__list list-length">
                                                {lengthArr.map((itemLength, lengthIndex) => 
                                                    <li key={itemLength} onClick={() => setActiveLength(lengthIndex)} className={activeLength === lengthIndex ? "activeLength" : "lengthItem"}>
                                                        {itemLength}
                                                    </li>
                                                )}                              
                                            </ul>
                                        </div>
                                    </div> 
                                </>
                                : ''
                            }          
                            <div className="info-product__price">
                                <span className="label-bold">Preço:</span>
                                {price !== 0
                                    ?
                                    <div className='price__value-block'>
                                        <div className='price__value-row'>
                                            {percents && !exclusiveProduct
                                                ?
                                                <div className='price__value_percents'>
                                                    - {percents}%
                                                </div>
                                                :
                                                ''
                                            }
                                            {
                                                brandDiscount > 0 && isBlackFriday && !percents && !exclusiveProduct
                                                ?
                                                <div className='item-product__price_percents'>
                                                    -{brandDiscount}%
                                                </div>
                                                :
                                                '' 
                                            }
                                            <div className={
                                                +discountPrice > 0 || (+brandDiscount > 0 && isBlackFriday && !exclusiveProduct)
                                                    ?
                                                    ("price__value_strike")
                                                    : "price__value"
                                            }>
                                                {price} €                                
                                            </div>                                              
                                        </div>
                                        {+discountPrice > 0 || (+brandDiscount > 0 && isBlackFriday && !exclusiveProduct)
                                            ?
                                            <div className={!exclusiveProduct ? "price__value price__value_discount" : "price__value price__value_red price__value_discount"}>
                                                {discountPrice > 0 ? discountPrice : finalPrice} €
                                            </div>
                                            :
                                            ''
                                        }
                                    </div> 
                                : 
                                'Verifique com o gerente.'    
                                }
                            </div> 

                        </div>
                        <div className="product-card__available available">
                            {available
                                ?
                                <span className='available_true'>Disponível</span>
                                :
                                <span className='available_false'>Esgotado</span>
                            }
                        </div>
                        {isWarning
                            ?
                            <div className='product-card__warning'>Selecione a quantidade de mercadorias!</div>
                            :
                            ''
                        } 
                        {price !== 0 && available
                            ?
                            <div className="product-card__actions">

                                {(!isLashes && company.name) || (activeCurl !== null && activeLength !== null && activeThickness !== null && company.name) 
                                    ?
                                    <>
                                        <div className="product-card__quantity quantity">
                                            <span className={productAdded ? "quantity__product-added" : "quantity__product-added quantity__product-added_hidden"}>Produto adicionado ao carrinho</span>
                                            <span className={productDownvoted ? "quantity__product-added" : "quantity__product-added quantity__product-added_hidden"}>O produto foi rejeitado</span>
                                            <button onClick={onClickMinus} className="quantity__minus">-</button>
                                            <div className="quantity__text">{isLashes ? lashesCount : addedCount}</div>
                                            <button onClick={onClickAdd} className="quantity__plus">+</button>
                                        <div className="product-card__motion">
                                            <div className='product-card__img-clone'>
                                                <img src={`${imagesCloud}` + img} alt="product" />
                                            </div>                                            
                                        </div>                                            
                                        </div>    

                                        <button onClick={showCart} className="checkout">
                                            Ver cesto
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                                            </svg>
                                        </button>
                                    </>   
                                : <div className='product-card__warning'>{company.name ? 'Selecione opções para adicionar item ao carrinho.' : 'Carregando...'}</div>   
                                }
                            </div>       
                            :
                            ""
                        }                         
                    </div>
                </div>
            </div>
            <div className='product-card__else else-product'>

                {isAuth && user.role === 'USER' && !userRate
                    ?
                    <NewReview productId={id} userId={user.id} userName={user.firstName} rating={rating} />
                    :
                    ''
                }    
                <div className="product-card__description description-product">
                    <div className="product-card__titles titles-product">
                        {tabs.map((tab, index) => 
                            <div key={index} className='titles-product__column'>
                                <h3 onClick={() => setActiveTitles(activeTitles.includes(index) ? activeTitles.filter((title) => title != index) : [...activeTitles, index])} className={activeTitles.includes(index) ? 'description-product__title description-product__title_active' : 'description-product__title'}>
                                    {tab}
                                    <svg key={index} className={activeTitles.includes(index) ? 'titles-product__icon titles-product__icon_active' : 'titles-product__icon'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                                    </svg>
                                </h3>
                                <div className='product-card__column-v'>
                                    {text.length && index === 0
                                        ?
                                        paragraphs.map((p, i) => 
                                            <p key={i} className={activeTitles.includes(0) ? 'description-product__text' : 'description-product__text_hidden'}>
                                                {parse(`${p}`)}
                                            </p>                        
                                        )
                                        : ''                        
                                    }
                                    <p className={
                                        activeTitles.includes(0) && typeId === 21 && index === 0
                                            ?
                                            'description-product__text'
                                            :
                                            'description-product__text_hidden'
                                    }>
                                        Download the Pigment Color Chart: <br/>
                                        <Link to='https://drive.google.com/file/d/1jcjdMGNQ32Umey6bjRMv1m7X-lUAR-XX/view?usp=sharing' className="description-product__pmu-link">
                                            https://drive.google.com/file/d/1jcjdMGNQ32Umey6bjRMv1m7X-lUAR-XX/view?usp=sharing
                                        </Link>
                                    </p>
                                    <p className={
                                        activeTitles.includes(0) && typeId === 21 && index === 0
                                            ?
                                            'description-product__text'
                                            :
                                            'description-product__text_hidden'
                                    }>
                                        Download the brochure for pigments: <br />
                                        <Link to="https://drive.google.com/file/d/1EvZCS-BGTRn07VJvy63oniTtbWVV1NXG/view?usp=sharing" className="description-product__pmu-link">
                                            https://drive.google.com/file/d/1EvZCS-BGTRn07VJvy63oniTtbWVV1NXG/view?usp=sharing
                                        </Link>
                                    </p>
                                    <p className={
                                        activeTitles.includes(0) && typeId === 21 && index === 0
                                            ?
                                            'description-product__text'
                                            :
                                            'description-product__text_hidden'
                                    }>
                                        Download the REACH Compliance Declaration: <br />
                                        <Link to="https://drive.google.com/file/d/1m9XfvNJa8MvPpt6WSIWHcyjJtP-ncL_L/view?usp=sharing" className="description-product__pmu-link">
                                            https://drive.google.com/file/d/1m9XfvNJa8MvPpt6WSIWHcyjJtP-ncL_L/view?usp=sharing
                                        </Link>
                                    </p>
                                    <p className={
                                        activeTitles.includes(0) && typeId === 21 && index === 0
                                            ?
                                            'description-product__text'
                                            :
                                            'description-product__text_hidden'
                                    }>
                                        Download the Safety Data Sheet: <br />
                                        <Link to="https://drive.google.com/file/d/15W1lCaZ7Gs8momCtqaWxtj1GahRXL2nu/view?usp=sharing" className="description-product__pmu-link">
                                            https://drive.google.com/file/d/15W1lCaZ7Gs8momCtqaWxtj1GahRXL2nu/view?usp=sharing
                                        </Link>
                                    </p>
                                    {applying.length && index === 1
                                        ? 
                                        paragraphsApplying.map((p, i) => 
                                            <p key={i} className={activeTitles.includes(1) ? 'description-product__text' : 'description-product__text_hidden'}>
                                                {parse(`${p}`)}
                                            </p>                        
                                        )
                                        : ''                        
                                    }
                                    {compound.length && index === 2
                                        ? 
                                        paragraphsCompound.map((p, i) => 
                                            <p key={i} className={activeTitles.includes(2) ? 'description-product__text' : 'description-product__text_hidden'}>
                                                {parse(`${p}`)}
                                            </p>                        
                                        )
                                        : ''                     
                                    }
                                </div>
                            </div>                     
                        )}
                    </div>
                </div>
            </div>
            <RelatedProductsBlock related={obj.related} />
            <div className="product-card__reviews reviews">
                {productRatings.length
                    ?                         
                    <div className="reviews__items">
                        {reviewItem ? reviewItem : ''}
                    </div>
                    :
                    <p className='reviews__text'>
                        {adminMode ? '' :  'Ainda não há comentários sobre o produto. Você quer ser o primeiro?'}
                    </p>
                }                             
            </div>   
            {!isAuth
                ?
                    <Link className='product-card__login-link' to='/login'>
                        <span>Faça login</span> na sua conta para deixar uma avaliação do produto.
                    </Link>
                :
                    ''
            }  
        </div>
    );
};

export default ProductItem;