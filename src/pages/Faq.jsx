import React from 'react';
import axios from 'axios';
import { AuthContext } from '../context';

const Faq = () => {
    const [activeIndex, setActiveIndex] = React.useState('');
    const { serverDomain } = React.useContext(AuthContext);
    const [freeDelivery, setFreeDelivery] = React.useState([]);

    React.useEffect(() => {
        axios.get(`${serverDomain}api/delivery`)
            .then((res) => {
                setFreeDelivery(res.data.filter((obj) => obj.id === 3)[0]);
            });
    }, [serverDomain]);

    const deliveryCondition = freeDelivery ? `(Em valores superiores a ${freeDelivery.requiredSum} €, Envio expresso Grátis)` : '';

    const labels = [
        'Quanto tempo demora chegar a encomenda?',
        'Devolução/troca pode ser feito?',
        'Métodos de pagamento?',
        'Como escolher uma cola para extensão?',
        'Pré tratamento e primer são produtos iguais?',
    ];

    const answers = [
        `— Normalmente em correio registado dependendo de CTT 1–3 dias úteis. Expresso 1 dia útil ${deliveryCondition}.`,
        '— Sim, em caso de defeito de fábrica.',
        '— MBWay, IBAN, PayPal',        
        '— Recomendo escolher cola dependente do tempo da secagem, as condições que tem no seu gabinete e a sua velocidade de trabalho. Para iniciantes aconselho escolher a cola mais lenta. Para profissionais mais rápidas. No verão a cola seca mais rápido. Inverno mais devagar. Com alta humidade cola seca mais rápido, com pouca humidade cola seca mais lento.',
        '— Não, são produtos diferentes.',
    ]; 
    
    
    return (
        <div className="main__faq faq-main">
            <div className="faq-main__container">
                <div className="faq-main__content">
                    <h2 className="faq-main__title">
                        PERGUNTAS FREQUENTES
                    </h2>
                    <div data-spollers className="faq-main__spollers spollers-faq">
                        {
                            labels.map((label, i) => (
                                <div value={label} key={label} className="spollers-faq__item">
                                    <button onClick={() => setActiveIndex(i)} type='button' data-spoller className={activeIndex === i ? "spollers-faq__title _active" : "spollers-faq__title" }>
                                        {i + 1}. {label}
                                        <svg className={activeIndex === i ? "svg-rotate" : ''} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                            <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                                        </svg>
                                    </button>
                                    <div className={activeIndex === i ? "spollers-faq__body _activeText" : "spollers-faq__body"}>
                                        {answers[i]}
                                    </div>                                        
                                </div>                            
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Faq;