import axios from 'axios';
import React from 'react';
import styles from './UpdateProduct.module.scss';
import { AuthContext } from '../../../../context';
import { useNavigate } from 'react-router-dom';
import { updateProduct} from '../../../../http/productAPI';

const UpdateProduct = ({id, obj}) => {

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
    const [price, setPrice] = React.useState(0);
    const [promoPrice, setPromoPrice] = React.useState(0);
    const { setUpdateProductMode, serverDomain, imagesCloud, setProductUpdated } = React.useContext(AuthContext);
    const [info, setInfo] = React.useState([]);
    const [slide, setSlide] = React.useState([]);
    const [objSlides, setObjSlides] = React.useState([]);
    const [img, setImg] = React.useState(null);
    const [images, setImages] = React.useState([]);
    const [isLashes, setIsLashes] = React.useState(false);
    const [text, setText] = React.useState('');
    const [applying, setApplying] = React.useState('');
    const [compound, setCompound] = React.useState('');
    const [deletedSlideId, setDeletedSlideId] = React.useState([]);
    const [checkedAvailable, setCheckedAvailable] = React.useState(true);
    const [checkedTop, setCheckedTop] = React.useState(false);
    const [checkedExclusive, setCheckedExclusive] = React.useState(false);
    const [isPromo, setIsPromo] = React.useState(false);

    React.useEffect(() => {
        setName(obj.name);
        setCode(obj.code);
        setPrice(obj.price);
        setPromoPrice(obj.discountPrice ? obj.discountPrice : promoPrice);
        setTypeId(obj.typeId);
        setCategoryId(obj.categoryId ? obj.categoryId : 0);
        setBrandId(obj.brandId);
        setIsLashes(obj.isLashes);
        setText(obj.text[0] ? obj.text[0].text : '');
        setApplying(obj.applying[0] ? obj.applying[0].text : '');
        setCompound(obj.compound[0] ? obj.compound[0].text : '');
        setInfo(obj.info ? obj.info : []);
        setImg(obj.img);
        setObjSlides(obj.slide);
        setCheckedAvailable(obj.available);
        setCheckedTop(obj.topProduct);
        setCheckedExclusive(obj.exclusiveProduct);
        setIsPromo(obj.isPromo);
        const brand = brands.find(brand => brand.id === obj.brandId);
        if (brand) {
            setBrandName(brand.name);            
        }
        const type = types.find(type => type.id === obj.typeId);
        if (type) {
            setTypeName(type.name);            
        } 
    }, [obj, brands, types]);

    const success = () => {
        window.alert('Dados do produto atualizados com sucesso!');
        setUpdateProductMode(false);  
        setProductUpdated(obj.code);
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

    const onChangeText = (e) => {
        setText(e.target.value);
    }

    const onChangeApplying = (e) => {
        setApplying(e.target.value);
    }

    const onChangeCompound = (e) => {
        setCompound(e.target.value);
    }

    const addInfo = () => {
        setInfo([...info, { title: "", description: "", id: Date.now() }]);
    }

    const removeInfo = (id) => {
        setInfo(info.filter(i => i.id !== id));
    }

    const changeInfo = (key, value, id) => {
        setInfo(info.map(i => i.id === id ? { ...i, [key]: value } : i));
    }

    const addSlide = () => {
        setSlide([...slide, { slideImg: '', id: Date.now() }]);
    }

    const removeSlide = (id) => {
        setSlide(slide.filter(i => i.id !== id));
    }

    const changeSlide = (key, value, id) => {
        setSlide(slide.map(i => i.id === id ? { ...i, [key]: value } : i));
    }

    React.useEffect(() => {
        let slideFiles = slide.map((s) => s.slideImg);
        setImages(slideFiles);
    }, [slide]);

    const closeUpdatePopup = () => {
        setUpdateProductMode(false);
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
        if (typeId && types.length) {
            const currentType = types.find((type) => type.id === typeId);
            const id = currentType.categoryId;
            setCategoryId(id);
        }
    }, [typeId, types]); 

    React.useEffect(() => {

    }, [info]);

    const updateProductItem = (e) => {
        e.preventDefault();

        if (price > +promoPrice) {
            const formData = new FormData();
            formData.set('name', name);
            formData.set('code', code);
            formData.set('price', price);
            formData.set('discountPrice', promoPrice === '' ? 0 : promoPrice);
            formData.append('categoryId', categoryId);
            formData.set('brandId', brandId);
            formData.set('typeId', typeId);
            formData.set('text', text);
            formData.append('applying', applying);            
            formData.append('compound', compound);  
            formData.append('isLashes', isLashes);
            formData.append('available', checkedAvailable);
            formData.append('topProduct', checkedTop);
            formData.append('exclusiveProduct', checkedExclusive);
            formData.append('isPromo', promoPrice && +promoPrice > 0 ? true : false);
            if (deletedSlideId) {
                formData.append('deletedSlideId', JSON.stringify(deletedSlideId));            
            }
            if (img) {
                formData.set('img', img);               
            }
            formData.set('info', JSON.stringify(info));
            images.forEach((file) => {
                formData.append('slide', file);
            });       
            if (isLashes) {
                const firstResult = info.length ? info.find((i) => i.title.toLowerCase() === 'curvatura') : false;
                const secondResult = info.length ? info.find((i) => i.title.toLowerCase() === 'grossura') : false;
                const thirdResult = info.length ? info.find((i) => i.title.toLowerCase() === 'tamanho') : false;
                if (firstResult && secondResult && thirdResult) {
                    updateProduct(formData, id).then(data => success()).catch(err => message());
                } else {
                    if (!firstResult) {
                        window.alert("Propriedade de 'Curvatura' ausente.");
                    }
                    if (!secondResult) {
                        window.alert("Propriedade de 'Grossura' ausente.");
                    }
                    if (!thirdResult) {
                        window.alert("Propriedade de 'Tamanho' ausente.");
                    }
                }
            } else {
                updateProduct(formData, id).then(data => success()).catch(err => message());                
            }
        } else {
            window.alert('O preço promocional deve ser inferior ao preço padrão.');
        }
    }

    const removeImage = (id) => {
        setObjSlides(objSlides.filter((s) => s.id !== id));
        setDeletedSlideId([...deletedSlideId, id]);
    }

    const checkedCheckboxAvailable = () => {
        if (!checkedAvailable) {
            setCheckedAvailable(true);
        } else {
            setCheckedAvailable(false);            
        }
    }

    const checkedCheckboxTop = () => {
        if (!checkedTop) {
            setCheckedTop(true);
            setCheckedExclusive(false); 
        } else {
            setCheckedTop(false);            
        }
    }

    const checkedCheckboxExclusive = () => {
        if (!checkedExclusive) {
            setCheckedExclusive(true);
            setCheckedTop(false); 
        } else {
            setCheckedExclusive(false);            
        }
    }

    return (
        <div className={styles.updateProduct}>
            <svg onClick={closeUpdatePopup} className={styles.close} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 352 512">
                <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
            </svg>
            <form onSubmit={updateProductItem} className={styles.formProduct}>
                <div className={styles.checkboxes}>
                    <div className={styles.formLineCheckbox}>
                        <label onClick={checkedCheckboxAvailable} htmlFor="availableCheckbox" className={checkedAvailable ? styles.formLabelChecked : styles.formLabelCheckbox}>
                            Disponível:
                        </label>
                        <input id="availableCheckbox" type="checkbox" name="agree" className={styles.formInputCheckbox} /> 
                    </div>     
                    <div className={styles.formLineCheckbox}>
                        <label onClick={checkedCheckboxTop} htmlFor="topCheckbox" className={checkedTop ? styles.formLabelChecked : styles.formLabelCheckbox}>
                            Best-seller:
                        </label>
                        <input id="topCheckbox" type="checkbox" name="top" className={styles.formInputCheckbox} /> 
                    </div>   
                    <div className={styles.formLineCheckbox}>
                        <label onClick={checkedCheckboxExclusive} htmlFor="exclusiveCheckbox" className={checkedExclusive ? styles.formLabelChecked : styles.formLabelCheckbox}>
                            Exclusive:
                        </label>
                        <input id="exclusiveCheckbox" type="checkbox" name="exclusive" className={styles.formInputCheckbox} /> 
                    </div>
                </div>
                <div className={styles.line}>
                    <label htmlFor="product-name" className={styles.label}>Nome:</label>
                    <input id="product-name" required tabIndex="1" type='text' className={styles.formInput}
                        ref={inputRef}
                        value={name}
                        onChange={onChangeName}
                    />                    
                </div>
                <div className={styles.line}>
                    <label htmlFor="product-code" className={styles.label}>Código:</label>
                    <input id="product-code" required tabIndex="2" type='text' className={styles.formInputSmall}
                        ref={inputRef}
                        value={code}
                        onChange={onChangeCode}
                    /> 
                    <label htmlFor="product-price" className={styles.label}>Preço:</label>                    
                    <input id="product-price" required tabIndex="3" type='text' className={styles.formInputSmall}
                        ref={inputRef}
                        value={price}
                        onChange={onChangePrice}
                    />
                </div>
                <div className={styles.line}>
                    <label htmlFor="product-promo-price" className={styles.label}>Preço promocional:</label>                    
                    <input id="product-promo-price" tabIndex="4" type='text' className={styles.formInputSmall} placeholder='0.00'
                        ref={inputRef}
                        value={promoPrice}
                        onChange={onChangePromoPrice}
                    />
                </div>
                <div className={styles.line}>
                    <span className={styles.label}>Marca:</span>
                    <div onClick={toggleBrandOptions} required tabIndex="5" className={styles.formSelectBrands}>
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
                    <div onClick={toggleTypeOptions} required tabIndex="6" className={styles.formSelectTypes}>
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
                    <label htmlFor="product-file" className={styles.label}>Foto:</label>
                    <input id="product-file" tabIndex="7" type='file' className={styles.formFile}
                        onChange={selectFile}
                    />                    
                </div>
                {info.map((i) => 
                    <div className={styles.line} key={i.id}>
                        <label htmlFor={'info-product_title' + i.id} className={styles.label}>Propriedade:</label>
                        <input required id={'info-product_title' + i.id} tabIndex="8" type='text' className={styles.formInputSmall}
                            value={i.title}
                            onChange={(e) => changeInfo('title', e.target.value, i.id)}
                        /> 
                        <label htmlFor={'info-product_description' + i.id } className={styles.label}>=</label>
                        <input required id={'info-product_description' + i.id } tabIndex="9" type='text' className={styles.formInputSmall}
                            value={i.description}
                            onChange={(e) => changeInfo('description', e.target.value, i.id)}
                        />
                        <button type='button' tabIndex='9' className='info-product__remove' onClick={() => removeInfo(i.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                            </svg>                                     
                        </button>
                    </div>                    
                )}
                <button type='button' className={styles.infoButton} tabIndex="11" onClick={addInfo}>Adicionar informações</button>
                <div className={styles.lineImg}>                
                {objSlides ? 
                    objSlides.map((s) => 
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
                    <div className={styles.line} key={i.id}>
                        <label htmlFor="product-slide" className={styles.label}>Slide:</label>
                        <input id="product-slide" tabIndex="12" type='file' className={styles.formFile}
                            onChange={(e) => changeSlide('slideImg', e.target.files[0], i.id)}
                        />
                        <button type='button' tabIndex='13' className='slide-product__remove' onClick={() => removeSlide(i.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                            </svg>                                     
                        </button>
                    </div>                
                )}
                <button type='button' className={styles.slideButton} tabIndex="14" onClick={addSlide}>Adicionar slide</button>
                <label htmlFor="product-about" className={styles.label}>Descrição:</label>
                <textarea id="product-about" tabIndex='15' className={styles.textarea}
                    ref={inputRef}
                    value={text}
                    onChange={onChangeText}
                />
                <label htmlFor="product-applying" className={styles.label}>Método de uso:</label>
                <textarea id="product-applying" tabIndex='16' className={styles.textarea}
                    ref={inputRef}
                    value={applying}
                    onChange={onChangeApplying} />
                <label htmlFor="product-compound" className={styles.label}>Ingredientes:</label>
                <textarea id="product-compound" tabIndex='17' className={styles.textarea}
                    ref={inputRef}
                    value={compound}
                    onChange={onChangeCompound}/>
                <button type='submit' tabIndex='18' className={styles.button}>Atualizar produto</button>
            </form>            
        </div>
    );
};

export default UpdateProduct;