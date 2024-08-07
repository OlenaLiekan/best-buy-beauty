import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {

    return (
        <div className="main__privacy privacy-main">
            <div className="privacy-main__container">
                <div className="privacy-main__content">
                    <h2 className="privacy-main__title">
                        Política de Privacidade da Best Buy Beauty
                    </h2>
                    <div className="privacy-main__text">
                        <p>
                            Bem-vindo à Best Buy Beauty. Esta Política de
                            Privacidade descreve como coletamos, usamos,
                            divulgamos e protegemos as suas informações pessoais
                            ao visitar o nosso site <Link to="https://best-buy-beauty.com/" className="privacy-main__link">
                                best-buy-beauty.com
                            </Link>.
                        </p>
                    </div>
                    <ul className="privacy-main__items">
                        <li className="privacy-main__item item-privacy">
                            <h3 className="item-privacy__title">
                                1. Informações que Coletamos
                            </h3>
                            <h4 className="item-privacy__subtitle">
                                1.1 Informações Pessoais
                            </h4>  
                            <div className="item-privacy__text">
                                <p>
                                    Coletamos informações pessoais que você nos fornece
                                    diretamente, tais como:
                                </p>                             
                            </div>
                            <ul className="item-privacy__list">
                                <li className="item-privacy__point">
                                    Nome
                                </li>
                                <li className="item-privacy__point">
                                    Endereço de e-mail
                                </li>
                                <li className="item-privacy__point">
                                    Endereço de entrega
                                </li>
                                <li className="item-privacy__point">
                                    Número de telefone
                                </li>
                                <li className="item-privacy__point">
                                    Informações de pagamento (ex. dados do cartão de crédito)
                                </li>
                            </ul>
                            <h4 className="item-privacy__subtitle">
                                1.2 Informações de Uso do Site
                            </h4>
                            <div className="item-privacy__text">
                                <p>
                                    Coletamos automaticamente informações sobre a sua interação
                                    com o nosso site, incluindo:
                                </p>                             
                            </div>
                            <ul className="item-privacy__list">
                                <li className="item-privacy__point">
                                    Endereço IP
                                </li>
                                <li className="item-privacy__point">
                                    Tipo de navegador
                                </li>
                                <li className="item-privacy__point">
                                    Páginas visitadas
                                </li>
                                <li className="item-privacy__point">
                                    Tempo gasto em cada página
                                </li>
                                <li className="item-privacy__point">
                                    Referenciadores de URL
                                </li>
                            </ul>
                        </li>
                        <li className="privacy-main__item item-privacy">
                            <h3 className="item-privacy__title">
                                2. Como Usamos as Suas Informações
                            </h3>
                            <div className="item-privacy__text">
                                <p>
                                    Usamos as suas informações pessoais para:
                                </p>                             
                            </div>
                            <ul className="item-privacy__list">
                                <li className="item-privacy__point">
                                    Processar e gerenciar suas compras
                                </li>
                                <li className="item-privacy__point">
                                    Enviar confirmações e atualizações de pedidos
                                </li>
                                <li className="item-privacy__point">
                                    Responder às suas perguntas e fornecer suporte ao cliente
                                </li>
                                <li className="item-privacy__point">
                                    Enviar newsletters e outras comunicações de marketing (com seu consentimento)
                                </li>
                                <li className="item-privacy__point">
                                    Melhorar e personalizar a sua experiência no nosso site
                                </li>
                                <li className="item-privacy__point">
                                    Cumprir com obrigações legais e regulamentares
                                </li>
                            </ul>
                        </li>
                        <li className="privacy-main__item item-privacy">
                            <h3 className="item-privacy__title">
                                3. Compartilhamento das Suas Informações
                            </h3>
                            <div className="item-privacy__text">
                                <p>
                                    Podemos compartilhar suas informações com:
                                </p>                             
                            </div>
                            <ul className="item-privacy__list">
                                <li className="item-privacy__point">
                                    Provedores de serviços que nos ajudam a
                                    operar o nosso site e cumprir pedidos
                                </li>
                                <li className="item-privacy__point">
                                    Autoridades legais e regulatórias quando exigido por lei
                                </li>
                                <li className="item-privacy__point">
                                    Terceiros no contexto de uma fusão, aquisição ou venda de ativos
                                </li>
                            </ul>
                        </li>
                        <li className="privacy-main__item item-privacy">
                            <h3 className="item-privacy__title">
                                4. Segurança das Informações
                            </h3>
                            <div className="item-privacy__text">
                                <p>
                                    Adotamos medidas de segurança adequadas para proteger suas
                                    informações pessoais contra acesso não autorizado, alteração,
                                    divulgação ou destruição. No entanto, nenhum sistema de
                                    segurança é infalível, e não podemos garantir a segurança
                                    absoluta das suas informações.
                                </p>                             
                            </div>
                        </li>
                        <li className="privacy-main__item item-privacy">
                            <h3 className="item-privacy__title">
                                5. Seus Direitos
                            </h3>
                            <div className="item-privacy__text">
                                <p>
                                    Você tem o direito de:
                                </p>                             
                            </div>
                            <ul className="item-privacy__list">
                                <li className="item-privacy__point">
                                    Acessar e corrigir suas informações pessoais
                                </li>
                                <li className="item-privacy__point">
                                    Solicitar a exclusão de suas informações pessoais
                                </li>
                                <li className="item-privacy__point">
                                    Optar por não receber comunicações de marketing
                                </li>
                                <li className="item-privacy__point">
                                    Solicitar a portabilidade dos dados
                                </li>
                                <li className="item-privacy__point">
                                    Retirar seu consentimento a qualquer momento
                                </li>
                            </ul>
                            <div className="item-privacy__text">
                                <p>
                                    Para exercer esses direitos, entre em contato conosco
                                    através do e-mail <Link to="mailto:bestbuybeauty.pt@gmail.com" className="item-privacy__link">
                                        bestbuybeauty.pt@gmail.com
                                    </Link>.
                                </p>                             
                            </div>
                        </li>
                        <li className="privacy-main__item item-privacy">
                            <h3 className="item-privacy__title">
                                6. Cookies
                            </h3>
                            <div className="item-privacy__text">
                                <p>
                                    Usamos cookies e tecnologias semelhantes para coletar
                                    informações sobre a sua navegação no nosso site e
                                    melhorar a sua experiência. Você pode configurar seu
                                    navegador para recusar cookies, mas isso pode afetar
                                    a funcionalidade do site.
                                </p>                             
                            </div>
                        </li>
                        <li className="privacy-main__item item-privacy">
                            <h3 className="item-privacy__title">
                                7. Alterações a Esta Política de Privacidade
                            </h3>
                            <div className="item-privacy__text">
                                <p>
                                    Podemos atualizar esta Política de Privacidade periodicamente.
                                    Publicaremos quaisquer alterações nesta página e, se as
                                    alterações forem significativas, forneceremos um aviso mais
                                    destacado.
                                </p>                             
                            </div>
                        </li>
                        <li className="privacy-main__item item-privacy">
                            <h3 className="item-privacy__title">
                                8. Contatos
                            </h3>
                            <div className="item-privacy__text">
                                <p>
                                    Se tiver dúvidas sobre esta Política de Privacidade ou
                                    sobre como tratamos suas informações pessoais, entre em
                                    contato conosco através de:
                                </p>                             
                            </div>
                            <ul className="item-privacy__list">
                                <li className="item-privacy__point">
                                    <b>E-mail:</b> <Link to="mailto:bestbuybeauty.pt@gmail.com" className="item-privacy__link">
                                        bestbuybeauty.pt@gmail.com
                                    </Link>
                                </li>
                                <li className="item-privacy__point">
                                    <b>Endereço:</b> <Link
                                        to="https://maps.app.goo.gl/qVWYQSMTuwJ1pZaE7?g_st=com.google.maps.preview.copy"
                                        className="item-privacy__link">
                                        Rua Quinta dos Arcos,
                                        Lote 22, Loja A, Armação de Pêra, 8365-186, Portugal
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicy;