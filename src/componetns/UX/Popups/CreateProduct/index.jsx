import axios from 'axios';
import React from 'react';
import styles from './CreateProduct.module.scss';
import { AuthContext } from '../../../../context';
import { useNavigate } from 'react-router-dom';
import { createProduct} from '../../../../http/productAPI';

const CreateProduct = () => {

    const inputRef = React.useRef();
    const navigate = useNavigate();

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
    const [code, setCode] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [promoPrice, setPromoPrice] = React.useState('');
    const [newProduct, setNewProduct] = React.useState(false);
    const { setCreateProductMode, serverDomain } = React.useContext(AuthContext);
    const [related, setRelated] = React.useState([]);
    const [info, setInfo] = React.useState([]);
    const [slide, setSlide] = React.useState([]);
    const [img, setImg] = React.useState(null);
    const [images, setImages] = React.useState([]);
    const [isLashes, setIsLashes] = React.useState(false);
    const [text, setText] = React.useState('');
    const [applying, setApplying] = React.useState('');
    const [compound, setCompound] = React.useState('');
    const [existingProduct, setExistingProduct] = React.useState('');
    const [productListLoading, setProductListLoading] = React.useState(true);

    React.useEffect(() => {
        setProductListLoading(true);
        if (code.length >= 6) {
            axios.get(`${serverDomain}api/product?limit=1000`)
            .then((res) => {
                setExistingProduct(res.data.rows.find(
                    (item) => String(item.code) === String(code)
                )); 
                setProductListLoading(false);
            });            
        }
    }, [serverDomain, code]);

    const success = () => {
        window.alert('Novo produtos adicionado com sucesso!');
        setCreateProductMode(false);  
        navigate('/auth');
        window.scrollTo(0, 0);  
    }

    const message = () => {
        window.alert('Ocorreu um erro!');        
    }

    const selectFile = (event) => {
        setImg(event.target.files[0]);
    }

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onChangeCode = (e) => {
        setCode(e.target.value.trim());
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

    const closeCreatePopup = () => {
        setCreateProductMode(false);
    }

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

    if (existingProduct) {
        window.alert('Já existe um produto com este código. A duplicação é proibida. Escolha outro código.');
        setCode('');
        setExistingProduct('');
    }

    const pushProduct = (e) => {
        e.preventDefault();
        if (price > +promoPrice) {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('code', code);
            formData.append('price', price);
            formData.append('discountPrice', promoPrice ? promoPrice : 0);
            formData.append('categoryId', categoryId);
            formData.append('brandId', brandId);
            formData.append('typeId', typeId);
            formData.append('img', img);
            formData.append('related', JSON.stringify(related));
            formData.append('info', JSON.stringify(info));
            formData.append('text', text);
            formData.append('newProduct', !newProduct);
            formData.append('applying', applying);            
            formData.append('compound', compound);            
            formData.append('isLashes', isLashes);
            formData.append('isPromo', promoPrice && +promoPrice > 0 ? true : false);
            images.forEach((file) => {
                formData.append('slide', file);
            });
            if (isLashes) {
                const firstResult = info.length ? info.find((i) => i.title.toLowerCase() === 'curvatura') : false;
                const secondResult = info.length ? info.find((i) => i.title.toLowerCase() === 'grossura') : false;
                const thirdResult = info.length ? info.find((i) => i.title.toLowerCase() === 'tamanho') : false;
                if (firstResult && secondResult && thirdResult) {
                    createProduct(formData).then(data => success()).catch(err => message());
                } else {
                    window.alert("Adicionar propriedades: 'Curvatura', 'Grossura', 'Tamanho'");
                }
            } else {
                createProduct(formData).then(data => success()).catch(err => message());                
            }
        } else {
            window.alert('O preço promocional deve ser inferior ao preço padrão.');
        }
    }

    return (
        <div className={styles.createProduct}>
            <svg onClick={closeCreatePopup} className={styles.close} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 352 512">
                <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
            </svg>
            <form onSubmit={pushProduct} className={styles.formProduct}>
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
                <div className={styles.line}>
                    <label htmlFor="product-code" className={styles.label}>Código:</label>
                    <input id="product-code" required tabIndex="4" type='text' className={styles.formInputSmall}
                        ref={inputRef}
                        value={code}
                        onChange={onChangeCode}
                    /> 
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
                <label htmlFor="product-about" className={styles.label}>Descrição:</label>
                <textarea required id="product-about" tabIndex='19' className={styles.textarea}
                    ref={inputRef}
                    value={text}
                    onChange={onChangeText} />
                <label htmlFor="product-applying" className={styles.label}>Método de uso:</label>
                <textarea id="product-applying" tabIndex='20' className={styles.textarea}
                    ref={inputRef}
                    value={applying}
                    onChange={onChangeApplying} />
                <label htmlFor="product-compound" className={styles.label}>Ingredientes:</label>
                <textarea id="product-compound" tabIndex='21' className={styles.textarea}
                    ref={inputRef}
                    value={compound}
                    onChange={onChangeCompound}/>
                <button disabled={existingProduct ? true : false} type='submit' tabIndex='22' className={styles.button}>
                    Criar produto
                </button>
            </form>            
        </div>
    );
};

export default CreateProduct;