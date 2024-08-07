import React from 'react';

import { camelize } from '../js/script';
import qs from 'qs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Pagination from '../componetns/UX/Pagination';
import Brands from '../componetns/UX/Brands';
import Sort from '../componetns/UX/Sort';
import { AuthContext } from '../context';

import ProductBlock from "../componetns/ProductBlock";
import Skeleton from "../componetns/UI/Skeletons/Skeleton";

import { setBrandId, setCurrentPage } from '../redux/slices/filterSlice';
import NotFoundProduct from '../componetns/NotFoundProduct';
import CreateProduct from '../componetns/UX/Popups/CreateProduct';
import { SearchContext } from '../App';

const ProductPage = ({type}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { categoryId, brandId, sort, currentPage } = useSelector((state) => state.filter);

    const { searchValue } = React.useContext(SearchContext);
    const { isAuth, adminMode, createProductMode, setCreateProductMode, serverDomain, isPromoPage } = React.useContext(AuthContext);

    const [items, setItems] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const [subItems, setSubItems] = React.useState([]);

    const onChangeBrand = (id) => {
        dispatch(setBrandId(id));
    };  

    const onChangePage = (number) => { 
        dispatch(setCurrentPage(number));            
    };

    const showPopupCreate = () => {
        setCreateProductMode(true);
    } 

    React.useEffect(() => {
        if (categoryId && localStorage.getItem('subItems')) {
            const data = JSON.parse(localStorage.getItem('subItems'));
            setSubItems(data);
        }
    }, [categoryId, serverDomain]);

    React.useEffect(() => {
        setIsLoading(true);
        const sortBy = sort.sortProperty.replace('-', '');        
        const order = sort.sortProperty.includes('-') ? 'ASC' : 'DESC';
        const brandCategory = brandId === 0 ? '' : `&brandId=${brandId}`;
        const search = searchValue ? `&name=${searchValue}` : '';
        const typeId = type.id ? `&typeId=${type.id}` : ''; 
        const category = categoryId ? `&categoryId=${categoryId}` : '';
        const promo = isPromoPage ? '&isPromo=true' : '';
        axios.get(`${serverDomain}api/product?info&page=${currentPage}&limit=24${category}${typeId}${brandCategory}&sort=${sortBy}&order=${order}${search}${promo}`)
        .then((res) => {
            setItems(res.data.rows);
        });
        setIsLoading(false);
        window.scrollTo(0, 0);
    }, [categoryId, brandId, sort, currentPage, searchValue, type.id, serverDomain, isPromoPage]);

    React.useEffect(() => {
        const typeId = type.id;
        const queryString = qs.stringify({
            sortProperty: sort.sortProperty,
            categoryId,
            typeId,
            brandId,
            currentPage,
        });
        navigate(`?${queryString}`);
    }, [categoryId, brandId, currentPage, sort.sortProperty, navigate]);
    
    const products = items.map((item) => <div key={item.id}><ProductBlock text={item.text} info={item.info} path={`/${camelize(type.name)}/${item.id}`} {...item} /></div>);
    const skeletons = [...new Array(12)].map((_, index) => <Skeleton key={index} />);

    return (
        <div className="main__product product-main">
            <div className="product-main__container">
                <div className="product-main__content">
                    {type.id == 21
                        ?
                        <div className='product-main__banner'>
                            <div className="img"></div>
                        </div>
                        :
                        ''
                    }
                    {type.id == 21
                        ?
                        ''
                        : 
                        <Brands type={type} brandId={brandId} products={items} onChangeBrand={onChangeBrand} />
                    }
                    <Sort arrItem={type} />
                    {isAuth && adminMode && createProductMode ? <CreateProduct /> : ''}
                    {categoryId
                        ?
                        <h2 className='product-main__type'>
                            {subItems.map((subItem) =>
                                subItem.name + ' / '                  
                            )}
                        </h2> 
                        :
                        <h1 className='product-main__type'>
                            {type.id > 0 ? type.name : (isPromoPage ? 'Produtos promocionais' : 'Todos os produtos')}
                        </h1>                        
                    }
                    <div className="product-main__items">
                        <div className={isAuth && adminMode && !createProductMode ? "item-product" : "item-product_hidden"}>
                        <div className='item-product__add'>
                            <svg onClick={showPopupCreate} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z" />
                            </svg>                                        
                        </div>
                    </div>
                        {isLoading ? skeletons : products}
                    </div>
                    {items.length < 1 && !isLoading ? <NotFoundProduct /> : ''}
                    <Pagination type={type} onChangePage = {onChangePage} />
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
