import React from 'react';
import styles from './UpdateAddress.module.scss';
import { updateUser } from '../../http/userAPI';
import { AuthContext } from '../../context';

const UpdateAddress = ({userId, addressId, addresses, existingMainAddress}) => {

    const inputRef = React.useRef();

    const { setUpdateAddressMode } = React.useContext(AuthContext);
    const [username, setUsername] = React.useState('');
    const [surname, setSurname] = React.useState('');    
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [firstAddress, setFirstAddress] = React.useState('');
    const [secondAddress, setSecondAddress] = React.useState('');
    const [city, setCity] = React.useState('');
    const [region, setRegion] = React.useState('');
    const [country, setCountry] = React.useState('');
    const [postalCode, setPostalCode] = React.useState('');
    const [company, setCompany] = React.useState('');
    const [checked, setChecked] = React.useState(false);

    if (!existingMainAddress) {
        existingMainAddress = { id: addressId };
    }

    React.useEffect(() => {
        const currentAddress = addresses.find((address) => address.id === addressId);
        if (currentAddress) {
            setUsername(currentAddress.firstName);
            setSurname(currentAddress.lastName);
            setCompany(currentAddress.company ? currentAddress.company : company);
            setPhone(currentAddress.phone);
            setEmail(currentAddress.email);
            setFirstAddress(currentAddress.firstAddress);
            setSecondAddress(currentAddress.secondAddress ? currentAddress.secondAddress : secondAddress);
            setCity(currentAddress.city);
            setCountry(currentAddress.country);
            setRegion(currentAddress.region);
            setPostalCode(currentAddress.postalCode);
            setChecked(currentAddress.mainAddress);            
        }
    }, [addressId]);

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

    const onChangeCountry = (event) => { 
        setCountry(event.target.value ? event.target.value[0].toUpperCase() + event.target.value.slice(1) : '');            
    };

    const onChangeRegion = (event) => { 
        setRegion(event.target.value ? event.target.value[0].toUpperCase() + event.target.value.slice(1) : '');            
    };

    const onChangePostalCode = (event) => { 
        setPostalCode(event.target.value);            
    };

    const checkedCheckbox = () => {
        if (!checked && existingMainAddress.id === addressId) {
            setChecked(true);
        } else if (!checked && existingMainAddress.id !== addressId) {
            window.alert('Você já tem um endereço principal. Edite-o, limpe a propriedade de prioridade para selecionar outro endereço como principal.');
        } else {
            setChecked(false);            
        }
    }

    const success = () => {
        setUpdateAddressMode(false);
        window.scrollTo(0, 0);
    }

    const updateAddress = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const id = userId;
        formData.set('updatedAddressId', addressId);
        formData.set('firstName', username);
        formData.set('lastName', surname);
        formData.set('email', email);
        formData.set('phone', phone);
        formData.set('company', company);            
        formData.set('firstAddress', firstAddress);
        formData.set('secondAddress', secondAddress);
        formData.set('city', city);
        formData.set('country', country);
        formData.set('region', region);
        formData.set('postalCode', postalCode);
        formData.set('mainAddress', checked);
        updateUser(formData, id).then(data => success());
    }
    
    return (
        <div className={styles.body}>     
            <form onSubmit={updateAddress} id="addressForm" className={styles.addressForm}>
                <div className={styles.formLine}>
                    <label htmlFor="user-name-input" className={styles.formLabel}>Primeiro Nome</label>
                    <input required id="user-name-input" tabIndex="1" autoComplete="off" type="text" name="name" data-error="Error" placeholder='Nome' className={styles.formInput}
                        ref={inputRef}
                        value={username}
                        onChange={onChangeUsername}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-surname-input" className={styles.formLabel}>Último Nome</label>
                    <input required id="user-surname-input" tabIndex="2" autoComplete="off" type="text" name="surname" data-error="Error" placeholder="Sobrenome" className={styles.formInput}
                        ref={inputRef}
                        value={surname}
                        onChange={onChangeSurname}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-company-input" className={styles.formLabel}>Empresa</label>
                    <input id="user-company-input" tabIndex="3" autoComplete="off" type="text" name="company" data-error="Error" className={styles.formInput}
                        ref={inputRef}
                        value={company}
                        onChange={onChangeCompany}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-contact-input" className={styles.formLabel}>Telefone</label>
                    <input required id="user-contact-input" tabIndex="4" autoComplete="off" type="tel" pattern="[+]{1}[0-9]{12}" name="contact" data-error="Error" placeholder="+351XXXXXXXXXX" className={styles.formInput}
                        ref={inputRef}
                        value={phone}
                        onChange={onChangePhone}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-email-input" className={styles.formLabel}>E-mail</label>
                    <input required id="user-email-input" tabIndex="5" autoComplete="off" type="email" name="email" data-error="Error" placeholder="example@email.com" className={styles.formInput} 
                        ref={inputRef}
                        value={email}
                        onChange={onChangeEmail}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-f-address-input" className={styles.formLabel}>Morada №1</label>
                    <input required id="user-f-address-input" tabIndex="6" autoComplete="off" type="text" name="firstAddress" data-error="Error" className={styles.formInput}
                        ref={inputRef}
                        value={firstAddress}
                        onChange={onChangeFAddress}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-s-address-input" className={styles.formLabel}>Morada №2</label>
                    <input id="user-s-address-input" tabIndex="7" autoComplete="off" type="text" name="secondAddress" data-error="Error" className={styles.formInput}
                        ref={inputRef}
                        value={secondAddress}
                        onChange={onChangeSAddress}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-city-input" className={styles.formLabel}>Cidade</label>
                    <input required id="user-city-input" tabIndex="8" autoComplete="off" type="text" name="city" data-error="Error" className={styles.formInput}
                        ref={inputRef}
                        value={city}
                        onChange={onChangeCity}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-country-input" className={styles.formLabel}>País</label>
                    <input required id="user-country-input" tabIndex="9" autoComplete="off" type="text" name="country" data-error="Error" className={styles.formInput}
                        ref={inputRef}
                        value={country}
                        onChange={onChangeCountry}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-region-input" className={styles.formLabel}>Província</label>
                    <input required id="user-region-input" tabIndex="10" autoComplete="off" type="text" name="region" data-error="Error" className={styles.formInput}
                        ref={inputRef}
                        value={region}
                        onChange={onChangeRegion}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-postal-code-input" className={styles.formLabel}>Código postal/ZIP</label>
                    <input required id="user-postal-code-input" tabIndex="11" autoComplete="off" type="text" name="postal-code" data-error="Error" className={styles.formInput}
                        ref={inputRef}
                        value={postalCode}
                        onChange={onChangePostalCode}/>
                </div>
                <div className={styles.formLineCheckbox}>
                    <label onClick={checkedCheckbox} htmlFor="userCheckBox" className={checked ? styles.formLabelChecked : styles.formLabelCheckbox}>
                        Selecione principal
                    </label>
                    <input id="userCheckBox" type="checkbox" name="agree" tabIndex="12" className={styles.formInputCheckbox} /> 
                </div>     
                <button type='submit' tabIndex="13" className={styles.formBtnSubmit}>
                    Atualizar
                </button>
            </form>                   
        </div>
    );
};

export default UpdateAddress;
