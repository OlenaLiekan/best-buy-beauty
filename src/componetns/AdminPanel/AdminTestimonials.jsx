import React from 'react';
import axios from 'axios';
import styles from './AdminPanel.module.scss';
import { AuthContext } from '../../context';
import { createReply, updateReply } from '../../http/productAPI';

const AdminTestimonials = () => {

    const [replyMode, setReplyMode] = React.useState(false);
    const [replyEditMode, setReplyEditMode] = React.useState(false);
    const [activeReview, setActiveReview] = React.useState('');
    const [activeReply, setActiveReply] = React.useState('');
    const [reviews, setReviews] = React.useState([]);
    const [replies, setReplies] = React.useState([]);
    const [ratings, setRatings] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [reviewsLoading, setReviewsLoading] = React.useState(false);
    const [ratingsLoading, setRatingsLoading] = React.useState(false);    
    const [repliesLoading, setRepliesLoading] = React.useState(false); 
    const [loading, setLoading] = React.useState(false);
    const [replyText, setReplyText] = React.useState('');
    const [newReplyText, setNewReplyText] = React.useState('');
    
    const { serverDomain } = React.useContext(AuthContext);

    React.useEffect(() => {
        setLoading(true);
        axios.get(`${serverDomain}api/product?limit=1000`)
            .then((res) => {             
                setProducts(res.data.rows);
                setLoading(false);
            }); 
    }, [serverDomain]);

    React.useEffect(() => {
        setReviewsLoading(true);
        axios.get(`${serverDomain}api/review`)
            .then((res) => {
                const testimonials = (res.data).reverse().slice(0, 10);                
                setReviews(testimonials);  
                setReviewsLoading(false);
            }); 
    }, [serverDomain]);

    React.useEffect(() => {
        setRepliesLoading(true);
        axios.get(`${serverDomain}api/reply`)
            .then((res) => {            
                setReplies(res.data);  
                setRepliesLoading(false);
            }); 
    }, [serverDomain, replyEditMode]);

    React.useEffect(() => {
        setRatingsLoading(true);
        axios.get(`${serverDomain}api/rating`)
            .then((res) => {
                const lastRatings = (res.data).reverse().slice(0, 10);
                setRatings(lastRatings);
                setRatingsLoading(false);
            }); 
    }, [serverDomain]);

    const onClickIcon = (id) => {
        setActiveReview('');
        setActiveReview(id);
        setReplyMode(true);
    };

    const onClickEdit = (id, text) => {
        setActiveReply('');
        setActiveReply(id);
        setNewReplyText(''); 
        setNewReplyText(text);            
        setReplyEditMode(true);
    };

    const doNotReply = () => {
        setActiveReview('');
        setReplyMode(false);
    };

    const doNotEdit = () => {
        setActiveReply('');
        setReplyEditMode(false);
    };

    const onChangeReplyText = (value) => {
        setReplyText(value);
    };

    const onChangeNewReplyText = (value) => {
        setNewReplyText(value);
    };

    const errorMessage = () => {
        if (replyMode) {
            window.alert('Falha ao salvar a resposta.');            
        } else if (replyEditMode) {
            window.alert('Falha ao atualizar a resposta.');  
        }
    };

    const success = () => {
        if (replyMode) {
            setReplyMode(false);        
            setReplyText('');
            window.alert('Resposta salva com sucesso!');            
        } else if (replyEditMode) {
            setReplyEditMode(false);        
            setNewReplyText('');
            window.alert('Resposta atualizada com sucesso!');   
        }
    };

    const addReply = (e) => {
        e.preventDefault();
        if (replyText.length > 0 && activeReview) {            
            const formData = new FormData();
            formData.append('text', replyText);
            formData.append('reviewId', activeReview);                    
            createReply(formData).then(data => success()).catch(e => errorMessage());
        }
    };

    const editReply = (e) => {
        e.preventDefault();
        if (newReplyText.length > 0 && activeReply) {
            const formData = new FormData();
            const id = activeReply;
            formData.append('text', newReplyText);
            updateReply(formData, id).then(data => success()).catch(err => errorMessage());
        }
    };
    
    return (
        <div className={styles.testimonialsBlock}>
            <h4>Avaliações de clientes</h4>
            <div>
                <ul className={styles.testimonialsList}>
                    {reviews.length > 0 && reviews.map((testimonial) =>
                        <li key={testimonial.id} className={styles.testimonialsItem}>
                            <div className={styles.testimonialsComment}>
                                <div className={styles.testimonialsTop}>
                                    <div className={styles.testimonialsDate}>
                                        {(testimonial.createdAt).replace('T',' ').slice(0, 19)}
                                    </div>                                   
                                    <div className={styles.testimonialsTopLine}>
                                        <div className={styles.testimonialsRating}>
                                            <svg className={styles.testimonialsRatingStar} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                                <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                                            </svg>
                                            <div>
                                                {ratings.length > 0
                                                    &&
                                                    ratings.find(
                                                        (rating) =>
                                                        (rating.userId === testimonial.userId
                                                            &&
                                                            rating.productId === testimonial.productId))?.name
                                                }
                                            </div>
                                        </div>                                    
                                        <div className={styles.testimonialsName}>
                                            {ratings.length > 0
                                                    &&
                                                    ratings.find(
                                                        (rating) =>
                                                        (rating.userId === testimonial.userId))?.userName
                                            }
                                        </div>
                                    </div>                                
                                    <div className={styles.testimonialsTopLine}>
                                        <div className={styles.testimonialsProduct}>
                                            {products.length > 0 && products.find((product) => (product.id === testimonial.productId))?.name}                                        
                                        </div>
                                    </div>                                    
                                </div>
                                <div className={styles.testimonialsText}>
                                    {testimonial.text}
                                </div>                                
                            </div>

                            {replies.length > 0 && replies.find((ans) => ans.reviewId === testimonial.id) ?
                                                            
                                (replyEditMode && activeReply === (replies.find((ans) => (ans.reviewId === testimonial.id))?.id)
                                    ?
                                    <form onSubmit={editReply} className={styles.responseBlock}>
                                        <textarea
                                            className={styles.responseTextarea}
                                            rows="8"
                                            maxLength={200}
                                            placeholder='Escreva sua resposta aqui'
                                            value={newReplyText}
                                            onChange={(e) => onChangeNewReplyText(e.target.value)}
                                        />
                                        <div className={styles.responseActions}>
                                            <button className={styles.responseCancelBtn} onClick={doNotEdit} type='button'>
                                                Cancelar
                                            </button>
                                            <button
                                                disabled={newReplyText.length > 0 ? false : true}
                                                className={newReplyText.length > 0 ? styles.responseReplyBtn : styles.responseReplyBtnOff}
                                                type='submit'
                                            >
                                                Atualizar
                                            </button>                                            
                                        </div>
                                    </form> 
                                    :
                                    <div className={styles.testimonialsAnswer}>
                                        <div className={styles.testimonialsReplyTop}>
                                            <div className={styles.testimonialsReplyDate}>
                                                {replies.length > 0
                                                    &&
                                                    replies.find(
                                                        (ans) => (ans.reviewId === testimonial.id)
                                                    )?.createdAt.replace('T', ' ').slice(0, 19)
                                                }
                                            </div>   
                                            <div className={styles.testimonialsReplyName}>
                                                Administrador
                                            </div>
                                            <div onClick={
                                                () => onClickEdit(replies.length > 0
                                                    &&
                                                    replies.find((ans) => (ans.reviewId === testimonial.id))?.id,
                                                    replies.find((ans) => (ans.reviewId === testimonial.id))?.text
                                                )
                                                }
                                                className={styles.editReplyLine}>
                                                <svg className={styles.editReplyIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z" />
                                                </svg>
                                                <div className={styles.editReplyText}>Editar</div>
                                            </div>
                                        </div>
                                        
                                        <div className={styles.testimonialsReplyText}>
                                            {replies.length > 0 && replies.find((ans) => (ans.reviewId === testimonial.id))?.text}                                         
                                        </div>
                                    </div>
                                )

                                :  
                                    (replyMode && testimonial.id === activeReview
                                    ?
                                    <form onSubmit={addReply} className={styles.responseBlock}>

                                    <textarea
                                        className={styles.responseTextarea}
                                        rows="8"
                                        maxLength={200}
                                        placeholder='Escreva sua resposta aqui'
                                        value={replyText}
                                        onChange={(e) => onChangeReplyText(e.target.value)}
                                    />
                                    <div className={styles.responseActions}>
                                        <button className={styles.responseCancelBtn} onClick={doNotReply} type='button'>
                                            Cancelar
                                        </button>
                                        <button
                                            disabled={replyText.length > 0 ? false : true}
                                            className={replyText.length > 0 ? styles.responseReplyBtn : styles.responseReplyBtnOff}
                                            type='submit'
                                        >
                                            Responder
                                        </button>                                            
                                    </div>
                                    </form>
                                    :
                                    <svg className={styles.responseIcon} onClick={() => onClickIcon(testimonial.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M8.309 189.836L184.313 37.851C199.719 24.546 224 35.347 224 56.015v80.053c160.629 1.839 288 34.032 288 186.258 0 61.441-39.581 122.309-83.333 154.132-13.653 9.931-33.111-2.533-28.077-18.631 45.344-145.012-21.507-183.51-176.59-185.742V360c0 20.7-24.3 31.453-39.687 18.164l-176.004-152c-11.071-9.562-11.086-26.753 0-36.328z" />
                                    </svg>
                                )
                            }
                        </li>
                    )}
                    
                </ul>
            </div>
        </div>
    );
};

export default AdminTestimonials;