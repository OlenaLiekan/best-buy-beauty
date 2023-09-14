import React from 'react';
import styles from './ReviewItem.module.scss';
import axios from 'axios';
import { AuthContext } from '../../context';

const ReviewItem = ({ name, userId, userName, productId, createdAt }) => {

    const [productReviews, setProductReviews] = React.useState([]);
    const { serverDomain } = React.useContext(AuthContext);

    React.useEffect(() => {
        if (productId) {
            axios.get(`${serverDomain}api/review?productId=${productId}`)
                .then((res) => {
                    setProductReviews(res.data);            
                }); 
        }
    }, [productId]);

    const productReview = productReviews ? productReviews.find((review) => userId === review.userId && productId === review.productId) : '';

    return (
            <div className={styles.item}>
                <div className={styles.top}>
                    <div className={styles.userName}>{userName}</div>
                    <div className={styles.date}>{createdAt.slice(0,19).replace('T', ' / ')}</div>
                </div>
                <div className={styles.body}>
                    <div className={styles.rating}>
                        <svg className={styles.ratingStar} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                            <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                        </svg>
                        <span>{name}.0</span>
                </div>
                    <p className={styles.text}>
                        {productReview ? productReview.text : ''}
                    </p>
                </div>
            </div>    
 
    );
};

export default ReviewItem;