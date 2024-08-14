import React from 'react';
import { Link } from 'react-router-dom';

const DisputeResolution = () => {

    return (
        <div className="main__dispute dispute-main">
            <div className="dispute-main__container">
                <div className="dispute-main__content">
                    <h2 className="dispute-main__title">
                        Resolução Alternativa de Litígios e respetivos
                        links de acesso aos Centros de Arbitragem:
                    </h2>
                    <ul className='dispute-main__items'>
                        <li className='dispute-main__item'>
                            <Link to="https://ec.europa.eu/consumers/odr/main/?event=main.home2.show&lng=PT" className='dispute-main__link'>
                                Resolução de Litígios em Linha | Comissão Europeia (europa.eu)
                            </Link>
                        </li>
                        <li className='dispute-main__item'>
                            <Link to="https://www.consumidor.gov.pt/parceiros/sistema-de-defesa-do-consumidor/entidades-de-resolucao-alternativa-de-litigios-de-consumo.aspx" className='dispute-main__link'>
                                Entidades de Resolução Alternativa de Litígios de Consumo (consumidor.gov.pt)
                            </Link>
                        </li>
                        <li className='dispute-main__item'>
                            <Link to="https://www.cniacc.pt/pt/" className='dispute-main__link'>
                                CNIACC - Centro Nacional de Informação e Arbitragem de Conflitos de Consumo (cniacc.pt)
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default DisputeResolution;