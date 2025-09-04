import React from 'react';
import styles from './RelatedProductsBlock.module.scss';

const RelatedProductsBlock = ({ productId }) => {

    const [relatedProducts, setRelatedProducts] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    return (
        <div className={styles.relatedProductsWrapper}>

        </div>
    );
};
 
export default RelatedProductsBlock;

