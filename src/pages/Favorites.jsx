import React from 'react';
import { useSelector } from 'react-redux';
import ProductBlock from '../componetns/ProductBlock';
import NotFound from './NotFound';

const Favorites = () => {

    const { favoriteItems } = useSelector((state) => state.favorite);

    const products = favoriteItems.map((item) => <div key={item.id}><ProductBlock text={item.text} info={item.info} related={item.related} {...item} /></div>);

    return (
            products.length > 0  
            ?
            <div className="main__product product-main">
                <div className="product-main__container">
                    <div className="product-main__content">
                        <div className="product-main__items">
                            {products}
                        </div>
                    </div>
                </div>
            </div>
            :
            <NotFound text={'Ainda não há favoritos.'}/>
    );

};

export default Favorites;