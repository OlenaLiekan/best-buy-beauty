import React from 'react';

import styles from "./NewReview.module.scss";
import { createRating, createReview, updateProduct } from '../../../../http/productAPI';

const NewReview = ({ userId, userName, productId, rating }) => {

    const textareaRef = React.useRef();

    const [reviewText, setReviewText] = React.useState('');
    const rates = ['1', '2', '3', '4', '5'];
    const [currentRate, setCurrentRate] = React.useState(0);
    const [hideWindow, setHideWindow] = React.useState(false);

    const onChangeText = (e) => {
        setReviewText(e.target.value);
    }
    
    const success = () => {
        window.alert('Thank you for your review!');
        setCurrentRate(0);
        setReviewText('');
        rating = +rating;
        const newRating = rating === 0 ? rating + currentRate : (rating + currentRate) / 2; 
        console.log((rating + currentRate) / 2);
        const formData = new FormData();
        formData.set('rating', newRating.toFixed(1));
        updateProduct(formData, productId).then();
        setHideWindow(true);
    }
    
    const addReview = (e) => {
        e.preventDefault();
        if (currentRate) {
            const formData = new FormData();
            const reviewData = new FormData();
            formData.append('name', currentRate);
            formData.append('userId', userId);
            formData.append('userName', userName);
            formData.append('productId', productId);
            reviewData.append('userId', userId);
            reviewData.append('productId', productId);
            reviewData.append('text', reviewText ? reviewText : 'Sem comentários.');
            createReview(reviewData);
            createRating(formData).then(data => success());
        }
    }

    return (
        !hideWindow ?
        <div className={styles.newReview}>
            <div className={styles.body}>
                <h2 className={styles.title}>
                    Quantas estrelas de 1 a 5 você avalia o produto?
                </h2>
                <form onSubmit={addReview} className={styles.form}>
                    <div className={styles.rating}>
                    {
                        rates.map((rate) =>   
                            <div key={rate} onClick={() => setCurrentRate(+rate)} className={styles.itemRate}>
                                <svg className={currentRate === +rate || currentRate > +rate ? styles.currentStar : styles.star} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                    <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                                </svg>                        
                                <span className={styles.number}>{rate}</span>     
                            </div>                              
                        )
                    }
                    <span className={styles.currentRate}>{currentRate}</span>                         
                    </div>
                    <textarea
                        className={styles.textarea}
                        name="text"
                        rows="8"
                        maxLength="200"
                        placeholder='Escreva suas impressões sobre o produto.'
                        ref={textareaRef}
                        value={reviewText}
                        onChange={onChangeText}
                    />
                    <button className={styles.btn}>Deixar feedback</button>
                </form>
            </div>
        </div> : ''
    );
};

export default NewReview;