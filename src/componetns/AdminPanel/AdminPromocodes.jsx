import React from 'react';
import axios from 'axios';
import styles from './AdminPanel.module.scss';
import { AuthContext } from '../../context';
import { createPromocode, updatePromocode } from '../../http/productAPI';

const AdminPromocodes = () => {

    const [promocodes, setPromocodes] = React.useState([]);
    const [promocodesLoading, setPromocodesLoading] = React.useState(false);
    const [editPromocodeMode, setEditPromocodeMode] = React.useState(false);
    const [createPromocodeMode, setCreatePromocodeMode] = React.useState(false);
    const [newName, setNewName] = React.useState('');
    const [newValue, setNewValue] = React.useState('');
    const [updatedName, setUpdatedName] = React.useState('');
    const [updatedValue, setUpdatedValue] = React.useState('');
    const [activePromocode, setActivePromocode] = React.useState('');
    const [showPromocodes, setShowPromocodes] = React.useState(false);

    const {
        serverDomain
    } = React.useContext(AuthContext);

    const message = () => {
        window.alert('Ocorreu um erro!');
    };

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
        }
        if (editPromocodeMode) {
            setEditPromocodeMode(false);
            setUpdatedName('');
            setUpdatedValue('');
            setActivePromocode('');
        }
    };

    const success = () => {
        if (createPromocodeMode) {
            setNewName('');
            setNewValue('');
            setCreatePromocodeMode(false);
            window.alert('Código promocional criado com sucesso!');
        }
        if (editPromocodeMode) {
            setUpdatedName('');
            setUpdatedValue('');
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

    const showPromocodesMenu = () => {
        setShowPromocodes(false);
        setEditPromocodeMode(false);
        setCreatePromocodeMode(true);
    };

    const pushPromocode = (e) => {
        e.preventDefault();
        if (newName.length && newValue.length) {
            const formData = new FormData();
            formData.set('name', newName);
            formData.set('value', newValue);
            formData.set("newMember", false);
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
        setShowPromocodes(false);
        setCreatePromocodeMode(false);
        setEditPromocodeMode(true);
    };

    const editPromocode = (e) => {
        e.preventDefault();
        if (updatedName && updatedValue) {
            const formData = new FormData();
            const id = activePromocode;
            formData.append('name', updatedName);
            formData.append('value', updatedValue);
            formData.append("newMember", false);
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
                                    />
                                </div>
                                <button type='submit' className={styles.subBtn}>Confirme</button> 
                                <button type='button' onClick={cancelEdit} className={styles.cancelBtn}>Cancelar</button>                     
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
                            />                        
                        </div>
                        <div className={styles.promocodesLine}>
                            <label className={styles.promocodesLabel} htmlFor="new-promocode-value">Definição (%) :</label>
                            <input
                                id="updated-promocode-value"
                                value={updatedValue}
                                onChange={onChangeUpdatedValue}
                                className={styles.promocodesInput}
                                name='promocodeValue'
                                type="text"
                            />
                        </div>
                        <button type='submit' className={styles.subBtn}>Confirme</button> 
                        <button type='button' onClick={cancelEdit} className={styles.cancelBtn}>Cancelar</button>                     
                    </form>                                               
            }


            {
                showPromocodes && promocodes.length && !promocodesLoading
                    ?
                    <ul className={styles.promocodesList}>
                        {
                            promocodes.map((code) => (
                                <li className={styles.promocodesItem} key={code.id}>
                                    <div className={styles.promocodesName}>
                                        <svg className={styles.promocodesSvg} onClick={() => showEditPromocodesMenu(code)} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                            <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                                        </svg> 
                                        {code.name} - {code.value}%
                                    </div>

                                    {
                                        !code.newMember
                                        ?
                                        <svg className={styles.promocodesSvg} onClick={() => removePromocode(code.id)} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                            <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z" />
                                        </svg>
                                        :
                                        ''
                                    }

                                </li>
                            ))
                        }
                    </ul>
                    :
                    ''
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