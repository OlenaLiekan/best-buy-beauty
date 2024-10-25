import React from 'react';

import notFoundImg from "../assets/img/03.png";

const NotFoundProduct = () => { 
    return (
        <div className="not-found__content not-found__content-product">
            <div className="not-found__image">
                <img src={notFoundImg} alt="not found"/>
            </div>
            <div className="not-found__body">
                <h1 className="not-found__title">
                    Desculpe, não há dados de consulta de pesquisa.
                </h1>
                <div className="not-found__link">
                    Verifique se a entrada está correta ou faça outra solicitação.                  
                </div>
            </div>    
        </div>
    );
};

export default NotFoundProduct;