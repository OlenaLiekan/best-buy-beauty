import React from 'react';
import { Link } from 'react-router-dom';

import successImg from "../assets/img/success/001.png";
import { scrollTop } from '../js/script';

const SuccessPage = () => {

    const orderId = localStorage.getItem('orderId');

    if (!orderId) {
        console.log(orderId);
    }

    return (
        <div className="main__success success-main">
            <div className="success-main__container">
                <div className="success-main__content">
                    <h2 className="success-main__title">
                        Seu pedido {orderId ? '№' + orderId : ''} foi feito com sucesso.
                    </h2>
                    <div className="success-main__body body-success">
                        <div className="body-success__image">
                            <img src={successImg} alt="success"/>
                        </div>
                        
                        <p className="body-success__text">
                            Em breve entraremos em contato para esclarecer os detalhes.
                        </p>
                        <p className="body-success__text body-success__text_gold">
                            Obrigado por sua compra!
                        </p>
                        <Link to="/" onClick={scrollTop} className="body-success__button go-shopping scroll-top">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                <path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z" />
                            </svg>
                            Voltar à página inicial
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;