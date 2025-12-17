import React from 'react';
import styles from './UpdateAddress.module.scss';
import { updateUser } from '../../../../http/userAPI';
import { AuthContext } from '../../../../context';
import { getCountryCallingCode, getCountries } from "libphonenumber-js";

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
    const [telCode, setTelCode] = React.useState('');
    const [postalCode, setPostalCode] = React.useState('');
    const [company, setCompany] = React.useState('');
    const [checked, setChecked] = React.useState(false);
    const [visibleList, setVisibleList] = React.useState(false);
    const [countryValue, setCountryValue] = React.useState('');

    if (!existingMainAddress) {
        existingMainAddress = { id: addressId };
    }

    React.useEffect(() => {
        const currentAddress = addresses.find((address) => address.id === addressId);
        if (currentAddress) {
            setUsername(currentAddress.firstName.trimStart());
            setSurname(currentAddress.lastName.trimStart());
            setCompany(currentAddress.company ? currentAddress.company : company);
            setPhone(currentAddress.phone.trimStart());
            setEmail(currentAddress.email);
            setFirstAddress(currentAddress.firstAddress);
            setSecondAddress(currentAddress.secondAddress ? currentAddress.secondAddress : secondAddress);
            setCity(currentAddress.city);
            setCountry(!country ? currentAddress.country : country);
            setRegion(currentAddress.region);
            setPostalCode(currentAddress.postalCode);
            setChecked(currentAddress.mainAddress);            
        }
    }, [addressId, addresses]);

    const onChangeCompany = (event) => { 
        setCompany(event.target.value.slice(0, 9));       
    };

    const onChangeUsername = (event) => { 
        setUsername(event.target.value ? (event.target.value[0].toUpperCase() + event.target.value.slice(1)).trimStart() : '');            
    };

    const onChangeSurname = (event) => { 
        setSurname(event.target.value ? (event.target.value[0].toUpperCase() + event.target.value.slice(1)).trimStart() : '');
    };

    const onChangePhone = (event) => { 
        setPhone(event.target.value.trimStart().slice(0, 13));
        console.log(phone);
    };

    const onChangeEmail = (event) => { 
        setEmail(event.target.value.toLowerCase());
    };

    const onChangeFAddress = (event) => { 
        setFirstAddress(event.target.value.split(',').join(' '));            
    };

    const onChangeSAddress = (event) => { 
        setSecondAddress(event.target.value.split(',').join(' '));            
    };

    const onChangeCity = (event) => { 
        setCity(event.target.value ? (event.target.value[0].toUpperCase() + event.target.value.slice(1)).split(',').join(' ') : '');            
    };

    const onChangeRegion = (event) => { 
        setRegion(event.target.value ? (event.target.value[0].toUpperCase() + event.target.value.slice(1)).split(',').join(' ') : '');            
    };

    const onChangePostalCode = (event) => { 
        if (country === "PT") {
            if (event.target.value.length > 4 && event.target.value[4] !== '-') {
                setPostalCode(event.target.value.slice(0, 4) + '-' + event.target.value.slice(4, 8));
            } else {
                setPostalCode(event.target.value.slice(0, 8));              
            }             
        } else {
            setPostalCode(event.target.value.slice(0, 10));
        }
    };

    const checkedCheckbox = () => {
        if (!checked) {
            setChecked(true);     
        } else if (!checked && existingMainAddress.id === addressId) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    }

    const showCountries = () => {
        if (!visibleList) {
            setVisibleList(true);
        } else {
            setVisibleList(false);
            setCountryValue('');
        }
    }

    const countries = getCountries().map((countryCode) => {
        return {
        code: countryCode,
        name: new Intl.DisplayNames(["pt"], { type: "region" }).of(countryCode),
        telCode: `+${getCountryCallingCode(countryCode)}`,
        };
    });

    const onChangeCountry = (countryCode) => {
        setCountry(countryCode);
        const newTelCode = `+${getCountryCallingCode(countryCode)}`;
        setPhone(newTelCode);
        setVisibleList(false);
        setCountryValue('');
    };

    const onChangeCountryValue = (event) => {
        setCountryValue(event.target.value);
    };

    const success = () => {
        setUpdateAddressMode(false);
        window.scrollTo(0, 0);
    }

    const message = () => {
        window.alert('Ocorreu um erro!');        
    }

    const updateAddress = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const id = userId;
        const countryData = countries.find((c) => c.code === country);
        formData.set('updatedAddressId', addressId);
        formData.set('upFirstName', username.trimStart());
        formData.set('upLastName', surname.trimStart());
        formData.set('upEmail', email);
        formData.set('upPhone', phone.trimStart());
        formData.set('company', company ? company : ' ');            
        formData.set('firstAddress', firstAddress);
        formData.set('secondAddress', secondAddress);
        formData.set('city', city);
        formData.set('country', countryData.code);
        formData.set('region', region);
        formData.set('postalCode', postalCode);
        formData.set('mainAddress', checked);
        updateUser(formData, id).then(data => success()).catch(err => message());
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
                    <label htmlFor="user-f-address-input" className={styles.formLabel}>Rua</label>
                    <input required id="user-f-address-input" tabIndex="4" autoComplete="off" type="text" name="firstAddress" data-error="Error" className={styles.formInput}
                        ref={inputRef}
                        value={firstAddress}
                        onChange={onChangeFAddress}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-s-address-input" className={styles.formLabel}>Número da porta</label>
                    <input required id="user-s-address-input" tabIndex="5" autoComplete="off" type="text" name="secondAddress" data-error="Error" className={styles.formInput}
                        ref={inputRef}
                        value={secondAddress}
                        onChange={onChangeSAddress}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-city-input" className={styles.formLabel}>Cidade</label>
                    <input required id="user-city-input" tabIndex="6" autoComplete="off" type="text" name="city" data-error="Error" className={styles.formInput}
                        ref={inputRef}
                        value={city}
                        onChange={onChangeCity}/>
                </div>
                <div className={styles.formLineSelect}>
                    <label htmlFor="user-country-input" className={styles.formLabel}>País</label>
                    <input readOnly required onClick={showCountries} id="user-country-input" tabIndex="7" autoComplete="off" type="text" name="country" data-error="Error" className={styles.formInputSelect}
                        ref={inputRef}
                        value={countries.find((c) => c.code === country)?.name || ""}/>
                    <svg onClick={showCountries} className={visibleList ? styles.rotate : styles.arrow} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                        <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                    </svg>
                    <div className={visibleList ? styles.countriesWrapper : styles.hidden}>
                        <ul className={visibleList ? styles.countriesList : styles.hidden}>
                                <li className={styles.searchLine}>
                                    <input
                                        id="country-search-input"
                                        name="country_value"
                                        type="text"
                                        placeholder="Digite seu país"
                                        value={countryValue}
                                        onChange={onChangeCountryValue}
                                        className={styles.countrySearch}
                                    />  
                                    <svg
                                        className={styles.searchSvg}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512">
                                        <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 
                                        44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208
                                        208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4
                                        9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7
                                        0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128
                                        0 70.7-57.2 128-128 128z" />
                                    </svg> 
                                </li>
                                {countryValue 
                                    ?
                                    countries.filter((country) => country.name.toLowerCase().includes(countryValue.toLowerCase())).map((country) => (
                                        <li
                                            onClick={() => onChangeCountry(country.code)}
                                            key={country.code}
                                            className={styles.countryItem}
                                            >
                                            {country.name} {country.telCode}
                                        </li>
                                    ))
                                    :
                                    countries.map((country) => (
                                        <li
                                        onClick={() => onChangeCountry(country.code)}
                                        key={country.code}
                                        className={styles.countryItem}
                                        >
                                            {country.name} {country.telCode}
                                        </li>
                                    ))}
                        </ul>                        
                    </div>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-region-input" className={styles.formLabel}>Concelho</label>
                    <input required id="user-region-input" tabIndex="8" autoComplete="off" type="text" name="region" data-error="Error" className={styles.formInput}
                        ref={inputRef}
                        value={region}
                        onChange={onChangeRegion}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-postal-code-input" className={styles.formLabel}>Código postal/ZIP</label>
                    <input required id="user-postal-code-input" tabIndex="9" autoComplete="off" type="text" pattern={country === "Portugal" ? "[0-9]{4}-[0-9]{3}" : "[0-9-A-Za-z]"} name="postal-code" placeholder='0000-000' data-error="Error" className={styles.formInput}
                        ref={inputRef}
                        value={postalCode}
                        onChange={onChangePostalCode}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-contact-input" className={styles.formLabel}>Telemóvel</label>
                    <input required id="user-contact-input" tabIndex="10" autoComplete="off" type="tel" pattern="\+?[0-9\s\-\(\)]+" name="contact" data-error="Error" placeholder="+351XXXXXXXXXX" className={styles.formInput}
                        ref={inputRef}
                        value={phone}
                        onChange={onChangePhone}/>
                </div>
                <div className={styles.formLine}>
                    <label htmlFor="user-email-input" className={styles.formLabel}>E-mail</label>
                    <input required id="user-email-input" tabIndex="11" autoComplete="off" type="email" name="email" data-error="Error" placeholder="example@email.com" className={styles.formInput} 
                        ref={inputRef}
                        value={email}
                        onChange={onChangeEmail}/>
                </div>
                <div className={styles.formLineCheckbox}>
                    <label onClick={checkedCheckbox} htmlFor="userCheckBox" className={checked ? styles.formLabelChecked : styles.formLabelCheckbox}>
                        Selecione principal
                    </label>
                    <input id="userCheckBox" type="checkbox" name="agree" tabIndex="12" className={styles.formInputCheckbox} /> 
                </div>  
                <div className={styles.formLine}>
                    <label hidden htmlFor="user-company-input" className={styles.formLabel}>NIF (opcional)</label>
                    <input hidden id="user-company-input" tabIndex="3" autoComplete="off" type="text" name="company" placeholder='000000000' data-error="Error" className={styles.formInput}
                        ref={inputRef}
                        value={company}
                        onChange={onChangeCompany}/>
                </div>
                <button type='submit' tabIndex="13" className={styles.formBtnSubmit}>
                    Atualizar
                </button>
            </form>                   
        </div>
    );
};

export default UpdateAddress;
