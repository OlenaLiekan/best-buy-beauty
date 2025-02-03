import React from "react";

import styles from "./Search.module.scss";
import debounce from 'lodash.debounce';
import axios from "axios";
import { camelize, bodyLock, bodyUnlock } from "../../../js/script";

import { SearchContext } from '../../../App';
import { setSearch } from "../../../redux/slices/filterSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context";

const Search = () => { 

    const [items, setItems] = React.useState([]);
    const [types, setTypes] = React.useState([]);
    const [brands, setBrands] = React.useState([]);
    const [value, setValue] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true); 
    const { searchValue, setSearchValue, setLockedSearch } = React.useContext(SearchContext);
    const { isAuth, adminMode, setUpdateProductMode, setProductRemoved, serverDomain, imagesCloud, isBlackFriday } = React.useContext(AuthContext);

    const inputRef = React.useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const clearValueWithDelay = () => {
        setTimeout(clearValue, 1000);    
    };

    const clearValue = () => {    
        setValue('');         
    }

    const onClickClear = () => {
        bodyUnlock();        
        setSearchValue('');
        setValue('');
        inputRef.current.focus();  
        setLockedSearch(false);        
    }

    const updateSearchValue = React.useCallback(
        debounce((str) => {
            setSearchValue(str);   
            setValue('');
            if (!str.length) {
                bodyUnlock();
                setLockedSearch(false);
            }
            inputRef.current.blur(); 
        }, 2000),
        [searchValue],
    );

    const onChangeInput = (event) => { 
        dispatch(setSearch());
        setValue(event.target.value);
        bodyLock();
        setLockedSearch(true);         
        updateSearchValue(event.target.value);
    };

    /*const message = () => {
        window.alert('Ocorreu um erro!');        
    }*/


    React.useEffect(() => {
        if (searchValue) {
            setIsLoading(true);
                axios
                .get(
                    `${serverDomain}api/product?name=${searchValue}`,
                )
                .then((res) => {
                    if (res.data.count > 0) {
                        setItems(res.data.rows);
                    }
                });
            setIsLoading(false);            
            window.scrollTo(0, 0);  
        } else {
            setItems([]);  
            bodyUnlock();
            setLockedSearch(false);
        }
    }, [searchValue, serverDomain]);

    React.useEffect(() => {
        axios.get(`${serverDomain}api/brand`)
            .then((res) => {
                setBrands(res.data);
            });
    }, [serverDomain]);

    React.useEffect(() => {
        axios
            .get(
                `${serverDomain}api/type`,
            )
            .then((res) => {
                setTypes(res.data);
            });
        window.scrollTo(0, 0);
    }, [serverDomain]);

    const showProduct = (typeId, id) => {
        setSearchValue('');
        const path = types.find((type) => type.id === typeId);
        navigate(`/${camelize(path.name)}/${id}`); 
    }

    /*const removeProduct = (id, code) => {
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
    }*/

    const updateProductOn = (typeId, id) => {
        setUpdateProductMode(true);
        const path = types.find((type) => type.id === typeId);
        navigate(`/${camelize(path.name)}/${id}`); 
    }

    return (
        <div className="body-header__search search-header">
            <form className="search-header__form">
                <div className="search-header__button _icon-search">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512">
                        <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 
                        44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208
                        208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4
                        9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7
                        0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128
                        0 70.7-57.2 128-128 128z" />
                    </svg>
                </div>
                <input
                    id="searchInput"
                    ref={inputRef}
                    value={value}
                    onChange={onChangeInput}
                    onBlur={clearValueWithDelay}
                    className="search-header__input"
                    autoComplete="off" type="text"
                    placeholder={searchValue.length ? searchValue : "Procurar"}
                />
                {searchValue && (
                    <svg
                        onClick={onClickClear}
                        className={styles.clearIcon}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 352 512">
                        <path
                            d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 
                            0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93
                            89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19
                            0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28
                            12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48
                            0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                        />
                    </svg>
                )}
            </form>
            {searchValue || items.length ?
                <div className={searchValue ? "search-header__results" : "search-header__results_hidden"}>
                    <div className="search-header__body">
                        <ul className="search-header__list search-list">
                            {isLoading ? '' : items.map((item) =>
                                <div onClick={() => showProduct(item.typeId, item.id)} key={item.id} value={item.name} >
                                    <li className="search-list__item item-search">
                                        <div className="item-search__image">
                                            <img src={`${imagesCloud}` + item.img} alt="product preview" />
                                        </div>
                                        <div className="item-search__info info-search">
                                            <h2>{item.name}</h2>
                                            
                                            {
                                                brands.map((brand) => 
                                                    brand.id == item.brandId ? brand.name : ''
                                                )
                                            }
                                            
                                            <div className="info-search__price-block">

                                                {item.discountPrice > 0
                                                    ?
                                                    <span className={!item.exclusiveProduct ? "info-search__promo" : "info-search__promo info-search__promo_red"}>
                                                        {/*item.exclusiveProduct ? "10+ unid: " : ''*/}
                                                        {item.discountPrice}  €
                                                    </span>
                                                    :
                                                    brands.map((brand) => 
                                                        brand.id == item.brandId && brand.discount > 0 && isBlackFriday ? (item.price * (100 - brand.discount) / 100).toFixed(2) + ' €' : ''
                                                    )
                                                }          
                                                {brands.map((brand) => 
                                                    brand.id == item.brandId
                                                    ?
                                                    <span className={item.discountPrice > 0 || (brand.discount > 0 && isBlackFriday) ? (/*item.exclusiveProduct ? "" :*/ "info-search__strike") : ''}>
                                                        {/*item.exclusiveProduct && item.discountPrice > 0 ? "1-9 unid: " : ''*/}
                                                        {item.price} €
                                                    </span>
                                                    :
                                                    ''                                                  
                                                )}
                                                {item.discountPrice > 0 && !item.exclusiveProduct
                                                    ?
                                                    <div className="info-search__percents">
                                                        - {100 - (item.discountPrice * 100 / item.price).toFixed(0)}%
                                                    </div>  
                                                    :
                                                    <div className="info-search__percents info-search__percents_black">
                                                        {brands.map((brand) => 
                                                            brand.discount > 0 && isBlackFriday && brand.id === item.brandId ? <span>- {brand.discount}%</span> : '' 
                                                        )}
                                                    </div>  
                                                }
                                            </div>
                                        </div>
                                        <div onClick={() => updateProductOn(item.typeId, item.id)} className={isAuth && adminMode ? 'item-product__actions' : 'item-product__actions_hidden'}>
                                            <svg className='update-product' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                                <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                                            </svg>                                                
                                        </div>
                                    </li>
                                    
                                </div>
                            )
                            }
                            {!isLoading && !items.length ? <li className="search-list__item_none">Total de 0 resultados encontrados</li> : <li className="search-list__item_none">Total de {items.length ? items.length : 0} resultados mostrados</li>}
                        </ul>
                    </div>
                </div>
                :
                ''
            }
        </div>
    );
};

export default Search;