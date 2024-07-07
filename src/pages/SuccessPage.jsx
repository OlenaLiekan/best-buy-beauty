import React from 'react';
import { Link } from 'react-router-dom';

import { scrollTop } from '../js/script';
import { AuthContext } from '../context';

import axios from 'axios';

const SuccessPage = () => {

    const { serverDomain, adminMode } = React.useContext(AuthContext);
    const [paymentDetails, setPaymentDetails] = React.useState([]);
    const [mbWayPayments, setMbWayPayments] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [detailsVisibility, setDetailsVisibility] = React.useState(false);

    const data = localStorage.getItem('user') ? localStorage.getItem('user') : '';
    const user = data ? JSON.parse(data) : '';

    const orderId = localStorage.getItem('orderId');
    const orderDate = localStorage.getItem('orderDate');
    const orderTotal = localStorage.getItem('orderTotal');
    const clientName = localStorage.getItem('clientName');
    const clientLastName = localStorage.getItem('clientSurname');
    const clientCompany = localStorage.getItem('clientCompany');
    const clientAddress = localStorage.getItem('clientAddress');
    const clientPhone = localStorage.getItem('clientPhone');
    const clientEmail = localStorage.getItem('clientEmail');
    const clientComment = localStorage.getItem('clientComment') ? localStorage.getItem('clientComment') : 'Sem comentários';
    const totalCount = localStorage.getItem('totalCount');
    const deliveryPrice = localStorage.getItem('deliveryPrice');
    const clientOrder = localStorage.getItem('clientOrder');
    const items = JSON.parse(clientOrder);

    React.useEffect(() => {
        setIsLoading(true);
        axios.get(`${serverDomain}api/payment`)
            .then((res) => {
                setPaymentDetails(res.data);
                setMbWayPayments(res.data.filter((payment) => payment.type === 'MBway').filter((mbw) => mbw.available));
                setIsLoading(false);
            });
    }, [serverDomain]);      

    const scrollToContacts = () => {
        window.scrollTo(0, document.body.scrollHeight);
    }

    const toggleDetails = () => {
        if (detailsVisibility) {
            setDetailsVisibility(false);
        } else {
            setDetailsVisibility(true);
        }
    }

    return (
        <div className="main__success success-main">
            <div className="success-main__container">
                <div className="success-main__content">
                    {orderId
                        ? 
                        <>
                            <h2 className="success-main__title">
                                Olá{clientName ? ', ' + clientName : ''}!
                            </h2>
                            <div className="success-main__body body-success">
                                <p className="body-success__text body-success__text_gold">
                                    Obrigado pela sua compra!
                                </p>                        
                                <p className="body-success__text">
                                    Começaremos a preparar o seu pedido logo que recebermos a confirmação do pagamento.
                                </p>
                                <p className="body-success__text">
                                    Estes são os dados de que precisa para concluir a compra num multibanco ou online.
                                </p>
                                <p className="body-success__text bottom-line">
                                    Método de pagamento na sua escolha:
                                </p>
                                <div className='body-success__block bottom-line'>
                                    <div className='body-success__line'>
                                        <div>IBAN</div>
                                        <div>{paymentDetails.length && !isLoading ? paymentDetails[0].account : 'Carregando...'}</div>
                                    </div>
                                    <div className='body-success__line'>
                                        <div>Nome</div>
                                        <div>{paymentDetails.length && !isLoading ? paymentDetails[0].recipient : 'Carregando...'}</div>
                                    </div>      
                                    {mbWayPayments.length ? mbWayPayments.map((payment, i) => 
                                        <div key={i} className='body-success__line'>
                                        <div>MBway</div>
                                            <div>{payment.account}</div>
                                    </div>  
                                    ) : ''}
                                </div>
                                <p className="body-success__text">
                                    Tenha presente que terá de realizar o pagamento no máximo <span className='bold'>de 3 dias</span> corridos.
                                </p>
                                <p className="body-success__text">
                                    Após o pagamento deverá enviar um <span className='bold'>comprovativo de pagamento</span> em resposta a esta carta ou para o email <span className='bold' onClick={scrollToContacts}>bestbuybeauty.pt@gmail.com</span> indicando o número de pedido.
                                </p>
                                <p className="body-success__text">
                                    Data de entrega estimada 1 dia útil. Após recebermos o pagamento da compra.   
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
                                            Envio para o domicílio
                                        </div>
                                    </div>
                                    <p className='body-success__address'>
                                        {clientCompany}
                                    </p>
                                    <p className='body-success__address'>
                                        {clientName + ' ' + clientLastName}
                                    </p>
                                    <p className='body-success__address'>
                                        {clientAddress}
                                    </p>
                                    <p className='body-success__address'>
                                        Tel.{' ' + clientPhone}
                                    </p>
                                    <p className='body-success__address'>
                                        {clientEmail}
                                    </p>
                                    <p className='body-success__address bottom-line'>
                                        Um comentário: {clientComment}
                                    </p>
                                    <div className='body-success__line'>
                                        <div>
                                            Quantidade total
                                        </div>
                                        <div>
                                            {totalCount}
                                        </div>                                           
                                    </div>   
                                    <div onClick={toggleDetails} className='body-success__line body-success__line_cursor'>
                                        <div>
                                            {detailsVisibility ? 'Menos detalhes' : 'Mais detalhes'}
                                        </div>
                                        <svg className={detailsVisibility ? 'rotate' : ''} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                            <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                                        </svg>                                            
                                    </div>   
                                    {items.map((item, i) =>
                                        <div className={detailsVisibility ? 'body-success__items' : 'body-success__items_hidden'} key={i}>
                                            <p className='bold'>{i + 1}. {item.name}</p>
                                            <p>Marca: {item.company}</p>
                                            <p>Código: {item.code}</p>
                                            {item.curlArr
                                                ?
                                                <p>Curvatura: {item.curlArr}</p>
                                                :
                                                ''
                                            }
                                            {item.thicknessArr
                                                ?
                                                <p>Grossura:  {item.thicknessArr} mm</p>
                                                :
                                                ''
                                                }
                                            {item.lengthArr
                                                ?
                                                <p>Tamanho: {item.lengthArr} mm</p>
                                                :
                                                ''
                                            }
                                            {item.info && !item.isLashes
                                                ?
                                                item.info.map((p, i) => 
                                                    <p key={i}>{p.title}: {p.description}</p>
                                                )
                                                :''
                                            }
                                            <p>Preço: {item.price} €</p>
                                            <p>Quantidade: {item.count}</p>
                                        </div>
                                    )}
                                    <div className='body-success__line'>
                                        <div>
                                            Custo de entrega
                                        </div>
                                        <div>
                                            {deliveryPrice} €
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
                                {user && !adminMode
                                    ?
                                    <Link to='/auth' className='body-success__button checkout'>Ver a minha compra</Link>
                                    :
                                    <Link to="/" onClick={scrollTop} className="body-success__button go-shopping scroll-top">
                                        Voltar à página inicial
                                    </Link>
                                }
                            </div>
                        </>
                        :
                        <>
                            <div className="success-main__body body-success">
                                <p className="body-success__text">
                                    Esta página exibe informações para pagamento do pedido.   
                                </p>
                                <p className="body-success__text">
                                    Você ainda não tem um pedido. 
                                </p>
                                <svg className='body-success__svg' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                    <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z" />
                                </svg>
                                <Link to="/" onClick={scrollTop} className="body-success__button go-shopping scroll-top">
                                    Voltar à página inicial
                                </Link>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;