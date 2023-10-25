import React from 'react';
import { Link } from 'react-router-dom';

import { scrollTop } from '../js/script';
import { AuthContext } from '../context';

import axios from 'axios';

const SuccessPage = () => {

    const { serverDomain } = React.useContext(AuthContext);
    const [paymentDetails, setPaymentDetails] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const data = localStorage.getItem('user') ? localStorage.getItem('user') : '';
    const user = data ? JSON.parse(data) : '';

    const orderId = localStorage.getItem('orderId');
    const orderDate = localStorage.getItem('orderDate');
    const orderTotal = localStorage.getItem('orderTotal');

    React.useEffect(() => {
        setIsLoading(true);
        axios.get(`${serverDomain}api/payment/1`)
            .then((res) => {
                setPaymentDetails(res.data);
                setIsLoading(false);
            });
    }, [serverDomain]);      

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
                                <div>{paymentDetails && !isLoading ? paymentDetails.iban : 'Carregando...'}</div>
                            </div>
                            <div className='body-success__line'>
                                <div>Nome</div>
                                <div>{paymentDetails && !isLoading ? paymentDetails.recipient : 'Carregando...'}</div>
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
                                    {orderDate}
                                </div>
                            </div>
                            <div className='body-success__line'>
                                <div>
                                    Valor total
                                </div>
                                <div>
                                    {orderTotal} €
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