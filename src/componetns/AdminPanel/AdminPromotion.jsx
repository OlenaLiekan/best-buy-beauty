import React from 'react';
import axios from 'axios';
import { AuthContext } from '../../context';
import styles from './AdminPanel.module.scss';
import { createPromotion, updateBrand } from '../../http/productAPI';

const AdminPromotion = () => {

    const [createMode, setCreateMode] = React.useState(false);
    const [nextStepMode, setNextStepMode] = React.useState(false);
    const [promotionName, setPromotionName] = React.useState('');
    const [startDate, setStartDate] = React.useState('');
    const [finishDate, setFinishDate] = React.useState('');
    const [brandsList, setBrandsList] = React.useState([]);
    const [promoList, setPromoList] = React.useState([]);
    const [activeBrandIndex, setActiveBrandIndex] = React.useState('');
    const [activeBrandName, setActiveBrandName] = React.useState('');
    const [activeBrandId, setActiveBrandId] = React.useState('');
    const [info, setInfo] = React.useState([]);
    const [promotionDiscount, setPromotionDiscount] = React.useState('');

    const { isBlackFriday, serverDomain } = React.useContext(AuthContext);

    React.useEffect(() => {
        axios.get(`${serverDomain}api/brand`)
            .then((res) => {
                setBrandsList(res.data);
            });
    }, [serverDomain, createMode, nextStepMode]);

    React.useEffect(() => {
        axios.get(`${serverDomain}api/promotion`)
            .then((res) => {
                setPromoList(res.data);
            });
    }, [serverDomain, createMode]);

    const onClickShowForm = () => {
        if (brandsList.length > 0) {
            brandsList.forEach((item) => {
                const formData = new FormData();
                formData.set('discount', 0);
                updateBrand(formData, item.id);
            }); 
        }
        setCreateMode(true);
    };

    const onClickCancel = () => {
        if (createMode) {
            if (!nextStepMode) {
                setCreateMode(false);      
                setPromotionName('');
                setStartDate('');
                setFinishDate('');   
                setActiveBrandId('');
                setActiveBrandIndex('');
                setActiveBrandName('');
                setPromotionDiscount('');
                setInfo([]);
            } else {
                setNextStepMode(false);
            }
        }
    };

    const onChangePromotionName = (e) => {
        setPromotionName(e.target.value);
    };

    const onChangeStartDate = (e) => {
        setStartDate(e.target.value);
    };

    const onChangeFinishDate = (e) => {
        setFinishDate(e.target.value);
    };


    React.useEffect(() => {
        if (startDate) {
            const now = new Date();
            const startDateMs = new Date(startDate.split('-').join()).getTime();   
            const currentTimeMs = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
            if (currentTimeMs.getTime() - 10800000 > startDateMs) {
                window.alert('A data de início não pode ser menor que a data de hoje!');
                setStartDate('');   
            }
        }

        if (startDate && finishDate) {
            const startDateMs = new Date(startDate.split('-').join()).getTime();
            const finishDateMs = new Date(finishDate.split('-').join()).getTime();
            if (finishDateMs <= startDateMs) {
                window.alert('A data final deve ser posterior!');
                console.log(finishDateMs, startDateMs);
                setFinishDate('');
            }
        }
    }, [startDate, finishDate]);

    const onChangeDiscount = (e) => {
        setPromotionDiscount(e.target.value);
    };

    const checkedBrand = (i, brand) => {
        setActiveBrandIndex(i);
        setActiveBrandName(brand.name);
        setActiveBrandId(brand.id);
        setPromotionDiscount(brand.discount);
    };

    const onClickAddToList = () => {
        if (promotionDiscount > 0) {
            const notAllowed = info.find((item) => item.id === activeBrandId);
            if (!notAllowed) {
                setInfo([...info, { id: activeBrandId, name: activeBrandName, discount: promotionDiscount }]);
                setBrandsList(brandsList.filter((brand) => brand.id !== activeBrandId));
                setActiveBrandId('');
                setActiveBrandIndex('');
                setActiveBrandName('');
                setPromotionDiscount('');
            } else {
                window.alert('Esta marca já foi adicionada.');
            }
        }
    };

    const success = () => {
        window.alert('A promoção foi criada com sucesso!');  
        setNextStepMode(false);
        setCreateMode(false);      
        setPromotionName(''); 
        setStartDate('');
        setFinishDate('');   
        setActiveBrandId('');
        setActiveBrandIndex('');
        setActiveBrandName('');
        setPromotionDiscount('');
        setInfo([]);
    };

    const message = () => {
        window.alert('Falha ao criar promoção.');
    };

    const errorMessage = () => {
        window.alert('Descontos em marcas não são criados.');
    };

    const updated = () => {
        const formData = new FormData();
        formData.set('name', promotionName);
        formData.set('startDate', startDate);
        formData.set("finishDate", finishDate);
        formData.set("info", JSON.stringify(info)); 
        createPromotion(formData).then(data => success()).catch(err => message());
    };

    const pushPromotion = async (e) => {
        e.preventDefault();
        if (promotionName.length && startDate && finishDate && info.length > 0) {
            try {
                info.forEach((item) => {
                    const formData = new FormData();
                    formData.set('discount', item.discount);
                    updateBrand(formData, item.id);
                });
                updated();
            } catch (error) {
                errorMessage();
            }
        }
    };

    return (
        <div className={styles.promotionBlock}>  
            {
                createMode
                    ?
                    <>
                        <form onSubmit={pushPromotion} className={styles.promotionCreateForm}>
                            {!nextStepMode
                                ?
                                <>
                                    <div className={styles.promotionFormLine}>
                                        <label className={styles.promotionLabel} htmlFor="new-promotion-name">
                                            Nome:
                                        </label>
                                        <input
                                            required
                                            id="new-promotion-name"
                                            value={promotionName}
                                            onChange={onChangePromotionName}
                                            className={styles.promotionInput}
                                            name='promotionName'
                                            type="text"
                                            tabIndex="1"
                                        />
                                    </div>
                                    <div className={styles.promotionFormLine}>
                                        <label className={styles.promotionLabel} htmlFor="start-date-promo">
                                            Data de início:
                                        </label>
                                        <input
                                            required
                                            id="start-date-promo"
                                            value={startDate}
                                            onChange={onChangeStartDate}
                                            className={styles.promotionInput}
                                            name='promoStartDate'
                                            type="date"
                                            tabIndex="2"
                                        />
                                    </div>
                                    <div className={styles.promotionFormLine}>
                                        <label className={styles.promotionLabel} htmlFor="finish-date-promo">
                                            Data de término:
                                        </label>
                                        <input
                                            required
                                            id="finish-date-promo"
                                            value={finishDate}
                                            onChange={onChangeFinishDate}
                                            className={styles.promotionInput}
                                            name='promoFinishDate'
                                            type="date"
                                            tabIndex="3"
                                        />
                                    </div>
                                </>
                                :
                                <div>
                                    <div className={styles.promotionFormLine}>
                                        <ul className={styles.promotionBrandsList}>
                                            {brandsList.length > 0 ?
                                                brandsList.map((brand, i) => 
                                                    <li
                                                        onClick={() => checkedBrand(i, brand)}
                                                        className={
                                                            activeBrandIndex === i
                                                                ?
                                                                styles.promotionBrandsItemActive
                                                                :
                                                                styles.promotionBrandsItem
                                                            }
                                                        key={brand.id}>{brand.name}
                                                    </li>      
                                            ) : 'Carregando marcas'   
                                        }
                                        </ul>

                                    </div>
                                    <div className={styles.promotionFormDiscountLine}>
                                        <label className={styles.promotionLabel} htmlFor='promotion-discount'>
                                            Desconto %:
                                        </label> 
                                        <input
                                            id="promotion-discount"
                                            value={promotionDiscount}
                                            onChange={onChangeDiscount}
                                            className={styles.promotionDiscountInput}
                                            name='promotionDiscount'
                                            type="text"
                                            tabIndex="2"
                                        />
                                    </div>
                                    <div onClick={onClickAddToList} className={styles.promotionFormLine}>
                                        <span className={styles.promotionAddBrand}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                            </svg>
                                            Adicionar
                                        </span>                                                                    
                                    </div>
                                    <div className={styles.promotionFormLine}>
                                        <h3 className={styles.promotionTitle}>
                                            Marcas participantes:
                                        </h3> 
                                        {info.length > 0
                                            ?
                                            info.map((item) => 
                                                <div key={item.id} className={styles.brandsWithDiscounts}>
                                                    <div>{item.name}</div> - <div>{item.discount}%</div> 
                                                </div> 
                                            )
                                            :
                                            'Não selecionado'
                                        }
                                    </div>
                                </div>
                            }

                            {nextStepMode
                                &&
                                <div className={styles.addPromotionNextActions}>                        
                                    <button
                                        onClick={onClickCancel}
                                        className={styles.cancelAddPromotionBtn}
                                        type='button'
                                        tabIndex={brandsList.length > 0 ? 4 + brandsList.length + 1 : 4}
                                    >
                                        <svg className={styles.promotionNextIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                            <path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z" />
                                        </svg>
                                        Voltar

                                    </button>        
                                    <button
                                        className={promotionName.length > 0 && startDate && finishDate && info.length > 0 ? styles.addPromotionBtn : styles.addPromotionDisabledBtn}
                                        type='submit'
                                        tabIndex={brandsList.length > 0 ? 5 + brandsList.length + 1 : 5}
                                    >
                                        Criar
                                    </button>
                                </div>   
                            }
                        </form>
                        {
                            !nextStepMode
                            &&
                            <div className={styles.addPromotionActions}>                        
                                <button
                                    onClick={onClickCancel}
                                    className={styles.cancelAddPromotionBtn}
                                    type='button'
                                    tabIndex={brandsList.length > 0 ? 4 + brandsList.length + 1 : 4}
                                >
                                    Cancelar
                                </button>        
                                <button
                                    onClick={() => setNextStepMode(true)}
                                    disabled={promotionName.length > 0 && startDate && finishDate ? false : true}
                                    className={promotionName.length > 0 && startDate && finishDate ? styles.addPromotionBtn : styles.addPromotionDisabledBtn}
                                    type='button'
                                    tabIndex={brandsList.length > 0 ? 5 + brandsList.length + 1 : 5}
                                >
                                    Próximo
                                    <svg className={styles.promotionNextIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                        <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                                    </svg>                                    
                                </button>
                            </div>                            
                        }
                    </>
                    :
                    <>
                        {!isBlackFriday
                            &&
                            <div onClick={onClickShowForm} className={styles.createPromotionBtn}>
                                <svg className={styles.createPromotionIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                </svg>
                                <div className={styles.createPromotionText}>
                                    Crie uma promoção
                                </div>
                            </div>                         
                        } 
                        <div className={styles.promotionBody}>
                            <ul className={styles.promotionItems}>
                                {
                                    promoList.length > 0
                                        ?
                                        promoList.map((promo) => 
                                            <li
                                                key={promo.id}
                                                className={
                                                    new Date().getTime() <=
                                                    new Date(promo.finishDate.split('-').join()).getTime() + 86340000
                                                        ?
                                                        styles.promotionItem
                                                        :
                                                        styles.promotionItemDisable
                                                    }>
                                                <div className={styles.promotionTop}>
                                                    <div className={styles.promotionTopLine}>
                                                        <span className={styles.promotionTopLabel}>
                                                            Nome:
                                                        </span>
                                                        {promo.name}
                                                    </div>
                                                    <div className={styles.promotionTopLine}>
                                                        <span className={styles.promotionTopLabel}>
                                                            Data de início:
                                                        </span>
                                                        <p className={styles.promoDate}>
                                                            {promo.startDate.split('-').reverse().join('-')}
                                                        </p>
                                                    </div>
                                                    <div className={styles.promotionTopLine}>
                                                        <span className={styles.promotionTopLabel}>
                                                            Data de término:
                                                        </span>
                                                        <p className={styles.promoDate}>
                                                            {promo.finishDate.split('-').reverse().join('-')}
                                                        </p>
                                                    </div>
                                                    <div className={styles.promotionTopLine}>
                                                        <span className={styles.promotionTopLabel}>
                                                            Status:
                                                        </span>
                                                        <span className={
                                                            new Date().getTime() <=
                                                            new Date(promo.finishDate.split('-').join()).getTime() + 86340000
                                                                ?
                                                                styles.promotionStatusOn
                                                                :
                                                                styles.promotionStatusOff
                                                        }>
                                                            {
                                                                new Date().getTime() <=
                                                                new Date(promo.finishDate.split('-').join()).getTime() + 86340000
                                                                    ?
                                                                    " Ativo"
                                                                    :
                                                                    " Concluído"
                                                            }
                                                        </span>
                                                    </div>                        
                                                </div>
                                                <div className={styles.promotionBottom}>
                                                    <div className={styles.promotionBottomLabel}>
                                                        Aplica-se a marcas:
                                                    </div>
                                                    <ul className={styles.promotionBrands}>
                                                        {promo.info.length > 0
                                                            &&
                                                            promo.info.map((info) => 
                                                                <li key={info.id} className={styles.promotionBrand}>
                                                                    <div className={styles.promotionBrandName}>
                                                                        {info.title}
                                                                    </div>
                                                                    <div className={styles.promotionBrandPercent}>- {info.description}%</div>
                                                                </li>
                                                            )                                                         
                                                        }

                                                    </ul>
                                                </div>                        
                                            </li>
                                        )
                                    :
                                    'Carregando compartilhamentos...'
                                }

                            </ul>
                        </div>
                    </>
            }          
        </div>
    );
};

export default AdminPromotion;