import React from 'react';
import axios from 'axios';
import styles from './AdminPanel.module.scss';
import { AuthContext } from '../../context';
import { createPromocode, updatePromocode } from '../../http/productAPI';

const AdminPromocodes = () => {

    const [promocodes, setPromocodes] = React.useState([]);
    const [promocodesLoading, setPromocodesLoading] = React.useState(false);
    const [brands, setBrands] = React.useState([]);
    const [brandsLoading, setBrandsLoading] = React.useState(false);
    const [activeBrandId, setActiveBrandId] = React.useState(0);
    const [editPromocodeMode, setEditPromocodeMode] = React.useState(false);
    const [createPromocodeMode, setCreatePromocodeMode] = React.useState(false);
    const [newName, setNewName] = React.useState('');
    const [newValue, setNewValue] = React.useState('');
    const [applicabilityValue, setApplicabilityValue] = React.useState('Para todas as marcas');
    const [updatedApplicability, setUpdatedApplicability] = React.useState('Para todas as marcas');
    const [updatedName, setUpdatedName] = React.useState('');
    const [updatedValue, setUpdatedValue] = React.useState('');
    const [activePromocode, setActivePromocode] = React.useState('');
    const [showPromocodes, setShowPromocodes] = React.useState(false);
    const [checkedReusable, setCheckedReusable] = React.useState(false);
    const [checkedUpdatedReusable, setCheckedUpdatedReusable] = React.useState(false);
    const [showBrands, setShowBrands] = React.useState(false);
    const [showUpdatedBrands, setShowUpdatedBrands] = React.useState(false);

    const {
        serverDomain
    } = React.useContext(AuthContext);

    const message = () => {
        window.alert('Ocorreu um erro!');
    };

    React.useEffect(() => {
        setBrandsLoading(true);
        axios.get(`${serverDomain}api/brand`)
            .then((res) => {
                setBrands(res.data);
                setBrandsLoading(false);
            });
    }, [serverDomain, editPromocodeMode, createPromocodeMode, showPromocodes]);

    React.useEffect(() => {
        setPromocodesLoading(true);
        axios.get(`${serverDomain}api/promocode`)
            .then((res) => {
                setPromocodes(res.data);
                setPromocodesLoading(false);
            });
    }, [serverDomain, editPromocodeMode, createPromocodeMode, showPromocodes]);

    const onChangeNewName = (e) => {
        setNewName(e.target.value.trim().toUpperCase());
    };

    const onChangeNewValue = (e) => {
        setNewValue(e.target.value.trim());
    };

    const onChangeUpdatedName = (e) => {
        setUpdatedName(e.target.value.trim().toUpperCase());
    };

    const onChangeUpdatedValue = (e) => {
        setUpdatedValue(e.target.value.trim());
    };

    const cancelEdit = () => {
        if (createPromocodeMode) {
            setCreatePromocodeMode(false);
            setNewName('');
            setNewValue('');
            setActiveBrandId(0);
            setApplicabilityValue('Para todas as marcas');
            setCheckedReusable(false);
        }
        if (editPromocodeMode) {
            setEditPromocodeMode(false);
            setUpdatedName('');
            setUpdatedValue('');
            setActivePromocode('');
            setActiveBrandId(0);
            setUpdatedApplicability('')
            setCheckedUpdatedReusable(false);
        }
    };

    const success = () => {
        if (createPromocodeMode) {
            setNewName('');
            setNewValue('');
            setActiveBrandId(0);
            setApplicabilityValue('Para todas as marcas');
            setCheckedReusable(false);
            setCreatePromocodeMode(false);
            window.alert('Código promocional criado com sucesso!');
        }
        if (editPromocodeMode) {
            setUpdatedName('');
            setUpdatedValue('');
            setActiveBrandId(0);
            setUpdatedApplicability('')
            setCheckedUpdatedReusable(false);
            setActivePromocode('');
            setEditPromocodeMode(false);
            window.alert('O código promocional foi atualizado com sucesso!');
        }
    };

    const onClickShowPromocodes = () => {
        if (showPromocodes) {
            setShowPromocodes(false);
        } else {
            setShowPromocodes(true);
        }
    };

    const onClickShowBrands = () => {
        if (showBrands) {
            setShowBrands(false);
        } else {
            setShowBrands(true);
        }
    };

    const onClickHideBrands = (brandId, brandName) => {
        setActiveBrandId(brandId);
        setApplicabilityValue(brandName);
        setShowBrands(false);
    };

    const onClickShowUpdatedBrands = () => {
        if (showUpdatedBrands) {
            setShowUpdatedBrands(false);
        } else {
            setShowUpdatedBrands(true);
        }
    };

    const onClickHideUpdatedBrands = (brandId, brandName) => {
        setActiveBrandId(brandId);
        setUpdatedApplicability(brandName);
        setShowUpdatedBrands(false);
    };

    const checkedCheckboxReusable = () => {
        if (!checkedReusable) {
            setCheckedReusable(true); 
        } else {
            setCheckedReusable(false);             
        }
    }

    const onClickUpdateReusable = () => {
        if (!checkedUpdatedReusable) {
            setCheckedUpdatedReusable(true); 
        } else {
            setCheckedUpdatedReusable(false);             
        }
    }

    const showPromocodesMenu = () => {
        setShowPromocodes(false);
        setEditPromocodeMode(false);
        setCreatePromocodeMode(true);
    };

    const pushPromocode = (e) => {
        e.preventDefault();
        if (newName.length && newValue.length && activeBrandId) {
            const formData = new FormData();
            formData.set('name', newName);
            formData.set('value', newValue);
            formData.set("newMember", false);
            formData.set("reusable", checkedReusable);
            formData.set('brandId', activeBrandId);
            createPromocode(formData).then(data => success()).catch(err => message());
        }     
    };

    const removePromocode = (id) => {
        if (window.confirm('Tem certeza de que deseja remover o código promocional?')) {
            axios.delete(`${serverDomain}api/promocode?id=${id}`)
                .then(() => {
                    window.alert('Código promocional removido com sucesso!');
                    setShowPromocodes(false);
                }).catch(err => message());      
        } else {
            window.alert('Exclusão cancelada.');
        }
    };

    const showEditPromocodesMenu = (promocode) => {
        setActivePromocode(promocode.id);
        setUpdatedName(promocode.name);
        setUpdatedValue(promocode.value);
        setCheckedUpdatedReusable(promocode.reusable);
        setUpdatedApplicability(
            brands.length > 0
                ?
                brands.find((brand) => brand.id === Number(promocode.brandId))?.name
                :
                'Para todas as marcas'
        )
        setEditPromocodeMode(true);        
        setShowPromocodes(false);
        setCreatePromocodeMode(false);
    };

    const editPromocode = (e) => {
        e.preventDefault();
        if (updatedName && updatedValue && activeBrandId) {
            const formData = new FormData();
            const id = activePromocode;
            formData.append('name', updatedName);
            formData.append('value', updatedValue);
            formData.append("newMember", false);
            formData.append("reusable", checkedUpdatedReusable);
            formData.append("brandId", activeBrandId);
            updatePromocode(formData, id).then(data => success()).catch(err => message());              
        }
    };


    return (
        <div className={styles.promocodesBlock}>
            <h4>Gerenciamento de código promocional</h4>
            
                {
                    createPromocodeMode
                        ?
                        <>
                            <form onSubmit={pushPromocode} className={styles.promocodesForm}>
                                <div className={styles.promocodesLine}>
                                    <label className={styles.promocodesLabel} htmlFor="new-promocode-name">Nome:</label>
                                    <input
                                        id="new-promocode-name"
                                        value={newName}
                                        onChange={onChangeNewName}
                                        className={styles.promocodesInput}
                                        name='promocodeName'
                                        type="text"
                                        tabIndex="1"
                                    />                        
                                </div>
                                <div className={styles.promocodesLine}>
                                    <label className={styles.promocodesLabel} htmlFor="new-promocode-value">Definição (%) :</label>
                                    <input
                                        id="new-promocode-value"
                                        value={newValue}
                                        onChange={onChangeNewValue}
                                        className={styles.promocodesInput}
                                        name='promocodeValue'
                                        type="text"
                                        tabIndex="2"
                                    />
                                </div>
                                <div className={styles.promocodesLine}>
                                    <label className={styles.promocodesLabel} htmlFor="applicability-value">Aplicabilidade: </label>
                                    <input
                                        readOnly
                                        id="applicability-value"
                                        value={applicabilityValue}
                                        className={styles.promocodesInput}
                                        name='applicabilityValue'
                                        type="text"
                                        tabIndex="3"
                                    />
                                    <svg onClick={onClickShowBrands} className={showBrands ? styles.promocodesArrowIconClicked : styles.promocodesArrowIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                        <path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" />
                                    </svg>
                                    <div className={showBrands ? styles.promocodesBrandsBlock : styles.promocodesBrandsBlockHidden}>
                                        <ul className={styles.promocodesBrandsList}>
                                            {brands.length > 0 && !brandsLoading
                                            ?
                                            <>
                                                <li onClick={() => onClickHideBrands(0, 'Para todas as marcas')} key={0} className={styles.promocodesBrandsItem}>
                                                    Para todas as marcas
                                                </li>
                                                {brands.map((brand) =>
                                                    <li onClick={() => onClickHideBrands(brand.id, brand.name)} key={brand.id} className={styles.promocodesBrandsItem}>
                                                        {brand.name}
                                                    </li>
                                                )}                                                
                                            </>

                                                :
                                            <li className={styles.promocodesBrandsLoading}>Carregando...</li>
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <div className={styles.promocodesCheckboxLine}>
                                    <label onClick={checkedCheckboxReusable} htmlFor="reusableCheckbox" className={checkedReusable ? styles.formLabelChecked : styles.formLabelCheckbox}>
                                        Reutilizável:
                                    </label>
                                    <input id="reusableCheckbox" type="checkbox" tabIndex="4" name="reusable-checkbox" className={styles.formInputCheckbox} /> 
                                </div>
                                <button type='submit' tabIndex="5" className={styles.subBtn}>Confirme</button> 
                                <button type='button' tabIndex="6" onClick={cancelEdit} className={styles.cancelBtn}>Cancelar</button>                     
                            </form>                                
                        </>
                        :
                        showPromocodes || editPromocodeMode ? '' : <button type='button' onClick={showPromocodesMenu} className={styles.upBtn}>Criar novo</button>                  
            }

            {
                editPromocodeMode
                    &&
                    <form onSubmit={editPromocode} className={styles.promocodesForm}>
                        <div className={styles.promocodesLine}>
                            <label className={styles.promocodesLabel} htmlFor="new-promocode-name">Nome:</label>
                            <input
                                id="updated-promocode-name"
                                value={updatedName}
                                onChange={onChangeUpdatedName}
                                className={styles.promocodesInput}
                                name='promocodeName'
                                type="text"
                                tabIndex="1"
                            />                        
                        </div>
                        <div className={styles.promocodesLine}>
                            <label className={styles.promocodesLabel} htmlFor="new-promocode-value">Definição (%):</label>
                            <input
                                id="updated-promocode-value"
                                value={updatedValue}
                                onChange={onChangeUpdatedValue}
                                className={styles.promocodesInput}
                                name='promocodeValue'
                                type="text"
                                tabIndex="2"
                            />
                        </div>
                        <div className={styles.promocodesLine}>
                            <label className={styles.promocodesLabel} htmlFor="updated-applicability-value">
                                Aplicabilidade:
                            </label>
                            <input
                                readOnly
                                id="updated-applicability-value"
                                value={updatedApplicability}
                                className={styles.promocodesInput}
                                name='updatedApplicabilityValue'
                                type="text"
                                tabIndex="3"
                            />
                            <svg onClick={onClickShowUpdatedBrands} className={showUpdatedBrands ? styles.promocodesArrowIconClicked : styles.promocodesArrowIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                <path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" />
                            </svg>
                            <div className={showUpdatedBrands ? styles.promocodesBrandsBlock : styles.promocodesBrandsBlockHidden}>
                                <ul className={styles.promocodesBrandsList}>
                                    {brands.length > 0 && !brandsLoading
                                    ?
                                    <>
                                        <li onClick={() => onClickHideUpdatedBrands(0, 'Para todas as marcas')} key={0} className={styles.promocodesBrandsItem}>
                                            Para todas as marcas
                                        </li>
                                        {brands.map((brand) =>
                                            <li onClick={() => onClickHideUpdatedBrands(brand.id, brand.name)} key={brand.id} className={styles.promocodesBrandsItem}>
                                                {brand.name}
                                            </li>
                                        )}                                                
                                    </>

                                        :
                                    <li className={styles.promocodesBrandsLoading}>Carregando...</li>
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className={styles.promocodesCheckboxLine}>
                            <label onClick={onClickUpdateReusable} htmlFor="reusableCheckbox" className={checkedUpdatedReusable ? styles.formLabelChecked : styles.formLabelCheckbox}>
                                Reutilizável:
                            </label>
                            <input id="reusableCheckbox" type="checkbox" tabIndex="4" name="reusable-checkbox" className={styles.formInputCheckbox} /> 
                        </div>
                        <button type='submit' tabIndex="5" className={styles.subBtn}>Confirme</button> 
                        <button type='button' tabIndex="6" onClick={cancelEdit} className={styles.cancelBtn}>Cancelar</button>                     
                    </form>                                               
            }


            {
                showPromocodes && promocodes.length > 0 && brands.length > 0 && !promocodesLoading
                    ?
                    <ul className={styles.promocodesList}>
                        {
                            promocodes.map((code) => (
                                <li className={styles.promocodesItem} key={code.id}>
                                    <div className={styles.promocodesItemTop}>
                                        <div className={styles.promocodesName}>
                                            <svg className={styles.promocodesSvg} onClick={() => showEditPromocodesMenu(code)} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                                <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                                            </svg> 
                                            {code.name} - {code.value}%
                                        </div>
                                        {
                                            !code.newMember
                                            &&
                                            <svg className={styles.promocodesSvg} onClick={() => removePromocode(code.id)} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                                <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z" />
                                            </svg>
                                        }                                        
                                    </div>
                                    <div className={styles.promocodesItemBottom}>
                                        {code.reusable &&
                                            <div className={styles.promocodesReusableMark}>
                                                Reutilizável
                                            </div>
                                        }
                                        {code.brandId > 0
                                            &&    
                                            <div className={styles.promocodesBrandMark}>
                                                {brands.find((brand) => brand.id === Number(code.brandId))?.name}
                                            </div>
                                        }                                        
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                    :
                    showPromocodes && 'Carregando...'
            }
            {
                createPromocodeMode || editPromocodeMode
                    ?
                    ''
                    :
                    <button onClick={onClickShowPromocodes} className={styles.upBtn}>
                        {showPromocodes ? 'Ocultar lista' : 'Mostrar lista'}
                    </button>
            }

        </div> 
    );
};

export default AdminPromocodes;