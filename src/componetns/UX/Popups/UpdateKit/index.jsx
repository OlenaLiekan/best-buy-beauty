import React from 'react';
import styles from '../UpdateProduct/UpdateProduct.module.scss';
import kitStyles from './UpdateKit.module.scss';
import axios from 'axios';
import { AuthContext } from '../../../../context';
import { updateKit } from '../../../../http/productAPI';
import debounce from 'lodash.debounce';

const UpdateKit = () => {

    const inputRef = React.useRef();

    const [brands, setBrands] = React.useState([]);
    const [types, setTypes] = React.useState([]);
    const [kits, setKits] = React.useState([]);
    const [typeId, setTypeId] = React.useState(1);
    const [categoryId, setCategoryId] = React.useState(0);
    const [brandId, setBrandId] = React.useState(1);
    const [kitId, setKitId] = React.useState(0);    
    const [typeName, setTypeName] = React.useState('Selecione o tipo');
    const [brandName, setBrandName] = React.useState('Selecione a marca');
    const [kitName, setKitName] = React.useState('Selecione um conjunto');  
    const [kitValue, setKitValue] = React.useState(''); 
    const [kitSearchValue, setKitSearchValue] = React.useState(''); 
    const [typesVisibility, setTypesVisibility] = React.useState(false);
    const [brandsVisibility, setBrandsVisibility] = React.useState(false);
    const [kitsVisibility, setKitsVisibility] = React.useState(false);
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [promoPrice, setPromoPrice] = React.useState('');
    const [newProduct, setNewProduct] = React.useState(false);
    const { setKitEditingMenu, setKitEditing, serverDomain } = React.useContext(AuthContext);
    const [img, setImg] = React.useState(null);
    const [isLashes, setIsLashes] = React.useState(false);

    const [showKitOpions, setShowKitOptions] = React.useState(false);

    const selectFile = (event) => {
        setImg(event.target.files[0]);
    }

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const updateKitValue = React.useCallback(
        debounce((str) => {
            setKitSearchValue(str);
        }, 600),
        [],
    );

    const onChangeKitValue = (e) => {
        setKitValue(e.target.value);
        updateKitValue(e.target.value);
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
        const searchParams = kitSearchValue ? `?name=${kitSearchValue}` : '';
        axios.get(`${serverDomain}/api/kit${searchParams}`)
            .then((res) => {
                setKits(res.data);
            });
    }, [serverDomain, kitSearchValue]);

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

    React.useEffect(() => {
        if (kitId > 0 && kits.length > 0) {
            const selectedKit = kits.find((kit) => kit.id == kitId);
            setBrandId(selectedKit.brandId);
            setTypeId(selectedKit.typeId);
            setName(selectedKit.name);
            setPrice(selectedKit.price ? selectedKit.price.toFixed(2) : '');
            setPromoPrice(selectedKit.discountPrice ? selectedKit.discountPrice.toFixed(2) : '');
            if (selectedKit.newProduct) {
                setNewProduct(false);
            } else {
                setNewProduct(true);
            }
            const kitBrandName = brands.find((brand) => brand.id == selectedKit.brandId).name;
            setBrandName(kitBrandName);
            const kitTypeName = types.find((type) => type.id == selectedKit.typeId).name;
            setTypeName(kitTypeName);
        }
    }, [kitId]);

    const toggleBrandOptions = () => {
        if (brandsVisibility) {
            setBrandsVisibility(false);
        } else {
            setBrandsVisibility(true);
            setTypesVisibility(false);
            setKitsVisibility(false);
        }
    }

    const toggleTypeOptions = () => {
        if (typesVisibility) {
            setTypesVisibility(false);
        } else {
            setTypesVisibility(true);
            setBrandsVisibility(false);
            setKitsVisibility(false);
        }
    }

    const toggleKitOptions = () => {
        if (kitsVisibility) {
            setKitsVisibility(false);
        } else {
            setKitsVisibility(true);
            setTypesVisibility(false);
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

    const hideKitOptions = (id, name) => {
        setKitId(id);
        setKitName(name);
        setKitsVisibility(false);
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
        window.alert('Conjunto alterado com sucesso!');
        setKitEditing(false);
        setKitEditingMenu(false);
    }

    const message = () => {
        window.alert('Ocorreu um erro!');        
    }

    const changeKit = (e) => {
        e.preventDefault();
        if (kitId && kits.length > 0) {        
            const formData = new FormData();
            formData.set('name', name);
            formData.set('brandId', brandId);
            formData.set('typeId', typeId);   
            formData.set('isLashes', isLashes);
            formData.set('categoryId', categoryId);
            formData.set('isPromo', promoPrice && +promoPrice > 0 ? true : false);
            formData.set('price', price ? price : null);             
            formData.set('discountPrice', promoPrice ? promoPrice : null);            
            formData.set('img', img);            
            formData.set('newProduct', !newProduct);
            updateKit(formData, kitId).then(data => success()).catch(err => message());            
        }
    };

    const clearKitValue = () => {
        setKitValue('');
        setKitSearchValue('');
    };

    return (

        <form onSubmit={changeKit} className={styles.formProduct}>
            <div className={kitStyles.updateKitWrapper}>
                <div className={styles.line}>
                    <span className={styles.label}>Conjunto:</span>
                    <div onClick={toggleKitOptions} required tabIndex="1" className={kitStyles.formSelectKit}>
                        {kitName}
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                            <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                        </svg>
                    </div>
                    {kitsVisibility ?
                        <div className={kitStyles.kitOptions}>
                            {
                                kits.length > 0
                                    ?
                                    <input id="kit-search" type='text' className={kitStyles.kitSearchInput}
                                        ref={inputRef}
                                        value={kitValue}
                                        onChange={onChangeKitValue}
                                        placeholder={`Procure um conjunto...`}
                                    />
                                    :
                                    ''
                            }
                            {
                                kitValue
                                &&
                                <svg className={kitStyles.deleteIcon} onClick={clearKitValue} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                    <path d="M576 64H205.26A63.97 63.97 0 0 0 160 82.75L9.37 233.37c-12.5 12.5-12.5 32.76 0 45.25L160 429.25c12 12 28.28 18.75 45.25 18.75H576c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm-84.69 254.06c6.25 6.25 6.25 16.38 0 22.63l-22.62 22.62c-6.25 6.25-16.38 6.25-22.63 0L384 301.25l-62.06 62.06c-6.25 6.25-16.38 6.25-22.63 0l-22.62-22.62c-6.25-6.25-6.25-16.38 0-22.63L338.75 256l-62.06-62.06c-6.25-6.25-6.25-16.38 0-22.63l22.62-22.62c6.25-6.25 16.38-6.25 22.63 0L384 210.75l62.06-62.06c6.25-6.25 16.38-6.25 22.63 0l22.62 22.62c6.25 6.25 6.25 16.38 0 22.63L429.25 256l62.06 62.06z" />
                                </svg>                                
                            }
                            

                            {kits.length > 0 ? kits.map((kit) =>
                                <div key={kit.name} value={kit.id} onClick={() => hideKitOptions(kit.id, kit.name)} className={styles.option}>{kit.name}</div>
                            ) : <span className={kitStyles.listMsg}>{kitSearchValue ? 'Não encontrado' : 'Nenhuma lista disponível'}</span>}
                        </div>
                        : ''
                    }
                </div>
                { kitId
                    ?            
                    <>
                        <div className={styles.line}>
                            <span className={styles.label}>Marca:</span>
                            <div onClick={toggleBrandOptions} required tabIndex="2" className={kitStyles.formSelectBrands}>
                                {brandName}
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                    <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                                </svg>
                            </div>
                            {brandsVisibility ?
                                <div className={kitStyles.brandOptions}>
                                    {brands ? brands.map((brand) =>
                                        <div key={brand.name} value={brand.id} onClick={() => hideBrandOptions(brand.id, brand.name)} className={styles.option}>{brand.name}</div>
                                    ) : ""}
                                </div>
                                : ''
                            }
                            <span className={styles.label}>Tipo:</span>
                            <div onClick={toggleTypeOptions} required tabIndex="3" className={kitStyles.formSelectTypes}>
                                {typeName}
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                    <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                                </svg>
                            </div>
                            {typesVisibility ?
                                <div className={kitStyles.typeOptions}>
                                    {types ? types.map((type) =>
                                        <div key={type.name} onClick={() => hideTypeOptions(type.id, type.name)} value={type.name} className={styles.option}>{type.name}</div>
                                    ) : ''}
                                </div>
                                : ""
                            }
                        </div>
                        <div className={styles.line}>
                            <label htmlFor="kit-name" className={styles.label} placeholder='Name'>Nome:</label>
                            <input id="kit-name" required tabIndex="4" type='text' className={styles.formInput}
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
                                    <input id="product-price" required tabIndex="5" type='text' className={styles.formInputSmall} placeholder='0.00'
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
                                    <input id="product-promo-price" tabIndex="7" type='text' className={styles.formInputSmall} placeholder='0.00'
                                        ref={inputRef}
                                        value={promoPrice}
                                        onChange={onChangePromoPrice}
                                    />
                                </div>
                                <div className={styles.line}>
                                    <label htmlFor="product-file" className={styles.label}>Foto:</label>
                                    <input id="product-file" required tabIndex="8" type='file' name='image' className={styles.formFile}
                                        onChange={selectFile}
                                    />
                                </div>
                            </div>
                        }

                        <button type='submit' tabIndex='9' className={styles.button}>
                            Aplicar alterações
                        </button>
                    </>
                    :
                    ""
                }
            </div>
        </form>  
    );  
};

export default UpdateKit;