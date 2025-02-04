import React from 'react';
import styles from './DeliveryConditions.module.scss';
import { AuthContext } from '../../../../context';
import { bodyUnlock } from '../../../../js/script';
import axios from 'axios';
import Loader from '../../../../componetns/UI/Loader.jsx';

const DeliveryConditions = ({deliveryPrices}) => {

    const { setShowConditions, serverDomain } = React.useContext(AuthContext);

    const [oneProduct, setOneProduct] = React.useState('');
    const [moreProducts, setMoreProducts] = React.useState('');
    const [oneProductAz, setOneProductAz] = React.useState('');
    const [moreProductsAz, setMoreProductsAz] = React.useState('');
    const [freePtDelivery, setFreePtDelivery] = React.useState('');
    const [freeAzDelivery, setFreeAzDelivery] = React.useState('');
    const [spain, setSpain] = React.useState('');
    const [otherCountry, setOtherCountry] = React.useState('');
    
    const closeConditions = () => {
        setShowConditions(false);
        bodyUnlock();
    };

    React.useEffect(() => {
        setOneProduct(deliveryPrices.find((delivery) => delivery.type === "Um produto"));
        setMoreProducts(deliveryPrices.find((delivery) => delivery.type === "Mais produtos"));
        setOneProductAz(deliveryPrices.find((delivery) => delivery.type === "Um produto (Açores)"));
        setMoreProductsAz(deliveryPrices.find((delivery) => delivery.type === "Mais produtos (Açores)"));
        setFreePtDelivery(deliveryPrices.find((delivery) => delivery.type === "Entrega grátis"));
        setOtherCountry(deliveryPrices.find((delivery) => delivery.type === "Outro país"));
        setSpain(deliveryPrices.find((delivery) => delivery.type === "Espanha"));
        setFreeAzDelivery(deliveryPrices.find((delivery) => delivery.type === "Entrega grátis (Açores)"));
    }, [serverDomain, deliveryPrices]);

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.body}>
                    <svg onClick={closeConditions} className={styles.closeIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.2 0-44.5l-22.2-22.2c-12.3-12.3-32.2-12.3-44.5 0L176 189.3 75.9 89.2c-12.3-12.3-32.2-12.3-44.5 0L9.2 111.5c-12.3 12.3-12.3 32.2 0 44.5L109.3 256 9.2 356.1c-12.3 12.3-12.3 32.2 0 44.5l22.2 22.2c12.3 12.3 32.2 12.3 44.5 0L176 322.7l100.1 100.1c12.3 12.3 32.2 12.3 44.5 0l22.2-22.2c12.3-12.3 12.3-32.2 0-44.5L242.7 256z"/></svg>
                    {
                        oneProduct && oneProductAz && freeAzDelivery && freePtDelivery && moreProducts && moreProductsAz && otherCountry
                            ?
                            <div className={styles.content}>
                                <h3 className={styles.titleH3}>Política de Envio</h3>
                                <p className={styles.paragraph}>Garantimos o envio no mesmo dia útil se o pedido for finalizado até às 16:00.</p>
                                
                                <h4 className={styles.titleH4}>Portugal Continental</h4>
                                <ul className={styles.list}>
                                    <li>Serviço de envio: CTT Expresso</li>
                                    <li>Encomendas com valor superior a {freePtDelivery.requiredSum} € têm portes gratuitos.</li>
                                    <li>Para encomendas inferiores a {freePtDelivery.requiredSum} €, o custo de envio varia entre {moreProducts.price} € e {oneProduct.price} €, dependendo da quantidade de itens.</li>
                                    <li>Prazo de entrega: 1 a 2 dias úteis.</li>
                                    <li>Envio à cobrança: Não realizamos.</li>
                                </ul>
                
                                <h4 className={styles.titleH4}>Açores e Madeira (Ilhas de Portugal)</h4>
                                <ul className={styles.list}>
                                    <li>Encomendas com valor superior a {freeAzDelivery.requiredSum} € beneficiam de envio gratuito.</li>
                                    <li>Para encomendas inferiores a {freeAzDelivery.requiredSum} €, o custo de envio varia entre {moreProductsAz.price} € e {oneProductAz.price} €, dependendo da quantidade de itens.</li>
                                    <li>Prazo de entrega: 3 a 5 dias úteis.</li>
                                    <li>Envio à cobrança: Não realizamos.</li>
                                </ul>
                                
                                <h4 className={styles.titleH4}>Espanha</h4>	
                                <ul className={styles.list}>
                                    <li>Custo de envio: {spain.price} €.</li>
                                    <li>Prazo de entrega: de 2 a 5 dias úteis.</li>
                                </ul>
                
                                <h3 className={styles.titleH3}>Política de Envio Internacional</h3> 

                                <h4 className={styles.titleH4}>Custos</h4>
                                <ul className={styles.list}>
                                    <li>Valores a partir de {otherCountry.price} €.</li>
                                    <li>Os preços de envio são calculados automaticamente pelo site, com base no peso e no destino da encomenda.</li>
                                </ul>
                                    
                                <h4 className={styles.titleH4}>Serviço e Prazos</h4>
                                <ul className={styles.list}>
                                    <li>Serviço de envio: CTT.</li>
                                    <li>Prazo estimado de entrega: de 3 a 7 dias úteis.</li>
                                    <li>Os prazos fornecidos pelos CTT são apenas indicativos e não possuem caráter vinculativo.</li>
                                </ul>
                                    
                                <h4 className={styles.titleH4}>
                                    Condições  
                                </h4>	
                                <ul className={styles.list}>
                                    <li>Envio à cobrança: Não realizamos.</li>
                                    <li>Todas as encomendas são cuidadosamente embaladas para expedição. Em caso de danos na embalagem, entre em contacto conosco imediatamente para que possamos ajudá-lo a resolver o problema.</li>
                                    <li>O destinatário é responsável por todos os custos e processos relacionados ao desalfandegamento, redirecionamento, levantamento, devolução ou reenvio da encomenda.</li>
                                    <li>Após o envio, os custos de transporte não são reembolsáveis.</li>
                                </ul>

                                <h3 className={styles.titleH3}>Responsabilidade</h3>
                                <p className={styles.paragraph}>A BEST BUY BEAUTY não se responsabiliza por atrasos ou incumprimentos nos prazos de entrega estabelecidos pelos CTT.</p>
                            </div>
                            :
                            <Loader/>
                    }

                </div>
            </div>
        </>
    );
};

export default DeliveryConditions;