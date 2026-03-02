import React from 'react';
import styles from '../CreateProduct/CreateProduct.module.scss';
import kitStyles from './CreateKit.module.scss';
import axios from 'axios';
import { AuthContext } from '../../../../context';
import { createKit, createProduct } from '../../../../http/productAPI';

const CreateKit = () => {

    const inputRef = React.useRef();
    const textRef = React.useRef(null);
    const applyingRef = React.useRef(null);
    const compoundRef = React.useRef(null);

    const [brands, setBrands] = React.useState([]);
    const [types, setTypes] = React.useState([]);
    const [kitSlides, setKitSlides] = React.useState([]);

    const [kitId, setKitId] = React.useState('');
    const [typeId, setTypeId] = React.useState(1);
    const [categoryId, setCategoryId] = React.useState(0);
    const [brandId, setBrandId] = React.useState(1);
    const [typeName, setTypeName] = React.useState('Selecione o tipo');
    const [brandName, setBrandName] = React.useState('Selecione a marca');
    const [typesVisibility, setTypesVisibility] = React.useState(false);
    const [brandsVisibility, setBrandsVisibility] = React.useState(false);
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [productPrice, setProductPrice] = React.useState('');
    const [promoPrice, setPromoPrice] = React.useState('');
    const [newProduct, setNewProduct] = React.useState(false);
    const { setShowKitMenu, setKitCreation, serverDomain } = React.useContext(AuthContext);
    const [img, setImg] = React.useState(null);
    const [isLashes, setIsLashes] = React.useState(false);
    const [variants, setVariants] = React.useState('');
    const [optionsList, setOptionsList] = React.useState('');
    const [initialCode, setInitialCode] = React.useState('');
    const [productsToCreate, setProductsToCreate] = React.useState([]);

    const [showKitOpions, setShowKitOptions] = React.useState(false);
    const [showProductsMenu, setShowProductsMenu] = React.useState(false);

    const [related, setRelated] = React.useState([]);
    const [info, setInfo] = React.useState([]);
    const [slide, setSlide] = React.useState([]);
    const [images, setImages] = React.useState([]);
    const [text, setText] = React.useState('');
    const [applying, setApplying] = React.useState('');
    const [compound, setCompound] = React.useState('');
    const [visibleDescription, setVisibleDescription] = React.useState(true);
    const [visibleApplying, setVisibleApplying] = React.useState(false);
    const [visibleCompound, setVisibleCompound] = React.useState(false);

    const [successfullyCreated, setSuccessfullyCreated] = React.useState([]);
    const [failedToCreate, setFailedToCreate] = React.useState([]);

    const [activeField, setActiveField] = React.useState('text');
    const [selectedColor, setSelectedColor] = React.useState('#000000');

    const selectFile = (event) => {
        setImg(event.target.files[0]);
    }

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onChangePrice = (e) => {
        setPrice(e.target.value.trim());
        if (e.target.value) {
            setProductPrice(e.target.value.trim());
        } else {
            setProductPrice('');  
        }
    }

    const onChangeProductPrice = (e) => {
        setProductPrice(e.target.value.trim());
        if (e.target.value) {
            setPrice('');
        }
    }

    const onChangePromoPrice = (e) => {
        setPromoPrice(e.target.value.trim());
    }

    const onChangeVariants = (e) => {
        setVariants(e.target.value);
    }

    const onChangeOptionsList = (e) => {
        setOptionsList(e.target.value);
    }

    const onChangeInitialCode = (e) => {
        setInitialCode(e.target.value.trim().slice(0,6));
    }

    const changeCode = (key, value, variant) => {
        setProductsToCreate(productsToCreate.map(product => product.variant === variant ? { ...product, [key]: value } : product));
    }

    const addInfo = () => {
        setInfo([...info, { title: "", description: "", number: Date.now() }]);
    }

    const removeInfo = (number) => {
        setInfo(info.filter(i => i.number !== number));
    }

    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => i.number === number ? { ...i, [key]: value } : i));
    }

    const addRelated = () => {
        setRelated([...related, { referenceCode: "", number: Date.now() }]);
    }

    const removeRelated = (number) => {
        setRelated(related.filter(i => i.number !== number));
    }

    const changeRelated = (key, value, number) => {
        setRelated(related.map(i => i.number === number ? { ...i, [key]: value.trim() } : i));
    }

    const addSlide = () => {
        setSlide([...slide, { slideImg: "", number: Date.now() }]);
    }

    const removeSlide = (number) => {
        setSlide(slide.filter(i => i.number !== number));
    }

    const changeSlide = (key, value, number) => {
        setSlide(slide.map(i => i.number === number ? { ...i, [key]: value } : i));
    }

    const onChangeText = (e) => {
        setText(e.target.value);
    }

    const onChangeApplying = (e) => {
        setApplying(e.target.value);
    }

    const onChangeCompound = (e) => {
        setCompound(e.target.value);
    }

    React.useEffect(() => {
        let slideFiles = Object.entries(slide).map(([key, value]) => value);
        slideFiles = slideFiles.map((slideFile) => Object.entries(slideFile));
        slideFiles = slideFiles.map((slideFile) => slideFile.map((file) => file[1]));
        setImages(slideFiles.map((slideFile) => slideFile[0]));
    }, [slide]);
    

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

    React.useEffect(() => {
        if (kitId) {
            axios.get(`${serverDomain}api/kit?id=${kitId}`)
                .then((res) => {
                    setKitSlides(res.data.slide);
                });            
        }
    }, [serverDomain, kitId]);

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

     const insertTag = (tag) => {

        const textarea = getActiveTextarea();
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        
        let newText = '';
        
        if (selectedText) {
            newText = textarea.value.substring(0, start) + 
            `<${tag}>${selectedText}</${tag}>` + 
            textarea.value.substring(end);
        } else {
            newText = textarea.value.substring(0, start) + 
            `<${tag}></${tag}>` + 
            textarea.value.substring(end);
        }
        updateFieldValue(newText);
    };

    const applyColor = () => {
        const textarea = getActiveTextarea();
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        
        let newText = '';
        
        if (selectedText) {
            newText = textarea.value.substring(0, start) + 
                    `<span style="color: ${selectedColor}">${selectedText}</span>` + 
                    textarea.value.substring(end);
        } else {
            newText = textarea.value.substring(0, start) + 
                    `<span style="color: ${selectedColor}"></span>` + 
                    textarea.value.substring(end);
        }

        updateFieldValue(newText);
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
    };

    const getActiveTextarea = () => {
        switch (activeField) {
            case 'text': return textRef.current;
            case 'applying': return applyingRef.current;
            case 'compound': return compoundRef.current;
            default: return null;
        }
    };

    const updateFieldValue = (newValue) => {
        switch (activeField) {
            case 'text': 
                setText(newValue);
                break;
            case 'applying': 
                setApplying(newValue);
                break;
            case 'compound': 
                setCompound(newValue);
                break;
        }
    };

    const showListMsg = () => {
        window.alert(`Criado com sucesso: ${successfullyCreated.length > 0 ? successfullyCreated : 0}. 
            Erro de criação: ${failedToCreate.length > 0 ? failedToCreate : 0}.
            `);
        setSuccessfullyCreated([]);
        setFailedToCreate([]);
    }

    const message = () => {
        window.alert('Ocorreu um erro!');        
    }

    const success = (kit) => {
        if (kit) {
            setKitId(kit.id);
        }
        window.alert('O novo conjunto foi criado com sucesso!');
        if (productsToCreate.length > 0 && kit) {
            productsToCreate.forEach((product) => {
                const formData = new FormData(); 
                formData.append('name', product.name);
                formData.append('code', product.code);
                formData.append('price', product.price);
                formData.append('discountPrice', promoPrice ? promoPrice : 0);
                formData.append('categoryId', categoryId);
                formData.append('brandId', brandId);
                formData.append('typeId', typeId);
                if (img) {
                    formData.append('kitImg', kit.img);
                }
                formData.append('related', JSON.stringify(related));
                formData.append('info', JSON.stringify(info));
                formData.append('text', text);
                formData.append('newProduct', !newProduct);
                formData.append('applying', applying);            
                formData.append('compound', compound);            
                formData.append('isLashes', isLashes);
                formData.append('kitId', kit.id);
                formData.append('variant', product.variant);
                formData.append('isPromo', promoPrice && +promoPrice > 0 ? true : false);
                if (kitSlides) {
                    if (kitSlides.length > 0) {
                        kitSlides.forEach((slide) => {
                            formData.append('kitSlide', slide);
                        });
                    }                    
                }
                createProduct(formData).then(data => setSuccessfullyCreated([...successfullyCreated, product.code])).catch(err => setFailedToCreate([...failedToCreate, product.code])).finally(showListMsg);
            });
        }
        setKitCreation(false);        
        setShowKitMenu(false); 
    }

    const generateVariants = () => {

        if (variants && productPrice) {
            const groups = variants.split('|').map(group => 
                group.split(',').map(item => item.trimEnd())
            );

            /*if (groups.length === 1) {
                return groups[0].map(item => ({
                    variant: item,
                    code: '',
                    price: productPrice,
                }));
            }*/

            const result = productsToCreate;
            
            const generateCombinations = (current, depth) => {
                const duplicate = productsToCreate.find((product) => product.variant === current.join(','));
                if (depth === groups.length && !duplicate) {
                    result.push({
                        name: name + ' ' + current.join(' '),
                        code: '',       
                        price: productPrice,          
                        discountPrice: promoPrice,
                        isPromo: promoPrice && +promoPrice > 0 ? true : false,
                        categoryId,
                        brandId,
                        typeId,
                        info,
                        related,
                        isLashes,
                        variant: current.join(','),
                        available: true,
                        text,
                        newProduct: !newProduct,
                        compound,
                        applying,
                    });
                    return;
                }

                if (duplicate) {
                    window.alert(`Algumas variações já existem na lista. Edite os parâmetros de geração especificados ou exclua as variações existentes.`);
                }
        
                groups[depth].forEach(item => {
                    generateCombinations([...current, item], depth + 1);
                });
            };
        
            generateCombinations([], 0);
            return result;            
        }

    };

    const generateCodes = () => {
        if (initialCode) {
            let codeNumberArr = [];
            let initialNumber = '';
            for (let i = 0; i < initialCode.length; i++) {
                let number = initialCode[i];
                if (number > 0) {
                    initialNumber = String(initialNumber) + String(number);
                }
                codeNumberArr.push(number);
            }

            let generatedCodes = [];

            let j = 0;

            for (j; j < productsToCreate.length; j++) {
                    let newNumber = +initialNumber + j; 
                    let newNumberLength = String(newNumber).length;
                    let newZeroCount = 6 - newNumberLength;
                    let prefix = '';
                    for (let k = 0; k < newZeroCount; k++) {
                        prefix = prefix + '0';
                    }

                generatedCodes.push(String(prefix) + String(newNumber));
            }
            
            setProductsToCreate(productsToCreate.map((product, i) => product.code !== undefined ? { ...product, code: generatedCodes[i] } : product));
        }
    }

    const removeProduct = (variant) => {
        setProductsToCreate(productsToCreate.filter((product) => product.variant !== variant));
    }

    const handleGenerateClick = () => {
        const generatedVariants = generateVariants();
        setProductsToCreate(generatedVariants);
        setProductPrice('');
        setVariants('');
    };


    const pushKit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('variantsList', optionsList);
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

        formData.append('related', JSON.stringify(related));
        formData.append('info', JSON.stringify(info));
        formData.append('text', text);
        formData.append('applying', applying);            
        formData.append('compound', compound);            

        images.forEach((file) => {
            formData.append('slide', file);
        });

        createKit(formData).then(data => success(data)).catch(err => message());
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
                    <label htmlFor="kit-name" className={styles.label}>Nome:</label>
                    <input id="kit-name" required tabIndex="3" type='text' placeholder='Definir nome' className={styles.formInput}
                        ref={inputRef}
                        value={name}
                        onChange={onChangeName}
                    />
                </div>
                <div className={styles.line}>
                    <label htmlFor="kit-options-list" className={styles.label}>Opções:</label>
                        <input id="kit-options-list" tabIndex="4" type='text' className={styles.formInput} placeholder='white, gold, black | 10ml, 20ml, 30ml'
                            ref={inputRef}
                            value={optionsList}
                            onChange={onChangeOptionsList}
                    />
                </div>      
                <div onClick={() => setShowKitOptions(showKitOpions ? false : true)} className={styles.line}>
                    <span className={kitStyles.paramsTitle}>
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
                            <label htmlFor="kit-price" className={styles.label}>Preço:</label>
                            <input id="kit-price" tabIndex="5" type='text' className={styles.formInputExtraSmall} placeholder='0.00'
                                ref={inputRef}
                                value={price}
                                onChange={onChangePrice}
                                />
                            <label htmlFor="kit-promo-price" className={styles.label}>Preço promocional:</label>
                            <input id="kit-promo-price" tabIndex="6" type='text' className={styles.formInputExtraSmall} placeholder='0.00'
                                ref={inputRef}
                                value={promoPrice}
                                onChange={onChangePromoPrice}
                            />
                        </div>
                        <div className={styles.formLineCheckbox}>
                            <label onClick={checkedNewProduct} htmlFor="newProductCheckbox" className={newProduct ? styles.formLabelChecked : styles.formLabelCheckbox}>
                                Não exibir em novos itens:
                            </label>
                            <input id="newProductCheckbox" type="checkbox" tabIndex="7" name="new-product" className={styles.formInputCheckbox} />
                        </div>
                        <div className={styles.fotoLine}>
                            <label htmlFor="kit-file" className={styles.label}>Foto:</label>
                            <input id="kit-file" tabIndex="8" type='file' name='kitImage' className={styles.formFile}
                                onChange={selectFile}
                            />
                        </div>
                            
                        {related.map((i) =>
                            <div className={styles.line} key={i.number}>
                                <label htmlFor="info-product_title" className={styles.label}>
                                    Código de produto adicional:
                                </label>
                                <input required id="info-product_title" tabIndex="9" type='text' className={styles.formInputSmall}
                                    value={i.referenceCode}
                                    onChange={(e) => changeRelated('referenceCode', e.target.value, i.number)}
                                />
                                <button type='button' tabIndex='10' className='info-product__remove' onClick={() => removeRelated(i.number)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                        <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        <button type='button' className={styles.relatedButton} tabIndex="11" onClick={addRelated}>Anexar produto</button>

                        {info.map((i) =>
                            <div className={styles.line} key={i.number}>
                                <label htmlFor="info-product_title" className={styles.label}>Propriedade:</label>
                                <input required id="info-product_title" tabIndex="12" type='text' className={styles.formInputSmall}
                                    value={i.title}
                                    onChange={(e) => changeInfo('title', e.target.value, i.number)}
                                />
                                <label htmlFor="info-product_description" className={styles.label}>Significado:</label>
                                <input required id="info-product_description" tabIndex="13" type='text' className={styles.formInputSmall}
                                    value={i.description}
                                    onChange={(e) => changeInfo('description', e.target.value, i.number)}
                                />
                                <button type='button' tabIndex='14' className='info-product__remove' onClick={() => removeInfo(i.number)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                        <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        <button type='button' className={styles.infoButton} tabIndex="15" onClick={addInfo}>Adicionar informações</button>
                        {slide.map((i) =>
                            <div className={styles.line} key={i.number}>
                                <label htmlFor="product-slide" className={styles.label}>Slide:</label>
                                <input id="product-slide" tabIndex="16" type='file' name='slide' className={styles.formFile}
                                    onChange={(e) => changeSlide('slideImg', e.target.files[0], i.number)}
                                />
                                <button type='button' tabIndex='17' className='slide-product__remove' onClick={() => removeSlide(i.number)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                        <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        <button type='button' className={styles.slideButton} tabIndex="18" onClick={addSlide}>Adicionar novo slide</button>
                        <div className={styles.miniEditor}>
                            <div className={styles.toolbar}>
                                <button
                                    type="button"
                                    onClick={() => insertTag('strong')}
                                    className={styles.toolBtn}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                        <path d="M333.49 238a122 122 0 0 0 27-65.21C367.87 96.49 308 32 233.42 32H34a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h31.87v288H34a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h209.32c70.8 0 134.14-51.75 141-122.4 4.74-48.45-16.39-92.06-50.83-119.6zM145.66 112h87.76a48 48 0 0 1 0 96h-87.76zm87.76 288h-87.76V288h87.76a56 56 0 0 1 0 112z" />
                                    </svg>
                                </button>
                            
                                <button
                                    type="button"
                                    onClick={() => insertTag('em')}
                                    className={styles.toolBtn}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                        <path d="M320 48v32a16 16 0 0 1-16 16h-62.76l-80 320H208a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16H16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h62.76l80-320H112a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h192a16 16 0 0 1 16 16z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={applyColor}
                                    className={styles.toolBtn}
                                >
                                    <svg style={{ fill: `${selectedColor}` }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path d="M432 416h-23.41L277.88 53.69A32 32 0 0 0 247.58 32h-47.16a32 32 0 0 0-30.3 21.69L39.41 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-19.58l23.3-64h152.56l23.3 64H304a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM176.85 272L224 142.51 271.15 272z" />
                                    </svg>
                                </button>
                                <div className={styles.colorBtn}>
                                    <input
                                        type="color"
                                        value={selectedColor}
                                        onChange={(e) => handleColorChange(e.target.value)}
                                        className={styles.colorPicker}
                                    />
                                </div>
                            </div>

                            <div className={styles.textareaTab}>
                                <label htmlFor="product-about" className={styles.label}>Descrição:</label>
                                <svg onClick={() => setVisibleDescription(visibleDescription ? false : true)} className={visibleDescription ? styles.arrowUp : styles.arrowDown} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                                </svg>
                            </div>

                            <textarea hidden={visibleDescription ? false : true} required id="product-about" tabIndex='19' className={styles.textarea}
                                ref={textRef}
                                value={text}
                                onChange={onChangeText}
                                onFocus={() => setActiveField('text')}
                            />

                            <div className={styles.textareaTab}>
                                <label htmlFor="product-applying" className={styles.label}>Método de uso:</label>
                                <svg onClick={() => setVisibleApplying(visibleApplying ? false : true)} className={visibleApplying ? styles.arrowUp : styles.arrowDown} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                                </svg>
                            </div>
                            <textarea hidden={visibleApplying ? false : true} id="product-applying" tabIndex='20' className={styles.textarea}
                                ref={applyingRef}
                                value={applying}
                                onChange={onChangeApplying}
                                onFocus={() => setActiveField('applying')}
                            />
                            <div className={styles.textareaTab}>
                                <label htmlFor="product-compound" className={styles.label}>Ingredientes:</label>
                                <svg onClick={() => setVisibleCompound(visibleCompound ? false : true)} className={visibleCompound ? styles.arrowUp : styles.arrowDown} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                                </svg>
                            </div>

                            <textarea hidden={visibleCompound ? false : true} id="product-compound" tabIndex='21' className={styles.textarea}
                                ref={compoundRef}
                                value={compound}
                                onChange={onChangeCompound}
                                onFocus={() => setActiveField('compound')}
                            />
                        </div>
                    </div>                
                }
                    
                <div onClick={() => setShowProductsMenu(showProductsMenu ? false : true)} className={styles.line}>
                    <span className={kitStyles.optionsTitle}>
                        Crie produtos
                        <svg className={showProductsMenu ? kitStyles.optionsTitleIconActive : kitStyles.optionsTitleIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                        </svg>                    
                    </span>
                </div>
                    
                {showProductsMenu
                    &&
                    <div className={kitStyles.optionsBody}>
                                                
                        {productsToCreate.length > 1 
                            &&
                            <>
                                <div className={styles.line}>
                                    <label htmlFor="product-code" className={styles.label}>Código inicial:</label>
                                    <input id="product-code" tabIndex="22" type='text' className={styles.formInputExtraSmall} placeholder='000001'
                                        ref={inputRef}
                                        value={initialCode}
                                        onChange={onChangeInitialCode}
                                    />
                                </div>                    

                                <button disabled={initialCode.length === 6 ? false : true} type='button' tabIndex="23" className={kitStyles.generateBtn} onClick={() => generateCodes(productsToCreate.length)}>
                                    Gerar códigos
                                </button>
                            </>      
                        }
                        
                        {productsToCreate.length > 0
                            ?
                            productsToCreate.map((product) => 
                                <div className={kitStyles.optionsRow} key={product.variant}>
                                    <svg onClick={() => removeProduct(product.variant)} className={kitStyles.minusIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                    </svg>         
                                    <div className={styles.line}>     
                                        <input id="product-code" type='text' className={styles.formInputExtraSmall} placeholder='000001'
                                            ref={inputRef}
                                            value={product.code.slice(0,6)}
                                            onChange={(e) => changeCode('code', e.target.value, product.variant)}
                                        />
                                        
                                    </div>
                                    <div className={kitStyles.productCombination}>{product.variant}</div>
                                    <div className={kitStyles.productPrice}>{product.price} €</div>
                                </div>
                            )
                            :
                            ''
                        }    
                        {productsToCreate.length > 0
                            &&
                            <div className={styles.line}>
                                <label className={styles.label}>Variantes geradas: {productsToCreate.length}
                                    <svg onClick={() => setProductsToCreate([])} className={kitStyles.removeVariantsIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                        <path d="M576 64H205.26A63.97 63.97 0 0 0 160 82.75L9.37 233.37c-12.5 12.5-12.5 32.76 0 45.25L160 429.25c12 12 28.28 18.75 45.25 18.75H576c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm-84.69 254.06c6.25 6.25 6.25 16.38 0 22.63l-22.62 22.62c-6.25 6.25-16.38 6.25-22.63 0L384 301.25l-62.06 62.06c-6.25 6.25-16.38 6.25-22.63 0l-22.62-22.62c-6.25-6.25-6.25-16.38 0-22.63L338.75 256l-62.06-62.06c-6.25-6.25-6.25-16.38 0-22.63l22.62-22.62c6.25-6.25 16.38-6.25 22.63 0L384 210.75l62.06-62.06c6.25-6.25 16.38-6.25 22.63 0l22.62 22.62c6.25 6.25 6.25 16.38 0 22.63L429.25 256l62.06 62.06z" />
                                    </svg>
                                </label>
                            </div>                     
                        }
                        <div className={styles.line}>
                            <label htmlFor="product-variants" className={styles.label}>Variantes:</label>
                            <input id="product-variants" tabIndex="24" type='text' className={styles.formInput} placeholder='white, gold, black | 10ml, 20ml, 30ml'
                                ref={inputRef}
                                value={variants}
                                onChange={onChangeVariants}
                            />
                        </div>    
                        <div className={styles.line}>
                            <label htmlFor="products-price" className={styles.label}>Preço:</label>
                            <input id="products-price" tabIndex="25" type='text' className={styles.formInputExtraSmall} placeholder='0.00'
                                ref={inputRef}
                                value={productPrice}
                                onChange={onChangeProductPrice}
                            />
                        </div>
                            <button disabled={variants && productPrice ? false : true} tabIndex="26" className={kitStyles.generateBtn} onClick={handleGenerateClick} type='button'>
                                Gerar produtos
                            </button>    
                    </div>
                    
                }

                <button type='submit' tabIndex='27' className={styles.button}>
                    Criar um conjunto
                </button>
            </div>
        </form>
    );  
};

export default CreateKit;