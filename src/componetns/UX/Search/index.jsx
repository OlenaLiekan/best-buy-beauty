import React from "react";

import styles from "./Search.module.scss";
import debounce from 'lodash.debounce';
import axios from "axios";
import { bodyLock, bodyUnlock, camelize } from "../../../js/script";

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
    const { searchValue, setSearchValue, scroll, setLockedSearch } = React.useContext(SearchContext);
    const { serverDomain, imagesCloud, isBlackFriday } = React.useContext(AuthContext);

    const inputRef = React.useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const clearValueWithDelay = () => {
        setTimeout(clearValue, 500);     
    };

    const clearValue = () => {    
        setValue('');        
        setSearchValue(''); 
    }

    const onClickClear = () => {
        setSearchValue('');
        setValue('');
        inputRef.current.focus();   
    }

    const updateSearchValue = React.useCallback(
        debounce((str) => {
            setSearchValue(str);        
        }, 500),
        [],
    );

    const onChangeInput = (event) => { 
        dispatch(setSearch());
        setValue(event.target.value);
        updateSearchValue(event.target.value);
    };


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
            bodyUnlock();
            setItems([]);            
        }
    }, [searchValue, serverDomain]);

    React.useEffect(() => {
        if (value) {
            setLockedSearch(true);
            bodyLock();
        } else {
            bodyUnlock();
            setLockedSearch(false);
        }
    }, [value, scroll]);

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
                    placeholder="Procurar"
                />
                {value && (
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
            {value || items.length ?
                <div className={value ? "search-header__results" : "search-header__results_hidden"}>
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
                                                    <span className="info-search__promo"> {item.discountPrice}  €</span>
                                                    :
                                                    brands.map((brand) => 
                                                        brand.id == item.brandId && brand.discount > 0 && isBlackFriday ? (item.price * (100 - brand.discount) / 100).toFixed(2) + ' €' : ''
                                                    )
                                                }          
                                                {brands.map((brand) => 
                                                    brand.id == item.brandId
                                                    ?
                                                    <span className={item.discountPrice > 0 || (brand.discount > 0 && isBlackFriday) ? "info-search__strike" : ''}>
                                                        {item.price} €
                                                    </span>
                                                    :
                                                    ''                                                  
                                                )}
                                                {item.discountPrice > 0
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
                                    </li>
                                </div>
                            )
                            }
                            {!isLoading && !items.length ? <li className="search-list__item_none">Produto não encontrado</li> : ''}
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