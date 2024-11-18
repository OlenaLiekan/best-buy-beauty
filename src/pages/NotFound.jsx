import React from 'react';
import { Link } from 'react-router-dom';

import { scrollTop } from '../js/script';
import notFoundImg from "../assets/img/03.png";

const NotFound = () => { 
    return (
        <div className="main__not-found not-found">
            <div className="not-found__container">
                <div className="not-found__content">
                    <div className="not-found__image">
                        <img src={notFoundImg} alt="not found"/>
                    </div>
                    <div className="not-found__body">
                        <h1 className="not-found__title">
                            Desculpe, página não encontrada.
                        </h1>
                        <div className="not-found__link">
                            <Link to='/' onClick={scrollTop} className="not-found__link-back scroll-top">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/></svg>
                                Voltar para a página principal
                            </Link>                     
                        </div>
                    </div>    
                </div>
            </div> 
        </div>
    );
};

export default NotFound;