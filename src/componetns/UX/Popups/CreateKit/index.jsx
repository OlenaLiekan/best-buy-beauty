import React from 'react';
import styles from '../CreateProduct/CreateProduct.module.scss';
import kitStyles from './CreateKit.module.scss';
import axios from 'axios';
import { AuthContext } from '../../../../context';
import { createKit } from '../../../../http/productAPI';

const CreateKit = () => {

    const inputRef = React.useRef();

    const [brands, setBrands] = React.useState([]);
    const [types, setTypes] = React.useState([]);
    const [typeId, setTypeId] = React.useState(1);
    const [categoryId, setCategoryId] = React.useState(0);
    const [brandId, setBrandId] = React.useState(1);
    const [typeName, setTypeName] = React.useState('Selecione o tipo');
    const [brandName, setBrandName] = React.useState('Selecione a marca');
    const [typesVisibility, setTypesVisibility] = React.useState(false);
    const [brandsVisibility, setBrandsVisibility] = React.useState(false);
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [promoPrice, setPromoPrice] = React.useState('');
    const [newProduct, setNewProduct] = React.useState(false);
    const { setShowKitMenu, setKitCreation, serverDomain } = React.useContext(AuthContext);
    const [img, setImg] = React.useState(null);
    const [isLashes, setIsLashes] = React.useState(false);

    const [showKitOpions, setShowKitOptions] = React.useState(false);

    const selectFile = (event) => {
        setImg(event.target.files[0]);
    }

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onChangePrice = (e) => {
        setPrice(e.target.value.trim());
    }

    const onChangePromoPrice = (e) => {
        setPromoPrice(e.target.value.trim());
    }

    const checkedNewProduct = () => {
        if (!newProduct) {
            setNewProduct(true);  
        } else {
            setNewProduct(false);            
        }
    };

    React.useEffect(() => {
        axios.get(`${serverDomain}api/brand`)
            .then((res) => {
                setBrands(res.data);
            });
    }, [serverDomain]);

    React.useEffect(() => {
        axios.get(`${serverDomain}api/type`)
            .then((res) => {
                setTypes(res.data.slice(1));
            });
    }, [serverDomain]);

    const toggleBrandOptions = () => {
        if (brandsVisibility) {
            setBrandsVisibility(false);
        } else {
            setBrandsVisibility(true);
            setTypesVisibility(false);
        }
    }

    const toggleTypeOptions = () => {
        if (typesVisibility) {
            setTypesVisibility(false);
        } else {
            setTypesVisibility(true);
            setBrandsVisibility(false);
        }
    }

    const hideBrandOptions = (id, name) => {
        setBrandId(id);
        setBrandName(name);
        setBrandsVisibility(false);
    }

    const hideTypeOptions = (id, name) => {
        setTypeId(id);
        setTypeName(name);
        setTypesVisibility(false);
    }

    React.useEffect(() => {
        if (typeName.toLowerCase() === 'pestanas') {
            setIsLashes(true);
        } else {
            setIsLashes(false);
        }
    }, [typeName]);

    React.useEffect(() => {
        if (typeId && types) {
            const currentType = types.find((type) => type.id === typeId);
            const id = currentType ? currentType.categoryId : 0;
            setCategoryId(id);
        }
    }, [typeId, types]); 

    const success = () => {
        window.alert('O novo conjunto foi criado com sucesso!');
        setKitCreation(false);        
        setShowKitMenu(false); 
    }

    const message = () => {
        window.alert('Ocorreu um erro!');        
    }

    const pushKit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('brandId', brandId);
        formData.append('typeId', typeId);   
        formData.append('isLashes', isLashes);
        formData.append('categoryId', categoryId);
        formData.append('isPromo', promoPrice && +promoPrice > 0 ? true : false);
        if (price) {
            formData.append('price', price);            
        }
        if (promoPrice) {
            formData.append('discountPrice', promoPrice);               
        }       
        formData.append('img', img);            
        formData.append('newProduct', !newProduct);
        createKit(formData).then(data => success()).catch(err => message());
    };

    return (
        <form onSubmit={pushKit} className={styles.formProduct}>
            <div className={kitStyles.createKitWrapper}>
            <div className={styles.line}>
                <span className={styles.label}>Marca:</span>
                <div onClick={toggleBrandOptions} required tabIndex="1" className={styles.formSelectBrands}>
                    {brandName}
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                        <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                    </svg>
                </div>
                {brandsVisibility ?
                    <div className={styles.brandOptions}>
                        {brands ? brands.map((brand) =>
                            <div key={brand.name} value={brand.id} onClick={() => hideBrandOptions(brand.id, brand.name)} className={styles.option}>{brand.name}</div>
                        ) : ""}
                    </div>
                    : ''
                }
                <span className={styles.label}>Tipo:</span>
                <div onClick={toggleTypeOptions} required tabIndex="2" className={styles.formSelectTypes}>
                    {typeName}
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                        <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                    </svg>
                </div>
                {typesVisibility ?
                    <div className={styles.typeOptions}>
                        {types ? types.map((type) =>
                            <div key={type.name} onClick={() => hideTypeOptions(type.id, type.name)} value={type.name} className={styles.option}>{type.name}</div>
                        ) : ''}
                    </div>
                    : ""
                }
            </div>
            <div className={styles.line}>
                <label htmlFor="product-name" className={styles.label} placeholder='Name'>Nome:</label>
                <input id="product-name" required tabIndex="3" type='text' className={styles.formInput}
                    ref={inputRef}
                    value={name}
                    onChange={onChangeName}
                />
            </div>
            <div onClick={() => setShowKitOptions(showKitOpions ? false : true)} className={styles.line}>
                <span className={kitStyles.optionsTitle}>
                    Parâmetros comuns (opcional)
                    <svg className={showKitOpions ? kitStyles.optionsTitleIconActive : kitStyles.optionsTitleIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                    </svg>                    
                </span>
            </div>
            {showKitOpions
                &&
                <div className={kitStyles.optionsBody}>
                    <div className={styles.line}>
                        <label htmlFor="product-price" className={styles.label}>Preço:</label>
                        <input id="product-price" tabIndex="4" type='text' className={styles.formInputSmall} placeholder='0.00'
                            ref={inputRef}
                            value={price}
                            onChange={onChangePrice}
                        />
                    </div>
                    <div className={styles.formLineCheckbox}>
                        <label onClick={checkedNewProduct} htmlFor="newProductCheckbox" className={newProduct ? styles.formLabelChecked : styles.formLabelCheckbox}>
                            Não exibir em novos itens:
                        </label>
                        <input id="newProductCheckbox" type="checkbox" tabIndex="6" name="new-product" className={styles.formInputCheckbox} />
                    </div>
                    <div className={styles.line}>
                        <label htmlFor="product-promo-price" className={styles.label}>Preço promocional:</label>
                        <input id="product-promo-price" tabIndex="5" type='text' className={styles.formInputSmall} placeholder='0.00'
                            ref={inputRef}
                            value={promoPrice}
                            onChange={onChangePromoPrice}
                        />
                    </div>
                    <div className={styles.line}>
                        <label htmlFor="product-file" className={styles.label}>Foto:</label>
                        <input id="product-file" tabIndex="6" type='file' name='image' className={styles.formFile}
                            onChange={selectFile}
                        />
                    </div>
                </div>                
            }

            <button type='submit' tabIndex='7' className={styles.button}>
                Criar um conjunto
            </button>
            </div>
        </form>
    );  
};

export default CreateKit;