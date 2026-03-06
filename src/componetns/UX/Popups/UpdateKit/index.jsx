import React from 'react';
import styles from '../UpdateProduct/UpdateProduct.module.scss';
import kitStyles from './UpdateKit.module.scss';
import axios from 'axios';
import { AuthContext } from '../../../../context';
import { updateKit, createProduct, updateProduct } from '../../../../http/productAPI';
import debounce from 'lodash.debounce';

const UpdateKit = () => {

    const inputRef = React.useRef();
    const textRef = React.useRef(null);
    const applyingRef = React.useRef(null);
    const compoundRef = React.useRef(null);

    const [brands, setBrands] = React.useState([]);
    const [types, setTypes] = React.useState([]);

    const [kitSlides, setKitSlides] = React.useState([]);
    
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
    const [productPrice, setProductPrice] = React.useState('');
    const [newPrice, setNewPrice] = React.useState('');
    const [promoPrice, setPromoPrice] = React.useState('');

    const [priceMsg, setPriceMsg] = React.useState(false);

    const [newProduct, setNewProduct] = React.useState(false);
    const { setKitEditingMenu, setUpdateProductMode, setKitEditing, serverDomain, imagesCloud } = React.useContext(AuthContext);
    const [img, setImg] = React.useState(null);
    const [kitImg, setKitImg] = React.useState('');
    const [isLashes, setIsLashes] = React.useState(false);

    const [variants, setVariants] = React.useState('');
    const [optionsList, setOptionsList] = React.useState('');
    const [initialCode, setInitialCode] = React.useState('');
    const [productsToCreate, setProductsToCreate] = React.useState([]);
    const [productsToUpdate, setProductsToUpdate] = React.useState([]);
    const [kitProducts, setKitProducts] = React.useState([]);

    const [showKitOpions, setShowKitOptions] = React.useState(false);
    const [showProductsMenu, setShowProductsMenu] = React.useState(false);
    const [showEditProductsMenu, setShowEditProductsMenu] = React.useState(false);

    const [related, setRelated] = React.useState([]);
    const [info, setInfo] = React.useState([]);
    const [slide, setSlide] = React.useState([]);
    const [images, setImages] = React.useState([]);
    const [text, setText] = React.useState('');
    const [applying, setApplying] = React.useState('');
    const [compound, setCompound] = React.useState('');

    const [deletedSlideId, setDeletedSlideId] = React.useState([]);
    
    const [visibleDescription, setVisibleDescription] = React.useState(true);
    const [visibleApplying, setVisibleApplying] = React.useState(false);
    const [visibleCompound, setVisibleCompound] = React.useState(false);

    const [successfullyCreated, setSuccessfullyCreated] = React.useState([]);
    const [failedToCreate, setFailedToCreate] = React.useState([]);

    const [successfullyUpdated, setSuccessfullyUpdated] = React.useState([]);
    const [failedToUpdate, setFailedToUpdate] = React.useState([]);

    const [activeField, setActiveField] = React.useState('text');
    const [selectedColor, setSelectedColor] = React.useState('#000000');
    
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

    const onChangeNewPrice = (e) => {
        setNewPrice(e.target.value.trim());
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
        const searchParams = kitSearchValue ? `?name=${kitSearchValue}` : '';
        axios.get(`${serverDomain}api/kit${searchParams}`)
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
        if (kitId) {
            axios.get(`${serverDomain}api/product?limit=1000&kitId=${kitId}`)
                .then((res) => {
                    const sortedProducts = [...res.data.rows].sort((a, b) => {
                        const codeA = String(a.code);
                        const codeB = String(b.code);
                        return codeA.localeCompare(codeB);
                    });
                    setKitProducts(sortedProducts);
                });            
        }
    }, [serverDomain, kitId]);

    React.useEffect(() => {
        if (kitId > 0 && kits.length > 0) {
            const selectedKit = kits.find((kit) => kit.id === kitId);
            setBrandId(selectedKit.brandId);
            setTypeId(selectedKit.typeId);
            setName(selectedKit.name);
            setPrice(selectedKit.price ? selectedKit.price : '');
            setPromoPrice(selectedKit.discountPrice ? selectedKit.discountPrice : '');
            if (selectedKit.newProduct) {
                setNewProduct(false);
            } else {
                setNewProduct(true);
            }
            if (selectedKit.variantsList) {
                setOptionsList(selectedKit.variantsList);
            } else {
                setOptionsList('');
            }
            setKitImg(selectedKit.img);
            setKitSlides(selectedKit.slide);
            const kitBrandName = brands.find((brand) => brand.id == selectedKit.brandId).name;
            setBrandName(kitBrandName);
            const kitTypeName = types.find((type) => type.id == selectedKit.typeId).name;
            setTypeName(kitTypeName);
            if (selectedKit.text.length > 0) {
                setText(selectedKit.text[0].text);                
            } else {
                setText('');
            }
            if (selectedKit.applying.length > 0) {
                setApplying(selectedKit.applying[0].text);                
            } else {
                setApplying('');
            }
            if (selectedKit.compound.length > 0) {
                setCompound(selectedKit.compound[0].text);                
            } else {
                setCompound('');
            }
            setInfo(selectedKit.info ? selectedKit.info : []);
            setRelated(selectedKit.related ? selectedKit.related : []);
            setProductsToUpdate([]);
            setNewPrice('');
                    console.log(selectedKit);
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

    const success = () => {
        window.alert('Conjunto alterado com sucesso!');

        if (productsToUpdate.length > 0 && kitId) {
            productsToUpdate.forEach((productToUpdate) => {
                const formUpdateData = new FormData();
                formUpdateData.set('price', newPrice);
                updateProduct(formUpdateData, productToUpdate.id).then(data => setSuccessfullyUpdated([...successfullyUpdated, productToUpdate.code])).catch(err => setFailedToUpdate([...failedToUpdate, productToUpdate.code]));
            });
        }
        if (productsToCreate.length > 0 && kitId) {
            productsToCreate.forEach((product) => {
                const formCreateData = new FormData(); 
                formCreateData.append('name', product.name);
                formCreateData.append('code', product.code);
                formCreateData.append('price', product.price);
                formCreateData.append('discountPrice', promoPrice ? promoPrice : 0);
                formCreateData.append('categoryId', categoryId);
                formCreateData.append('brandId', brandId);
                formCreateData.append('typeId', typeId);
                if (kitImg) {
                    formCreateData.append('kitImg', kitImg);
                }
                if (img) {
                    formCreateData.append('img', img);
                }
                formCreateData.append('related', JSON.stringify(related));
                formCreateData.append('info', JSON.stringify(info));
                formCreateData.append('text', text);
                formCreateData.append('newProduct', !newProduct);
                formCreateData.append('applying', applying);            
                formCreateData.append('compound', compound);            
                formCreateData.append('isLashes', isLashes);
                formCreateData.append('kitId', kitId);
                formCreateData.append('variant', product.variant);
                formCreateData.append('isPromo', promoPrice && +promoPrice > 0 ? true : false);
                if (images.length > 0) {
                    images.forEach((file) => {
                        formCreateData.append('slide', file);
                    });
                }
                if (kitSlides.length > 0) {
                    kitSlides.forEach((slide) => {
                        formCreateData.append('kitSlide', slide);
                    });
                }
                createProduct(formCreateData).then(data => setSuccessfullyCreated([...successfullyCreated, product.code])).catch(err => setFailedToCreate([...failedToCreate, product.code]));
            });
        }
        //showListMsg();            
        setKitEditing(false);
        setKitEditingMenu(false);
        setKitId('');
        setUpdateProductMode(false);
    }

    const showListMsg = () => {
        if (productsToCreate.length > 0) {
            window.alert(`Criado com sucesso: ${successfullyCreated.length > 0 ? successfullyCreated : 0}. 
                Erro de criação: ${failedToCreate.length > 0 ? failedToCreate : 0}.
                `);
            setProductsToCreate([]);
            setSuccessfullyCreated([]);
            setFailedToCreate([]);            
        }
        if (productsToUpdate.length > 0) {
            window.alert(`Atualizado com sucesso: ${successfullyUpdated.length > 0 ? successfullyUpdated : 0}. 
                Erro de atualização: ${failedToUpdate.length > 0 ? failedToUpdate : 0}.
                `);
            setProductsToUpdate([]);
            setSuccessfullyUpdated([]);
            setFailedToUpdate([]);            
        }
    }

    const message = () => {
        window.alert('Ocorreu um erro!');        
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
                        name: name + ' ' + current.join(','),
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
            for (let i = 1; i < initialCode.length; i++) {
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
                    let newZeroCount = 5 - newNumberLength;
                    let prefix = initialCode[0];
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

    const clearKitValue = () => {
        setKitValue('');
        setKitSearchValue('');
    };

    const selectOneProduct = (kitProduct) => {
        if (newPrice) {
            const result = productsToUpdate.find((selectedProduct) => selectedProduct.id == kitProduct.id);
            if (!result) {
                setProductsToUpdate([...productsToUpdate, { ...kitProduct, price: newPrice }]);
            } else {
                const updatedActiveProducts = productsToUpdate.filter((activeProduct) => activeProduct.id != kitProduct.id);
                setProductsToUpdate(updatedActiveProducts);
            }            
        } else {
            setPriceMsg(true);
        }
    };

    const selectAllProducts = () => {
        if (newPrice) {
            let arrayWithNewPrices = [];
            kitProducts.forEach((kitProduct) => {
                arrayWithNewPrices = [...arrayWithNewPrices, {...kitProduct, price: newPrice}]
            });
            setProductsToUpdate(arrayWithNewPrices);            
        } else {
            setPriceMsg(true);
        }
    };

    const removeAllSelected = () => {
        setProductsToUpdate([]);
    };

    const removeImage = (id) => {
        setKitSlides(kitSlides.filter((s) => s.id !== id));
        setDeletedSlideId([...deletedSlideId, id]);
    }

    const changeKit = (e) => {
        e.preventDefault();
        if (kitId && kits.length > 0) {        
            const formData = new FormData();
            formData.set('name', name);
            formData.set('variantsList', optionsList);
            formData.set('brandId', brandId);
            formData.set('typeId', typeId);   
            formData.set('isLashes', isLashes);
            formData.set('categoryId', categoryId);
            formData.set('isPromo', promoPrice && +promoPrice > 0 ? true : false);
            if (price) {
                formData.set('price', price);                        
            }
            if (promoPrice) {
                formData.set('discountPrice', promoPrice);   
            }
            if (deletedSlideId) {
                formData.append('deletedSlideId', JSON.stringify(deletedSlideId));            
            }
            if (img) {
                formData.set('img', img);       
            }     
            formData.set('newProduct', !newProduct);
            
            formData.set('related', JSON.stringify(related));
            formData.set('info', JSON.stringify(info));
            formData.set('text', text);
            formData.set('applying', applying);            
            formData.set('compound', compound);  
            
            images.forEach((file) => {
                formData.append('slide', file);
            });

            updateKit(formData, kitId).then(data => success()).catch(err => message());            
        }
    };

    return (

        <form onSubmit={changeKit} className={styles.formProduct}>
            <div className={kitStyles.updateKitWrapper}>
                <div className={styles.line}>
                    <span className={styles.label}>Conjunto:</span>
                    <div onClick={toggleKitOptions} required tabIndex="1" className={kitStyles.formSelectKit}>
                        {kitName.length > 23 ? kitName.slice(0,22) + '...' : kitName}
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                            <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                        </svg>
                    </div>
                    {kitsVisibility ?
                        <div className={kitStyles.kitOptions}>
                            {
                                <input id="kit-search" type='text' className={kitStyles.kitSearchInput}
                                    ref={inputRef}
                                    value={kitValue}
                                    onChange={onChangeKitValue}
                                    placeholder={`Procure um conjunto...`}
                                />
                            }
                            {
                                kitValue
                                &&
                                <svg className={kitStyles.deleteIcon} onClick={clearKitValue} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                    <path d="M576 64H205.26A63.97 63.97 0 0 0 160 82.75L9.37 233.37c-12.5 12.5-12.5 32.76 0 45.25L160 429.25c12 12 28.28 18.75 45.25 18.75H576c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm-84.69 254.06c6.25 6.25 6.25 16.38 0 22.63l-22.62 22.62c-6.25 6.25-16.38 6.25-22.63 0L384 301.25l-62.06 62.06c-6.25 6.25-16.38 6.25-22.63 0l-22.62-22.62c-6.25-6.25-6.25-16.38 0-22.63L338.75 256l-62.06-62.06c-6.25-6.25-6.25-16.38 0-22.63l22.62-22.62c6.25-6.25 16.38-6.25 22.63 0L384 210.75l62.06-62.06c6.25-6.25 16.38-6.25 22.63 0l22.62 22.62c6.25 6.25 6.25 16.38 0 22.63L429.25 256l62.06 62.06z" />
                                </svg>                                
                            }
                            
                            <div className={kitStyles.optionsWrapper}>
                                {kits.length > 0 ? kits.map((kit) =>
                                    <div key={kit.name} value={kit.id} onClick={() => hideKitOptions(kit.id, kit.name)} className={styles.option}>{kit.name}</div>
                                ) : <span className={styles.listMsg}>{kitSearchValue ? 'Não encontrado' : 'Nenhuma lista disponível'}</span>}
                            </div>
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
                                    <div className={kitStyles.optionsWrapper}>
                                        {brands ? brands.map((brand) =>
                                            <div key={brand.name} value={brand.id} onClick={() => hideBrandOptions(brand.id, brand.name)} className={styles.option}>{brand.name}</div>
                                        ) : ""}
                                    </div>
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
                                    <div className={kitStyles.optionsWrapper}>
                                        {types ? types.map((type) =>
                                            <div key={type.name} onClick={() => hideTypeOptions(type.id, type.name)} value={type.name} className={styles.option}>{type.name}</div>
                                        ) : ''}
                                    </div>
                                </div>
                                : ""
                            }
                        </div>
                        <div className={styles.line}>
                            <label htmlFor="kit-name" className={styles.label}>Nome:</label>
                            <input id="kit-name" required tabIndex="4" type='text' placeholder='Definir nome' className={styles.formInput}
                                ref={inputRef}
                                value={name}
                                onChange={onChangeName}
                            />
                        </div>
                        <div className={styles.line}>
                            <label htmlFor="kit-options-list" className={styles.label}>Opções:</label>
                                <input id="kit-options-list" tabIndex="5" type='text' className={styles.formInput} placeholder='white, gold, black | 10ml, 20ml, 30ml'
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
                                    <label htmlFor="product-price" className={styles.label}>Preço:</label>
                                    <input id="product-price" tabIndex="6" type='text' className={styles.formInputExtraSmall} placeholder='0.00'
                                        ref={inputRef}
                                        value={price}
                                        onChange={onChangePrice}
                                    />
                                    <label htmlFor="product-promo-price" className={styles.label}>Preço promocional:</label>
                                    <input id="product-promo-price" tabIndex="7" type='text' className={styles.formInputExtraSmall} placeholder='0.00'
                                        ref={inputRef}
                                        value={promoPrice}
                                        onChange={onChangePromoPrice}
                                    />
                                </div>
                                <div className={styles.formLineCheckbox}>
                                    <label onClick={checkedNewProduct} htmlFor="newProductCheckbox" className={newProduct ? styles.formLabelChecked : styles.formLabelCheckbox}>
                                        Não exibir em novos itens:
                                    </label>
                                    <input id="newProductCheckbox" type="checkbox" tabIndex="8" name="new-product" className={styles.formInputCheckbox} />
                                </div>
                                <div className={styles.fotoLine}>
                                    <label htmlFor="product-file" className={styles.label}>Foto:</label>
                                    <input id="product-file" tabIndex="9" type='file' name='image' className={styles.formFile}
                                        onChange={selectFile}
                                    />
                                </div>

                                {related.map((i) =>
                                    <div className={styles.line} key={i.number}>
                                        <label htmlFor="info-product_title" className={styles.label}>
                                            Código de produto adicional:
                                        </label>
                                        <input required id="info-product_title" tabIndex="10" type='text' className={styles.formInputSmall}
                                            value={i.referenceCode}
                                            onChange={(e) => changeRelated('referenceCode', e.target.value, i.number)}
                                        />
                                        <button type='button' tabIndex='11' className='info-product__remove' onClick={() => removeRelated(i.number)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                                <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                                <button type='button' className={styles.relatedButton} tabIndex="12" onClick={addRelated}>Anexar produto</button>
            
                                {info.map((i) =>
                                    <div className={styles.line} key={i.number}>
                                        <label htmlFor="info-product_title" className={styles.label}>Propriedade:</label>
                                        <input required id="info-product_title" tabIndex="13" type='text' className={styles.formInputSmall}
                                            value={i.title}
                                            onChange={(e) => changeInfo('title', e.target.value, i.number)}
                                        />
                                        <label htmlFor="info-product_description" className={styles.label}>Significado:</label>
                                        <input required id="info-product_description" tabIndex="14" type='text' className={styles.formInputSmall}
                                            value={i.description}
                                            onChange={(e) => changeInfo('description', e.target.value, i.number)}
                                        />
                                        <button type='button' tabIndex='15' className='info-product__remove' onClick={() => removeInfo(i.number)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                                <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                                <button type='button' className={styles.infoButton} tabIndex="16" onClick={addInfo}>Adicionar informações</button>
                                
                                <div className={styles.lineImg}>                
                                    {kitSlides ? 
                                        kitSlides.map((s) => 
                                            <div key={s.id} className={styles.imgBox}> 
                                                <img src={ s.slideImg ? `${imagesCloud}` + s.slideImg : ''} alt='slide'/>  
                                                <svg onClick={() => removeImage(s.id)} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                                    <path d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z" />
                                                </svg>
                                            </div>
                                        )
                                        :
                                        ""
                                    }
                                </div>
                                {slide.map((i) =>
                                    <div className={styles.line} key={i.number}>
                                        <label htmlFor="product-slide" className={styles.label}>Slide:</label>
                                        <input id="product-slide" tabIndex="17" type='file' name='slide' className={styles.formFile}
                                            onChange={(e) => changeSlide('slideImg', e.target.files[0], i.number)}
                                        />
                                        <button type='button' tabIndex='18' className='slide-product__remove' onClick={() => removeSlide(i.number)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                                <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                                <button type='button' className={styles.slideButton} tabIndex="19" onClick={addSlide}>Adicionar novo slide</button>
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
            
                                    <textarea hidden={visibleDescription ? false : true} required id="product-about" tabIndex='20' className={styles.textarea}
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
                                    <textarea hidden={visibleApplying ? false : true} id="product-applying" tabIndex='21' className={styles.textarea}
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
            
                                    <textarea hidden={visibleCompound ? false : true} id="product-compound" tabIndex='22' className={styles.textarea}
                                        ref={compoundRef}
                                        value={compound}
                                        onChange={onChangeCompound}
                                        onFocus={() => setActiveField('compound')}
                                    />
                                </div>
                            </div>
                        }

                        <div onClick={() => setShowEditProductsMenu(showEditProductsMenu ? false : true)} className={styles.line}>
                            <span className={kitStyles.optionsTitle}>
                                Editar produtos
                                <svg className={showEditProductsMenu ? kitStyles.optionsTitleIconActive : kitStyles.optionsTitleIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                                </svg>                    
                            </span>
                        </div>

                        {
                            showEditProductsMenu 
                            ?
                            <div>
                                {kitProducts.length > 0
                                    &&
                                    <>
                                        <div className={styles.line}>
                                            <label htmlFor="products-new-price" className={styles.label}>Novo preço:</label>
                                            <input id="products-new-price" tabIndex="23" type='text' className={styles.formInputExtraSmall} placeholder='0.00'
                                                ref={inputRef}
                                                value={newPrice}
                                                onChange={onChangeNewPrice}
                                                onFocus={() => setPriceMsg(false)}
                                            />
                                        </div>
                                        {
                                            priceMsg &&
                                            <div className={styles.line}>
                                                <span className={kitStyles.priceMsgWarn}>Por favor, indique o preço primeiro!</span>
                                            </div>                                            
                                        }
                                        <div className={kitStyles.line}>
                                            <div className={styles.label}>
                                                Selecione produtos:
                                            </div>                                          
                                        </div>
        
                                        <ul className={kitStyles.kitProductsList}>
                                            {kitProducts.length !== productsToUpdate.length
                                                &&
                                                <li className={kitStyles.kitProductRow} onClick={selectAllProducts}>Selecionar tudo</li>
                                            }
                                            {kitProducts.length > 0
                                                ?
                                                kitProducts.map((product) => 
                                                    <li className={productsToUpdate.map((i) => i.id).includes(product.id) ? kitStyles.kitProductRowActive : kitStyles.kitProductRow} key={product.variant} onClick={() => selectOneProduct(product)}>       
                                                        <div className={kitStyles.infoWrapper}>
                                                            <div className={kitStyles.productCode}>     
                                                                {product.code}
                                                            </div>
                                                            <div className={kitStyles.productCombination}>{product.variant}</div>
                                                            <div className={kitStyles.productPrice}>{product.price} €</div>                                                            
                                                        </div>
                                                    </li>
                                                )
                                                :
                                                ''
                                            }
                                        </ul>
                                    </>
                                }
                                {productsToUpdate.length > 0
                                    ? 
                                    <>
                                        <div className={styles.line}>
                                            <div className={styles.label}>
                                                Lista de atualizados:
                                            </div>                                          
                                        </div>    
                                        <ul className={kitStyles.kitProductsList}>    
                                            <li className={kitStyles.kitProductRow} onClick={removeAllSelected}>Limpar tudo</li>
                                            {productsToUpdate.length > 0
                                                ?
                                                productsToUpdate.map((product) => 
                                                    <li className={kitStyles.kitProductRow} key={product.variant}>
                                                        <div className={kitStyles.infoWrapper}>
                                                            <svg className={kitStyles.removeSelectedIcon} onClick={() => selectOneProduct(product)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                                                <path d="M96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320z" />
                                                            </svg>                                                        
                                                            <div className={kitStyles.productCode}>     
                                                                {product.code}
                                                            </div>
                                                            <div className={kitStyles.productCombination}>{product.variant}</div>    
                                                        </div>
                                                        <div className={kitStyles.productPrice}>{product.price} €</div>
                                                    </li>
                                                )
                                                :
                                                ''
                                            }
                                        </ul>
                                    </>
                                    :
                                    ''
                                }    
                                 
                            </div>
                            :
                            ''
                        }                        

                        <div onClick={() => setShowProductsMenu(showProductsMenu ? false : true)} className={styles.line}>
                            <span className={kitStyles.optionsTitle}>
                                Adicionar produtos
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
                                            <input id="product-code" tabIndex="24" type='text' className={styles.formInputExtraSmall} placeholder='900001'
                                                ref={inputRef}
                                                value={initialCode}
                                                onChange={onChangeInitialCode}
                                            />
                                        </div>                    
            
                                        <button disabled={initialCode.length === 6 ? false : true} type='button' tabIndex="25" className={kitStyles.generateBtn} onClick={() => generateCodes(productsToCreate.length)}>
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
                                                <input id="product-code" type='text' className={styles.formInputExtraSmall} placeholder='900001'
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
                                    <div className={kitStyles.removeLine}>
                                        <label className={styles.label}>Variantes geradas: {productsToCreate.length}
                                        </label>
                                        <svg onClick={() => setProductsToCreate([])} className={kitStyles.removeVariantsIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                            <path d="M576 64H205.26A63.97 63.97 0 0 0 160 82.75L9.37 233.37c-12.5 12.5-12.5 32.76 0 45.25L160 429.25c12 12 28.28 18.75 45.25 18.75H576c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm-84.69 254.06c6.25 6.25 6.25 16.38 0 22.63l-22.62 22.62c-6.25 6.25-16.38 6.25-22.63 0L384 301.25l-62.06 62.06c-6.25 6.25-16.38 6.25-22.63 0l-22.62-22.62c-6.25-6.25-6.25-16.38 0-22.63L338.75 256l-62.06-62.06c-6.25-6.25-6.25-16.38 0-22.63l22.62-22.62c6.25-6.25 16.38-6.25 22.63 0L384 210.75l62.06-62.06c6.25-6.25 16.38-6.25 22.63 0l22.62 22.62c6.25 6.25 6.25 16.38 0 22.63L429.25 256l62.06 62.06z" />
                                        </svg>                                        
                                    </div>                     
                                }
                                <div className={styles.line}>
                                    <label htmlFor="product-variants" className={styles.label}>Variantes:</label>
                                    <input id="product-variants" tabIndex="26" type='text' className={styles.formInput} placeholder='white, gold, black | 10ml, 20ml, 30ml'
                                        ref={inputRef}
                                        value={variants}
                                        onChange={onChangeVariants}
                                    />
                                </div>    
                                <div className={styles.line}>
                                    <label htmlFor="products-price" className={styles.label}>Preço:</label>
                                    <input id="products-price" tabIndex="27" type='text' className={styles.formInputExtraSmall} placeholder='0.00'
                                        ref={inputRef}
                                        value={productPrice}
                                        onChange={onChangeProductPrice}
                                    />
                                </div>
                                    <button disabled={variants && productPrice ? false : true} tabIndex="28" className={kitStyles.generateBtn} onClick={handleGenerateClick} type='button'>
                                        Gerar produtos
                                    </button>    
                            </div>
                            
                        }

                        <button type='submit' tabIndex='29' className={styles.button}>
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