import React from 'react';

const Faq = () => {
    const [activeIndex, setActiveIndex] = React.useState('');
    const labels = [
        'Seus produtos são de boa qualidade?',
        'Como posso fazer um pedido?',
        'Fiz um pedido, o que vem a seguir?',
        'Como fazer um pagamento?'
    ];
    const answers = [
        '- Vendemos produtos que nós mesmos testamos no trabalho e podemos aconselhar nossos clientes. Assim, você pode ter certeza da qualidade.',
        '- Selecione os itens que você gosta e adicione ao carrinho. Faça um pedido pelo carrinho e preencha os dados para feedback.',
        '- Nosso especialista entrará em contato com você para esclarecer o endereço de entrega e fornecer detalhes de pagamento.',
        '- Nosso especialista entrará em contato com você para fornecer os detalhes de pagamento.'
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