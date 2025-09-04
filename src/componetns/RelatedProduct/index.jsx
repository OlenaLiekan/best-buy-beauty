import React from 'react';

import axios from 'axios';
import { AuthContext } from '../../context'; 
import ProductBlock from '../ProductBlock';
import Skeleton from '../UI/Skeletons/Skeleton';
import style from './RelatedProduct.module.scss';

const RelatedProduct = ({ referenceCode, id }) => {
    
    const [relatedProduct, setRelatedProduct] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true);
    const { serverDomain } = React.useContext(AuthContext);
    const path = 'produtos';
    
    React.useEffect(() => {
        setIsLoading(true);
        axios.get(`${serverDomain}api/product?limit=1000`)
        .then((res) => {
            setRelatedProduct(res.data.rows.find(
                (item) => String(item.code) === String(referenceCode)
            )); 
        });
        setIsLoading(false);

    }, [serverDomain, referenceCode, id]);

    return (
        <div className={style.relatedProduct}>
            {relatedProduct && !isLoading
                ?
                <ProductBlock path={`/${path}/${relatedProduct.id}`} {...relatedProduct} />
                :
                <Skeleton />}
        </div>
    );
};

export default RelatedProduct;