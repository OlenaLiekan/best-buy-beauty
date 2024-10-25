import React from 'react';
import { Link } from 'react-router-dom';

const ReturnsPolicy = () => {

    return (
        <div className="main__returns returns-main">
            <div className="returns-main__container">
                <div className="returns-main__content">
                    <h2 className="returns-main__title">
                        Política de Devolução
                    </h2>
                    <div className="returns-main__text">
                        <p>
                            Bem-vindo à nossa política de devolução.
                            Agradecemos a sua confiança em adquirir os nossos produtos.
                            Em conformidade com a legislação portuguesa e para garantir
                            a sua satisfação, apresentamos a nossa política de
                            devolução detalhada.                            
                        </p>
                    </div>
                    <ul className="returns-main__items">
                        <li className="returns-main__item item-returns">
                            <h3 className="item-returns__title">
                                1. Condições de Devolução
                            </h3>
                            <div className="item-returns__text">
                                <p>
                                    As devoluções de produtos adquiridos no nosso website
                                    são permitidas apenas nas seguintes condições:
                                </p>
                                <p>
                                    <b>Defeito de Fabricação:</b> Aceitamos devoluções exclusivamente
                                    para produtos que apresentem defeitos de fabrico.
                                    Não serão aceitas devoluções por outros motivos, tais
                                    como mudança de opinião, erro na escolha do produto,
                                    ou uso inadequado.
                                </p>                                
                            </div>
                        </li>
                        <li className="returns-main__item item-returns">
                            <h3 className="item-returns__title">
                                2. Procedimento de Devolução
                            </h3>
                            <div className="item-returns__text">
                                <p>
                                    Se o seu produto apresentar um defeito de fabrico, siga os
                                    passos abaixo para efetuar a devolução:
                                </p>
                                <p>
                                    <b>Contacte o Suporte ao Cliente:</b> Envie um e-mail
                                    para <Link to="mailto:bestbuybeauty.pt@gmail.com" className="returns-main__link">
                                        bestbuybeauty.pt@gmail.com
                                    </Link> com a descrição detalhada do
                                    defeito, número do pedido, e anexando fotografias que
                                    comprovem o defeito.
                                </p>   
                                <p>
                                    <b>Análise da Solicitação:</b> Após o envio do e-mail, a nossa
                                    equipa de suporte analisará a sua solicitação e, se necessário,
                                    poderá pedir informações adicionais. Este processo pode demorar
                                    até <b>5 dias</b> úteis.
                                </p>
                                <p>
                                    <b>Autorização de Devolução:</b> Se a devolução for aprovada,
                                    enviaremos um e-mail com a autorização de devolução e instruções
                                    para envio do produto defeituoso de volta às nossas instalações.
                                </p>
                                <p>
                                    <b>Envio do Produto:</b> Embale o produto de forma segura e envie-o para
                                    o endereço indicado no e-mail de autorização. Os custos de envio
                                    serão reembolsados se o defeito de fabrico for confirmado.
                                </p>
                            </div>
                        </li>
                        <li className="returns-main__item item-returns">
                            <h3 className="item-returns__title">
                                3. Condições do Produto Devolvido
                            </h3>
                            <div className="item-returns__text">
                                <p>
                                    Para que a devolução seja aceite, o produto deve ser
                                    devolvido nas seguintes condições:
                                </p>
                                <p>
                                    <b>Estado Original:</b> O produto deve estar em seu estado
                                    original, sem sinais de uso indevido, e acompanhado de
                                    todos os acessórios e embalagens originais.
                                </p> 
                                <p>
                                    <b>Comprovante de Compra:</b> É necessário incluir o comprovante
                                    de compra ou a fatura original.
                                </p>
                            </div>
                        </li>
                        <li className="returns-main__item item-returns">
                            <h3 className="item-returns__title">
                                4. Avaliação e Resolução
                            </h3>
                            <div className="item-returns__text">
                                <p>
                                    Após a receção do produto devolvido, será realizada
                                    uma avaliação técnica para confirmar o defeito de fabrico:
                                </p>
                                <p>
                                    <b>Confirmação do Defeito:</b> Se o defeito de fabrico for confirmado,
                                    procederemos à substituição do produto por outro igual ou,
                                    se preferir, ao reembolso total do valor pago, incluindo os
                                    custos de envio.
                                </p> 
                                <p>
                                    <b>Defeito Não Confirmado:</b> Se não for constatado qualquer defeito
                                    de fabrico, o produto será devolvido ao cliente, e os custos
                                    de envio não serão reembolsados.
                                </p>
                            </div>
                        </li>
                        <li className="returns-main__item item-returns">
                            <h3 className="item-returns__title">
                                5. Prazo para Devolução
                            </h3>
                            <div className="item-returns__text">
                                <p>
                                    As devoluções devem ser solicitadas num prazo máximo <b>de 14 dias </b>
                                    a partir da data de receção do produto. Solicitações fora deste
                                    prazo não serão aceites.
                                </p>
                            </div>
                        </li>
                        <li className="returns-main__item item-returns">
                            <h3 className="item-returns__title">
                                6. Contactos
                            </h3>
                            <div className="item-returns__text">
                                <p>
                                    Para qualquer questão relacionada com devoluções, por favor,
                                    contacte-nos através de:
                                </p>
                                <p>
                                    <b>E-mail:</b> <Link to="mailto:bestbuybeauty.pt@gmail.com" className="item-returns__link">
                                        bestbuybeauty.pt@gmail.com
                                    </Link><br/>
                                    <b>Telefone:</b> <Link to="tel:+351960201624" className="item-returns__link">
                                        960201624
                                    </Link><br />
                                    <b>Endereço:</b> <Link to="https://maps.app.goo.gl/qVWYQSMTuwJ1pZaE7?g_st=com.google.maps.preview.copy" className="item-returns__link">
                                        Rua Quinta dos Arcos,
                                        Lote 22, Loja A, Armação de Pêra, 8365-186, Portugal
                                    </Link>
                                </p> 
                            </div>
                        </li>
                    </ul>
                    <div className="returns-main__text">
                        <p>
                            Agradecemos pela sua compreensão e cooperação. Estamos
                            comprometidos em fornecer produtos de alta qualidade e
                            em resolver qualquer problema que possa surgir com
                            eficiência e justiça.
                        </p>
                        <p>
                            <b>Nota:</b> Esta política de devolução foi elaborada de acordo
                            com a legislação portuguesa e destina-se a fornecer clareza
                            e transparência aos nossos clientes.
                        </p>                    
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReturnsPolicy;