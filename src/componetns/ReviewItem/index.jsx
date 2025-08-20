import React from 'react';
import styles from './ReviewItem.module.scss';
import axios from 'axios';
import { AuthContext } from '../../context';

const ReviewItem = ({ name, userId, userName, productId, createdAt }) => {

    const [productReviews, setProductReviews] = React.useState([]);
    const [reviewReplies, setReviewReplies] = React.useState([]);
    const { serverDomain } = React.useContext(AuthContext);

    React.useEffect(() => {
        if (productId) {
            axios.get(`${serverDomain}api/review?productId=${productId}`)
                .then((res) => {
                    setProductReviews(res.data);            
                }); 
        }
    }, [productId, serverDomain]);

    React.useEffect(() => {
        if (productReviews.length > 0) {
            axios.get(`${serverDomain}api/reply`)
                .then((res) => {
                    setReviewReplies(res.data);            
                });     
        }
    }, [productId, serverDomain, productReviews]);

    const productReview = productReviews ? productReviews.find((review) => userId === review.userId && productId === review.productId) : '';
    const reviewReply = reviewReplies.length > 0 ? reviewReplies.find((reply) => reply.reviewId === productReview.id) : null;
    
    return (
        <div className={styles.item}>
            <div className={styles.top}>
                <div className={styles.userName}>{userName}</div>
                <div className={styles.date}>{createdAt.replace('T', ' ').slice(0,19)}</div>
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
                {reviewReply
                    &&
                    <div className={styles.replyBlock}>
                        <div className={styles.replyDate}>
                            {reviewReply.createdAt.replace('T', ' ').slice(0, 19)}
                        </div>
                        <span className={styles.replyRole}>
                            Best Buy Beauty    
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M144 208c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm112 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm112 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zM256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z" />
                            </svg>
                        </span>
                        <div className={styles.replyText}>
                            {reviewReply.text}
                        </div>
                    </div>                    
                }
            </div>
        </div>    
    );
};

export default ReviewItem;