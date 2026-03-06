import React from 'react';
import axios from 'axios';
import styles from './AdminPanel.module.scss';
import { AuthContext } from '../../context';
import debounce from 'lodash.debounce';
import { updateProduct } from '../../http/productAPI';

const AdminProductStore = () => {

    const [kits, setKits] = React.useState([]);
    const [kitsVisibility, setKitsVisibility] = React.useState(false);
    const [kitId, setKitId] = React.useState(0); 
    const [kitName, setKitName] = React.useState('Selecione um conjunto');    
    const [productsList, setProductsList] = React.useState([]);
    const [selectedProducts, setSelectedProducts] = React.useState([]);
    const [listIsLoading, setListIsLoading] = React.useState(false);
    const [kitsAreLoading, setKitsAreLoading] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    const [value, setValue] = React.useState('');
    const [kitValue, setKitValue] = React.useState(''); 
    const [kitSearchValue, setKitSearchValue] = React.useState(''); 
    const [isAvailable, setIsAvailable] = React.useState(false);

    const { serverDomain } = React.useContext(AuthContext);

    const inputRef = React.useRef();

    React.useEffect(() => {
        setKitsAreLoading(true);
        const searchParams = kitSearchValue ? `?name=${kitSearchValue}` : '';
        axios.get(`${serverDomain}api/kit${searchParams}`)
            .then((res) => {
                setKits(res.data);
            });
        setKitsAreLoading(false);
    }, [serverDomain, kitSearchValue, selectedProducts]);

    React.useEffect(() => {
        if (kitId) {
            setListIsLoading(true);
            const sortBy = 'id';
            const order = 'ASC';
            const productName = searchValue ? `&name=${searchValue}` : '';
            axios.get(`${serverDomain}api/product?limit=1000${productName}&sort=${sortBy}&order=${order}&kitId=${kitId}`)
                .then((res) => {
                    setProductsList(res.data.rows);
                    setListIsLoading(false);
                });            
        }

    }, [serverDomain, searchValue, kitId]);

    const updateKitValue = React.useCallback(
        debounce((str) => {
            setKitSearchValue(str);
        }, 1000),
        [],
    );

    const onChangeKitValue = (e) => {
        setKitValue(e.target.value);
        updateKitValue(e.target.value);
    }

    React.useEffect(() => {
        if (!kitSearchValue) {
            setKitId(0);
            setKitName('Selecione um conjunto');
            setSearchValue('');
            setValue('');
            setSelectedProducts([]);        
            setProductsList([]);
        }
    }, [kitSearchValue]);
    

    const updateSearchValue = React.useCallback(
        debounce((str) => {
            setSearchValue(str);   
        }, 1000),
        [],
    );

    const onChangeValue = (e) => {
        setValue(e.target.value);
        updateSearchValue(e.target.value);
    };

    const toggleKitOptions = () => {
        if (kitsVisibility) {
            setKitsVisibility(false);
        } else {
            setKitsVisibility(true);
        }
    }

    const hideKitOptions = (id, name) => {
        setKitId(id);
        setKitName(name);
        setKitsVisibility(false);
    }

    const clearKitValue = () => {
        setKitValue('');
        setKitSearchValue('');
        setKitId(0);
        setKitName('Selecione um conjunto');
        setSearchValue('');
        setValue('');
        setSelectedProducts([]);        
        setProductsList([]);
    };

    const clearSearchValue = () => {
        setSearchValue('');
        setValue('');
    };

    React.useEffect(() => {
        if (productsList.length === 0 && selectedProducts.length > 0) {
            setSelectedProducts([]);
        }
    }, [productsList, selectedProducts]);


    const onClickSelect = (product) => {
        const duplicate = selectedProducts.length > 0 ? selectedProducts.find((selectedProduct) => selectedProduct.id === product.id) : '';
        if (!duplicate) {
            setSelectedProducts([...selectedProducts, product]);
        } else {
            let updatedArr = selectedProducts.length > 0 ? selectedProducts.filter((selectedProduct) => selectedProduct.id !== product.id) : [];
            setSelectedProducts(updatedArr);  
        }
    }

    const errMsg = () => {
        window.alert('Erro de atualização');
    }

    const updateAvailability = (e) => {
        e.preventDefault();
        selectedProducts.map((selectedProduct) => selectedProduct.available = isAvailable);
        selectedProducts.forEach((productToUpdate) => {
            const formData = new FormData();
            formData.set('available', productToUpdate.available);
            updateProduct(formData, productToUpdate.id).then(data => data).catch(err => err);
        });
        window.alert('Atualização concluída');
        setSelectedProducts([]);
    };


    return (
        <div className={styles.adminStoreBlock}>
            <form onSubmit={updateAvailability} className={styles.adminStoreForm}>
                <div className={styles.line}>
                    <div onClick={toggleKitOptions} required tabIndex="1" className={styles.formSelectKit}>
                        {kitName.length > 23 ? kitName.slice(0,22) + '...' : kitName}
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                            <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                        </svg>
                    </div>
                    {kitsVisibility ?
                        <div className={styles.kitOptions}>
                            {
                                <input id="kit-search" type='text' className={styles.kitSearchInput}
                                    ref={inputRef}
                                    value={kitValue}
                                    onChange={onChangeKitValue}
                                    placeholder={`Procure um conjunto...`}
                                />
                            }
                            {
                                kitValue
                                &&
                                <svg className={styles.deleteIcon} onClick={clearKitValue} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                    <path d="M576 64H205.26A63.97 63.97 0 0 0 160 82.75L9.37 233.37c-12.5 12.5-12.5 32.76 0 45.25L160 429.25c12 12 28.28 18.75 45.25 18.75H576c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm-84.69 254.06c6.25 6.25 6.25 16.38 0 22.63l-22.62 22.62c-6.25 6.25-16.38 6.25-22.63 0L384 301.25l-62.06 62.06c-6.25 6.25-16.38 6.25-22.63 0l-22.62-22.62c-6.25-6.25-6.25-16.38 0-22.63L338.75 256l-62.06-62.06c-6.25-6.25-6.25-16.38 0-22.63l22.62-22.62c6.25-6.25 16.38-6.25 22.63 0L384 210.75l62.06-62.06c6.25-6.25 16.38-6.25 22.63 0l22.62 22.62c6.25 6.25 6.25 16.38 0 22.63L429.25 256l62.06 62.06z" />
                                </svg>                                
                            }
                            
                            <div className={styles.optionsWrapper}>
                                {kits.length > 0 ? kits.map((kit) =>
                                    <div key={kit.name} value={kit.id} onClick={() => hideKitOptions(kit.id, kit.name)} className={styles.option}>{kit.name}</div>
                                ) : <div className={styles.listMsg}>{kitsAreLoading ? 'Carregando conjuntos' : (kitSearchValue ? 'Nenhum conjunto encontrado' : 'Nenhum conjunto selecionado')}</div>}
                            </div>
                        </div>
                        : ''
                    }
                </div>
                {
                    kitId
                    ?
                    <div className={styles.searchWrapper}>
                        <input id="kit-product-search" ref={inputRef} type="text" value={value} placeholder='Encontrar variação...' onChange={onChangeValue} className={styles.adminStoreProductSearch} />
                        {
                            value
                            &&
                            <svg className={styles.deleteIconSearch} onClick={clearSearchValue} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                <path d="M576 64H205.26A63.97 63.97 0 0 0 160 82.75L9.37 233.37c-12.5 12.5-12.5 32.76 0 45.25L160 429.25c12 12 28.28 18.75 45.25 18.75H576c35.35 0 64-28.65 64-64V128c0-35.35-28.65-64-64-64zm-84.69 254.06c6.25 6.25 6.25 16.38 0 22.63l-22.62 22.62c-6.25 6.25-16.38 6.25-22.63 0L384 301.25l-62.06 62.06c-6.25 6.25-16.38 6.25-22.63 0l-22.62-22.62c-6.25-6.25-6.25-16.38 0-22.63L338.75 256l-62.06-62.06c-6.25-6.25-6.25-16.38 0-22.63l22.62-22.62c6.25-6.25 16.38-6.25 22.63 0L384 210.75l62.06-62.06c6.25-6.25 16.38-6.25 22.63 0l22.62 22.62c6.25 6.25 6.25 16.38 0 22.63L429.25 256l62.06 62.06z" />
                            </svg>                                
                        }                  
                    </div> 
                    :
                    ''    
                }

                {productsList.length > 0
                    &&
                    <>
                        <div className={styles.adminStoreItemsCount}>
                            Resultados encontrados: {productsList.length}
                        </div>   
                        <div className={styles.adminStoreText}>Selecione opções</div>
                    </>
                }

                <ul className={styles.adminStoreList}>
                    {productsList.length > 0
                        ?
                        productsList.map((product) => 
                            <li key={product.id} onClick={() => onClickSelect(product)} className={styles.adminStoreItem}>
                                <div className={selectedProducts.length > 0 && selectedProducts.includes(product) ? styles.adminStoreProductName : styles.adminStoreProductActive}>
                                    {product.variant ? product.variant : product.name}
                                </div>
                                <div className={styles.adminStoreItemBottom}>
                                    <div>{product.code}</div>
                                    <div className={styles.adminStoreAvailability}>
                                        <div>{product.quantity && 'Quantity'}</div>
                                        <svg className={!product.available ? styles.offIcon : styles.onIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path d="M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128 0-70.8 57.3-128 128-128 70.8 0 128 57.3 128 128 0 70.8-57.3 128-128 128z" />
                                        </svg>                                   
                                    </div>
                                </div>
                            </li>                        
                        )
                        :
                        listIsLoading && kitId ? <div className={styles.listMsg}>Carregando produtos...</div> : <div className={styles.listMsg}>{searchValue ? 'Nenhum produto encontrado' : ''}</div>
                    }

                </ul>
                {
                    selectedProducts.length > 0
                    &&
                    <div className={styles.adminStoreItemsCount}>Produtos selecionados: {selectedProducts.length}</div>                    
                }


                {selectedProducts.length > 0
                    &&
                    <div className={styles.adminStoreActions}>
                        <div className={styles.adminStoreActionsLine}>
                            <svg onClick={() => isAvailable ? setIsAvailable(false) : setIsAvailable(true)} className={!isAvailable ? styles.mainOffIcon : styles.mainOnIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path d="M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128 0-70.8 57.3-128 128-128 70.8 0 128 57.3 128 128 0 70.8-57.3 128-128 128z" />
                            </svg>
                            {isAvailable ? 'Adicionar ao estoque' : 'Remover do estoque'}      
                        </div>
                        <button className={styles.upBtn}>Aplicar</button>                                 
                    </div>
                }
            </form>
        </div>
    );
};

export default AdminProductStore;

