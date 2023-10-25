import React from 'react';
import { Link } from 'react-router-dom';

import successImg from "../assets/img/success/001.png";
import { scrollTop } from '../js/script';

const SuccessPage = () => {

    const data = localStorage.getItem('user') ? localStorage.getItem('user') : '';
    const user = data ? JSON.parse(data) : '';

    const orderId = localStorage.getItem('orderId');

    const scrollToContacts = () => {
        window.scrollTo(0, document.body.scrollHeight);
    }

    return (
        <div className="main__success success-main">
            <div className="success-main__container">
                <div className="success-main__content">
                    <h2 className="success-main__title">
                        Confirmação de compra
                    </h2>
                    <div className="success-main__body body-success">
                        <p className="body-success__text body-success__text_gold">
                            Obrigado pela sua compra!
                        </p>                        
                        <p className="body-success__text">
                            Estes são os dados de que precisa para realizar o pagamento.
                        </p>
                        <p className="body-success__text bottom-line">
                            Você pode obter conselhos sobre pagamento entrando em contato conosco usando
                            <span className='bold link' onClick={scrollToContacts}> os contatos </span>
                            para feedback.
                        </p>
                        <div className='body-success__block bottom-line'>
                            <div className='body-success__line'>
                                <div>IBAN</div>
                                <div>PT50003501070000793883090</div>
                            </div>
                            <div className='body-success__line'>
                                <div>Nome</div>
                                <div>Svitlana Yefanova</div>
                            </div>                            
                        </div>
                        <p className="body-success__text">
                            Tenha presente que o prazo para realizar o pagamento ê de <span className='bold'>3 dias úteis.</span>
                        </p>
                        <h4 className="success-main__subtitle bottom-line">
                            Dados do pedido
                        </h4>
                        <div className='body-success__block bottom-line'>
                            <div className='body-success__line'>
                                <div>
                                    № de pedido
                                </div>
                                <div>
                                    {orderId}
                                </div>
                            </div>
                            <div className='body-success__line'>
                                <div>
                                    Data do pedido
                                </div>
                                <div>
                                    15/10/2023
                                </div>
                            </div>
                            <div className='body-success__line'>
                                <div>
                                    Valor total
                                </div>
                                <div>
                                    125,91 €
                                </div>
                            </div>                            
                        </div>
                        {user
                            ?
                            <Link to='/auth' className='body-success__button checkout'>Ver a minha compra</Link>
                            :
                            <Link to="/" onClick={scrollTop} className="body-success__button go-shopping scroll-top">
                                Voltar à página inicial
                            </Link>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;