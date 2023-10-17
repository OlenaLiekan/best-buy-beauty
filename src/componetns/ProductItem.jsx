import React from 'react';

import { useNavigate, Link } from 'react-router-dom';
import ProductCardSlider from './UX/ProductCardSlider';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, minusItem } from '../redux/slices/cartSlice';
import { camelize } from '../js/script';
import axios from 'axios';
import UpdateProduct from './UX/Popups/UpdateProduct';
import { AuthContext } from '../context';
import ReviewItem from './ReviewItem';
import NewReview from './UX/Popups/NewReview';
import { setCurrentPage } from '../redux/slices/filterSlice';

const ProductItem = ({ obj, id, info, text, applying, compound, slide, typeId, rating, isLashes, brandId, name, code, price, img}) => {

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
    const [brands, setBrands] = React.useState([]);
    const [types, setTypes] = React.useState([]);
    const [userRate, setUserRate] = React.useState({});
    const [productRatings, setProductRatings] = React.useState([]);
    const [index, setIndex] = React.useState('');
    const [activeTitle, setActiveTitle] = React.useState(0);

    const tabs = ['Descrição', 'Método de uso', 'Ingredientes'];

    const { isAuth, adminMode, updateProductMode, serverDomain } = React.useContext(AuthContext);

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
        axios.get(`${serverDomain}api/brand`)
            .then((res) => {
                setBrands(res.data);
            });
    }, [serverDomain]);


    const companyNames = brands.map((brand) => brand.name);
    const company = companyNames.find((companyName, i) => i + 1 === brandId);

    React.useEffect(() => {
        axios.get(`${serverDomain}api/type`)
            .then((res) => {
                setTypes(res.data);
            });
    }, [serverDomain]);

    const typeNames = types.map((type) => camelize(type.name));
    const path = typeNames.find((typeName, i) => i === typeId);

    const showCart = () => {
        if (isLashes ? lashesCount : addedCount) {
            window.scrollTo(0, 0);
            navigate('/cart');
        }
    };

    const cartItem = useSelector((state) => state.cart.items.find((obj) => obj.id === id));
    const lashesItem = useSelector((state) => state.cart.items.find((obj) => obj.index === index));
    const addedCount = cartItem ? cartItem.count : 0;
    const lashesCount = lashesItem ? lashesItem.count : 0;

    const onClickAdd = () => {
            const item = {
                id,
                name,
                info,               
                code,
                price,
                company,
                img,
                path,
                isLashes,
                curlArr: curlArr[activeCurl],
                thicknessArr: thicknessArr[activeThickness],
                lengthArr: lengthArr[activeLength],
                index
            };
            dispatch(addItem(item));           
    };

    const onClickMinus = () => { 
        dispatch(
            minusItem(isLashes ? index : id)
        );

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

    return (
        <div className="product-card__content">
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
                        <ProductCardSlider img={img} slides={slide} />                                
                    </div>
                    <div className="product-card__aside">
                        <div className="product-card__info info-product">
                            <div className="info-product__titles">
                                <h1 className="info-product__title">
                                    {name} 
                                </h1>   
                                <div className="info-product__rating item-rating">
                                    <svg className={rating === 0 ? 'empty-star' : 'rating-star'} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                        <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                                    </svg>
                                    <span>{rating}</span>
                                </div>
                            </div>

                            <div className="info-product__number"><span className="label-bold">Código do produto:</span> {code}</div>
                            <div className="info-product__brand"><span className="label-bold">Marca:</span> {company}</div>
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
                                <div className="price__value">
                                    {price} €                                    
                                </div>
                                : 
                                'Verifique com o gerente.'    
                                }
                            </div> 
                        </div> 
                        {price !== 0
                            ?
                            <div className="product-card__actions">
                                {!isLashes || (activeCurl !== null && activeLength !== null && activeThickness !== null)
                                    ?
                                    <>
                                        <div className="product-card__quantity quantity">
                                            <button onClick={onClickMinus} className="quantity__minus">-</button>
                                            <div className="quantity__text">{isLashes ? lashesCount : addedCount}</div>
                                            <button onClick={onClickAdd} className="quantity__plus">+</button>
                                        </div>                                  
                                        <button onClick={showCart} className="checkout">
                                            Confira
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                                            </svg>
                                        </button>
                                    </>   
                                : 'Selecione opções para adicionar item ao carrinho.'    
                                }
                            </div>       
                            :
                            ''
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
                        {tabs.map((tab, i) => 
                            <h3 key={i} onClick={() => setActiveTitle(i)} className={activeTitle === i ? 'description-product__title description-product__title_active' : 'description-product__title'}>
                                {tab}
                            </h3>                        
                        )}
                    </div>
                    {text.length
                        ? 
                        paragraphs.map((p, i) => 
                            <p key={i} className={activeTitle === 0 ? 'description-product__text' : 'description-product__text_hidden'}>
                                {p}
                            </p>                        
                        )
                        : ''                        
                    }
                    {applying.length
                        ? 
                        paragraphsApplying.map((p, i) => 
                            <p key={i} className={activeTitle === 1 ? 'description-product__text' : 'description-product__text_hidden'}>
                                {p}
                            </p>                        
                        )
                        : ''                        
                    }
                    {compound.length
                        ? 
                        paragraphsCompound.map((p, i) => 
                            <p key={i} className={activeTitle === 2 ? 'description-product__text' : 'description-product__text_hidden'}>
                                {p}
                            </p>                        
                        )
                        : ''                        
                    }
                </div>
            </div>
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