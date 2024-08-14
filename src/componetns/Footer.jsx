import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context";
import axios from "axios";

const Footer = () => {

  const { serverDomain } = React.useContext(AuthContext);
  const [logo, setLogo] = React.useState('');
  const [logoLoading, setLogoLoading] = React.useState(false);

  const footerLink = () => {
    window.scrollTo(0, 0);
  }

  const year = '2023';

  const date = new Date();
  const currentYear = date.getFullYear();

  React.useEffect(() => {
    setLogoLoading(true);
    axios.get(`${serverDomain}api/logo/1`)
    .then((res) => {
        setLogo(res.data);
        setLogoLoading(false);
    })
  }, [serverDomain]);

    return (
      <div className="footer">
        <div className="footer__container">
          <div className="footer__body body-footer">
            <div className="body-footer__contacts contacts">
              <h3 className="contacts__title">
                Contatos
              </h3>
              <ul className="contacts__items">
                <li className="contacts__item item-contacts">
                  <Link to='https://www.instagram.com/bestbuybeauty.pt/' className="item-contacts__link">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                    bestbuybeauty.pt
                  </Link>
                </li>
                <li className="contacts__item item-contacts">
                  <Link to='https://www.instagram.com/sculptorlash_pt/' className="item-contacts__link">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                    sculptorlash_pt
                  </Link>
                </li>
                <li className="contacts__item item-contacts">
                  <div className="item-contacts__link">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                    </svg>
                    +351 960 201 624
                  </div>
                </li>
                <li className="contacts__item item-contacts">
                  <Link to='mailto:bestbuybeauty.pt@gmail.com' className="item-contacts__link item-contacts__link_mail">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"/></svg>
                    bestbuybeauty.pt@gmail.com
                  </Link>
                </li>
                <li className="contacts__item item-contacts">
                  <Link to='https://maps.app.goo.gl/qVWYQSMTuwJ1pZaE7?g_st=com.google.maps.preview.copy' className="item-contacts__link item-contacts__link_location link-contacts">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M172.3 501.7C27 291 0 269.4 0 192 0 86 86 0 192 0s192 86 192 192c0 77.4-27 99-172.3 309.7-9.5 13.8-29.9 13.8-39.5 0zM192 272c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 35.8-80 80 35.8 80 80 80z"/></svg>
                    <div className="link-contacts__items">
                      <div className="link-contacts__item">Urb. Quinta dos Arcos lote 22, <span>loja A</span></div>
                      <div className="link-contacts__item">8365-186</div>
                      <div className="link-contacts__item">Armação de Pêra</div>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="body-footer__actions actions-footer">
              <ul className="actions-footer__items">
                <li className="actions-footer__item">
                  <Link to="about" onClick={footerLink} className="actions-footer__link">
                    Sobre nós                    
                  </Link>
                </li>
                <li className="actions-footer__item">
                  <Link to="payment&delivery" onClick={footerLink} className="actions-footer__link">
                    Pagamento & entrega                   
                  </Link>
                </li>
                <li className="actions-footer__item">
                  <Link to="faq" onClick={footerLink} className="actions-footer__link">
                    Perguntas frequentes                   
                  </Link>
                </li>  
                <li className="actions-footer__item">
                  <Link to="terms" onClick={footerLink} className="actions-footer__link">
                    Termos e Condições                  
                  </Link>
                </li>
                <li className="actions-footer__item">
                  <Link to="returnsPolicy" onClick={footerLink} className="actions-footer__link">
                    Política de Devolução              
                  </Link>
                </li>
                <li className="actions-footer__item">
                  <Link to="privacyPolicy" onClick={footerLink} className="actions-footer__link">
                    Política de Privacidade                
                  </Link>
                </li>
                <li className="actions-footer__item">
                  <Link to="https://www.livroreclamacoes.pt/Inicio/" className="actions-footer__link">
                    Livro de Reclamações               
                  </Link>
                </li>  
                <li className="actions-footer__item">
                  <Link to="disputeResolution" onClick={footerLink} className="actions-footer__link">
                    ENCONTRAR UMA SOLUÇÃO PARA O SEU PROBLEMA DE CONSUMO                
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom bottom-footer">
            <div className="bottom-footer__text">
              © {year === currentYear.toString() ? year : year + ' - ' + currentYear}  
            </div>
            <div className="bottom-footer__text">
              {!logoLoading && logo ? logo.logoName : ''}
            </div>
          </div>
        </div>
      </div>
    );
};

export default Footer;