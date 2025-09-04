import React from 'react';
import styles from './RelatedProductsBlock.module.scss';
import RelatedProduct from '../RelatedProduct';

const RelatedProductsBlock = ({ related }) => {

    return (
        <div className={styles.relatedProductsWrapper}>
            <ul className={styles.relatedProducts}>
                {
                    related.length > 0 
                    &&
                    related.map((item) => 
                        <li key={item.id}>
                            <RelatedProduct {...item} />   
                        </li>
                    )
                }
            </ul>
        </div>
    );
};
 
export default RelatedProductsBlock;

