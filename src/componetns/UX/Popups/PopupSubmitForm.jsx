import React from 'react';
import { useNavigate } from 'react-router-dom';

import { clearItems } from '../../../redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../../http/userAPI';
import axios from 'axios';
import { AuthContext } from '../../../context';
import { sendEmail } from '../../../http/productAPI';
import { closePopup } from '../../../js/script';

const PopupSubmitForm = ({totalCount, deliveryPrice, orderNumber}) => {

    const inputRef = React.useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { serverDomain, isAuth } = React.useContext(AuthContext);
    const [username, setUsername] = React.useState('');
    const [surname, setSurname] = React.useState('');    
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [firstAddress, setFirstAddress] = React.useState('');
    const [secondAddress, setSecondAddress] = React.useState('');
    const [city, setCity] = React.useState('');
    const [region, setRegion] = React.useState('');
    const [country, setCountry] = React.useState('Portugal');
    const [postalCode, setPostalCode] = React.useState('');
    const [company, setCompany] = React.useState('');
    const [addresses, setAddresses] = React.useState([]);
    const [mainData, setMainData] = React.useState({});
    const [visibleList, setVisibleList] = React.useState(false);
    const [paymentDetails, setPaymentDetails] = React.useState([]);
    const [mbWayPayments, setMbWayPayments] = React.useState([]);
    const [payment, setPayment] = React.useState('');
    const [resetForm, setResetForm] = React.useState(false);
    const countries = ['Portugal', 'Outro'];

    const data = localStorage.getItem('user') ? localStorage.getItem('user') : '';
    const user = data ? JSON.parse(data) : '';

    React.useEffect(() => {
        if (user.id && !mainData) {
            setUsername(user.firstName);
            setSurname(user.lastName);
            setPhone(user.phone);
            setEmail(user.email);
        }
        if (user.id && mainData) {
            setUsername(mainData.firstName);
            setSurname(mainData.lastName);
            setPhone(mainData.phone);
            setEmail(mainData.email);
            setCompany(mainData.company ? mainData.company : company);
            setFirstAddress(mainData.firstAddress);
            setSecondAddress(mainData.secondAddress ? mainData.secondAddress : secondAddress);
            setCountry((mainData.country && mainData.country === country) ? mainData.country : country);
            setCity(mainData.city);
            setRegion(mainData.region);
            setPostalCode(mainData.postalCode);
        }
        if (resetForm) {
            setUsername('');
            setSurname('');
            setPhone('');
            setEmail('');
            setCompany('');
            setFirstAddress('');
            setSecondAddress('');
            setCountry('Portugal');
            setCity('');
            setRegion('');
            setPostalCode('');
        }
    }, [mainData, company, country, user.id, secondAddress, visibleList, resetForm]);

    React.useEffect(() => {
        if (user.id) {
            axios.get(`${serverDomain}api/user/${user.id}`)
                .then((res) => {
                    setAddresses(res.data.address);
                });                       
        }
    }, [isAuth, serverDomain, user.id]);

    React.useEffect(() => {
        if (addresses.length) {
            setMainData(addresses.find((address) => address.mainAddress));
        }
    }, [addresses]);

    React.useEffect(() => {
        axios.get(`${serverDomain}api/payment`)
            .then((res) => {
                setPaymentDetails(res.data);
                setMbWayPayments(res.data.filter((payment) => payment.type === 'MBway').filter((mbw) => mbw.available));
            });
    }, [serverDomain]);   

    const onChangeCompany = (event) => { 
        setCompany(event.target.value ? event.target.value[0].toUpperCase() + event.target.value.slice(1) : '');            
    };

    const onChangeUsername = (event) => { 
        setUsername(event.target.value ? event.target.value[0].toUpperCase() + event.target.value.slice(1) : '');            
    };

    const onChangeSurname = (event) => { 
        setSurname(event.target.value ? event.target.value[0].toUpperCase() + event.target.value.slice(1) : '');
    };

    const onChangePhone = (event) => { 
        setPhone(event.target.value);
    };

    const onChangeEmail = (event) => { 
        setEmail(event.target.value);
    };

    const onChangeFAddress = (event) => { 
        setFirstAddress(event.target.value);            
    };

    const onChangeSAddress = (event) => { 
        setSecondAddress(event.target.value);            
    };

    const onChangeCity = (event) => { 
        setCity(event.target.value ? event.target.value[0].toUpperCase() + event.target.value.slice(1) : '');            
    };

    const showCountries = () => {
        if (!visibleList) {
            setVisibleList(true);
        } else {
            setVisibleList(false);
        }
    }

    const closeList = (countryName) => {
        setCountry(countryName);
        setVisibleList(false);
    }

    const onChangeRegion = (event) => { 
        setRegion(event.target.value ? event.target.value[0].toUpperCase() + event.target.value.slice(1) : '');            
    };

    const onChangePostalCode = (event) => { 
        if (event.target.value.length === 4) {
            setPostalCode(event.target.value.slice(0, 4) + '-' + event.target.value.slice(5, 8));
        } else if (event.target.value.length === 5) {
            setPostalCode(event.target.value.slice(0, 4));
        } else {
            setPostalCode(event.target.value.slice(0, 8));              
        }
    };

    const { items, totalPrice } = useSelector((state) => state.cart);

    React.useEffect(() => {
        const result = paymentDetails.length && mbWayPayments
            ?
            '<b style="font-size: 110%;"><span style="padding: 0 10px 20px 0;">IBAN </span></b><br>'
            + paymentDetails[0].account
            + '<br><br><b style="font-size: 110%;"><span style="padding: 0 90px 20px 0;">Nome </span></b><br>'
            + paymentDetails[0].recipient
            + '<br><br><b style="font-size: 110%;"><span style="padding: 0 75px 20px 0;">MBway </span></b><br>'
            + mbWayPayments.map((mbp) =>
                `<span>${mbp.account} </span>`
            ) : ''
            ;
        setPayment(result);
    }, [paymentDetails, mbWayPayments]);

    const order = items.map((item, index) => (
        (index > 0 ? '<br><br>' : '') + '<b>' + (index + 1) + '. ' + item.name
        +
        '</b><br>Marca: ' + item.company
        +
        '<br>Código: ' + item.code + '<br>'
        +
        (item.curlArr ? 'Curvatura: ' + item.curlArr + '<br>' : '')
        +
        (item.thicknessArr ? 'Grossura: ' + item.thicknessArr + ' mm<br>' : '')
        +
        (item.lengthArr ? 'Tamanho: ' + item.lengthArr + ' mm<br>' : '')
        +
        (item.isLashes ? '' : item.info.map((obj) => obj.title + ': ' + obj.description + '<br>') )
        +
        'Preço: ' + item.price + ' €<br>'
        +
        'Quantidade: ' + item.count))
        +
        '<br><br><b style="font-size: 110%; padding-bottom: 20px;"><span style="padding-right: 10px;">Quantidade total: </span>' + totalCount
        +
        '</b><br><b style="font-size: 110%; padding-bottom: 20px;"><span style="padding-right: 10px;">Custo de entrega: </span>' + deliveryPrice + ' €</b>'
        +
        '<br><br><b style="font-size: 125%; color: #AD902B; padding-bottom: 20px;"><span style="padding-right: 10px;">Valor total: </span>' + (+totalPrice.toFixed(2) + Number(deliveryPrice)).toFixed(2) + ' €</b>'
        ;
    
    const success = () => {
        const date = new Date();
        const today = date.toISOString().slice(0, 10);        
        localStorage.setItem('orderId', orderNumber);
        localStorage.setItem('orderDate', today);
        localStorage.setItem('clientName', username);
        localStorage.setItem('clientSurname', surname);
        localStorage.setItem('clientPhone', phone);
        localStorage.setItem('clientOrder', JSON.stringify(items));
        localStorage.setItem('clientAddress', `${company} ${firstAddress} ${secondAddress}, ${postalCode}, ${city}, ${region}, ${country}`);
        localStorage.setItem('orderTotal', (+totalPrice.toFixed(2) + Number(deliveryPrice)).toFixed(2));
        localStorage.setItem('totalCount', totalCount);
        localStorage.setItem('deliveryPrice', (+deliveryPrice).toFixed(2));
        dispatch(
            clearItems()
        );
        navigate('/send-email');
        window.scrollTo(0, 0); 
    }

    const submitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const id = user ? user.id : 0;
        if (orderNumber && username && surname && phone && email && items && firstAddress && postalCode && city && region && country && totalPrice && totalCount && deliveryPrice) {
            setResetForm(false);
            formData.append('userId', id);
            formData.append('items', JSON.stringify(items));
            formData.append('quantity', totalCount);
            formData.append('deliveryPrice', deliveryPrice);
            formData.append('sum', (+totalPrice.toFixed(2) + Number(deliveryPrice)).toFixed(2));
            formData.append('orderNumber', orderNumber);
            formData.append('userOrder', order);
            formData.append('userName', username);
            formData.append('userSurname', surname);
            formData.append('userEmail', email);
            formData.append('userPhone', phone);
            formData.append('paymentList', payment);
            formData.append('userAddress', `${company} ${firstAddress} ${secondAddress}, ${postalCode}, ${city}, ${region}, ${country}`);
            if (id > 0) {
                updateUser(formData, id).then((data) => success());
            } else if (id === 0) {
                success();
            }
            sendEmail(formData).then(response => console.log(response)).catch(error => console.log(error));
        } else {
            window.alert('Algo deu errado, tente novamente.');
            setResetForm(true);
            closePopup();
            window.scrollTo(0, 0);
        }    
    } 

    return (
        <div className="cart__popup popup-cart">
            <div className="popup-cart__content">
                <button className="popup-cart__close">
                    Fechar
                </button>
                <div className="popup-cart__body">
                    <form onSubmit={submitForm} id="email-form" className="popup-cart__form popup-form email-form">
                        <div className="popup-form__text">
                            Por favor, deixe seus dados para fazer um pedido.
                        </div>
                        <div className="popup-form__line">
                            <label htmlFor="user-name-input" className="popup-form__label">Primeiro Nome</label>
                            <input required id="user-name-input" tabIndex="1" autoComplete="off" type="text" name="nome" data-error="Error" placeholder='Nome' className="popup-form__input _req"
                                ref={inputRef}
                                value={username}
                                onChange={onChangeUsername}/>
                        </div>
                        <div className="popup-form__line">
                            <label htmlFor="user-surname-input" className="popup-form__label">Último Nome</label>
                            <input required id="user-surname-input" tabIndex="2" autoComplete="off" type="text" name="Sobrenome" data-error="Error" placeholder="Sobrenome" className="popup-form__input"
                                ref={inputRef}
                                value={surname}
                                onChange={onChangeSurname}/>
                        </div>
                        <div className="popup-form__line">
                            <label htmlFor="user-company-input" className="popup-form__label">Empresa</label>
                            <input id="user-company-input" tabIndex="3" autoComplete="off" type="text" name="Empresa" data-error="Error" className="popup-form__input"
                                ref={inputRef}
                                value={company}
                                onChange={onChangeCompany}/>
                        </div>
                        <div className="popup-form__line">
                            <label htmlFor="user-contact-input" className="popup-form__label">Telefone</label>
                            <input required id="user-contact-input" tabIndex="4" autoComplete="off" type="tel" pattern="[+]{1}[0-9]{12}" name="Telefone" data-error="Error" placeholder="+351XXXXXXXXXX" className="popup-form__input _req"
                                ref={inputRef}
                                value={phone}
                                onChange={onChangePhone}/>
                        </div>
                        <div className="popup-form__line">
                            <label htmlFor="user-email-input" className="popup-form__label">E-mail</label>
                            <input required id="user-email-input" tabIndex="5" autoComplete="off" type="email" name="email" data-error="Error" placeholder="example@email.com" className="popup-form__input _req _email" 
                                ref={inputRef}
                                value={email}
                                onChange={onChangeEmail}/>
                        </div>
                        <div className="popup-form__line">
                            <label htmlFor="user-f-address-input" className="popup-form__label">Morada №1</label>
                            <input required id="user-f-address-input" tabIndex="6" autoComplete="off" type="text" name="Morada_1" data-error="Error" className="popup-form__input"
                                ref={inputRef}
                                value={firstAddress}
                                onChange={onChangeFAddress}/>
                        </div>
                        <div className="popup-form__line">
                            <label htmlFor="user-s-address-input" className="popup-form__label">Morada №2</label>
                            <input id="user-s-address-input" tabIndex="7" autoComplete="off" type="text" name="Morada_2" data-error="Error" className="popup-form__input"
                                ref={inputRef}
                                value={secondAddress}
                                onChange={onChangeSAddress}/>
                        </div>
                        <div className="popup-form__line">
                            <label htmlFor="user-city-input" className="popup-form__label">Cidade</label>
                            <input required id="user-city-input" tabIndex="8" autoComplete="off" type="text" name="Cidade" data-error="Error" className="popup-form__input"
                                ref={inputRef}
                                value={city}
                                onChange={onChangeCity}/>
                        </div>
                        <div className="popup-form__line popup-form__line_select">
                            <label htmlFor="user-country-input" className="popup-form__label">País</label>
                            <input readOnly required onClick={showCountries} id="user-country-input" tabIndex="9" autoComplete="off" type="text" name="País" data-error="Error" className="popup-form__input popup-form__input_select"
                                ref={inputRef}
                                value={country} />
                            <svg onClick={showCountries} className={visibleList ? 'popup-form_rotate' : ''} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                            </svg>
                            <ul className={visibleList ? 'popup-form__list' : 'popup-form__list_hidden'}>
                                {countries.map((countryName, i) => 
                                    <li onClick={() => closeList(countryName) } key={i} className={'popup-form__item'}>{countryName}</li>
                                )}
                            </ul>
                        </div>
                        <div className="popup-form__line">
                            <label htmlFor="user-region-input" className="popup-form__label">Concelho</label>
                            <input required id="user-region-input" tabIndex="10" autoComplete="off" type="text" name="Concelho" data-error="Error" className="popup-form__input"
                                ref={inputRef}
                                value={region}
                                onChange={onChangeRegion}/>
                        </div>
                        <div className="popup-form__line">
                            <label htmlFor="user-postal-code-input" className="popup-form__label">Código postal/ZIP</label>
                            <input required id="user-postal-code-input" tabIndex="11" autoComplete="off" type="text" name="Código_postal/ZIP" data-error="Error" className="popup-form__input"
                                ref={inputRef}
                                value={postalCode}
                                onChange={onChangePostalCode}/>
                        </div>
                        <div className="popup-form__line">
                            <label hidden htmlFor="order" className="popup-form__label">Ordem: </label>
                            <textarea hidden id="order" readOnly name="Ordem" value={order} className="popup-form__textarea _order"/>                            
                        </div>

                        <div className="popup-form__line popup-line__textarea">
                            <label htmlFor="user-comment" className="popup-form__label">Comente</label>
                            <textarea id="user-comment" tabIndex="12" className="popup-form__textarea" name="Comente" placeholder='Ola! Aqui você pode deixar suas dúvidas ou desejos.' cols="10" rows="5" maxLength="150"/> 
                        </div>
                        <button type="submit" tabIndex="13" className="popup-form__button checkout scroll-top">
                            Enviar
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"/></svg>
                        </button>
                    </form>                   
                </div>
            </div>
        </div>
    );
};

export default PopupSubmitForm;
