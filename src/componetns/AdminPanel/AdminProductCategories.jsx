import React from 'react';
import axios from 'axios';
import styles from './AdminPanel.module.scss';
import { AuthContext } from '../../context';
import { createCategory, updateCategory } from '../../http/productAPI';

const AdminProductCategories = () => {

    const [categories, setCategories] = React.useState([]);
    const [categoryName, setCategoryName] = React.useState('');
    const [loading, setIsLoading] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [createMode, setCreateMode] = React.useState(false);
    const [dragAndDropMode, setDragAndDropMode] = React.useState(false);
    const [checked, setChecked] = React.useState(false);
    const [draggedItem, setDraggedItem] = React.useState(null);

    const { serverDomain } = React.useContext(AuthContext);

    const message = () => {
        window.alert('Ocorreu um erro!');
    };

    const success = () => {
        window.alert('Categoria criada com sucesso!');
        setCreateMode(false);
    };

    React.useEffect(() => {
        setIsLoading(true);
        axios.get(`${serverDomain}api/category`)
            .then((res) => {
                setCategories(res.data);
                setIsLoading(false);
            });
    }, [createMode]);

    const saveNewOrder = React.useCallback(async (newCategories) => {
        setIsSaving(true);
        try {
            const orderData = newCategories.map((category, i) => ({
                id: category.id,
                position: i + 1
            }));
            if (orderData.length > 0) {
                orderData.forEach((item) => {
                    const formData = new FormData();
                    formData.set('position', item.position);
                    updateCategory(formData, item.id);
                });
            }
        } catch (error) {
        console.error('Error', error);
        window.alert('Algo deu errado');
        } finally {
            setIsSaving(false);
        }
    }, []);

    const handleDragStart = (e, i) => {
        setDraggedItem(categories[i]);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, i) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        
        if (draggedItem) {
            const items = categories.filter(item => item.id !== draggedItem.id);
            items.splice(targetIndex, 0, draggedItem);
            setCategories(items);
            setDraggedItem(null);
            saveNewOrder(items);
        }
    };

    const onClickShowForm = () => {
        setCreateMode(true);
    };

    const onClickCancel = () => {
        if (createMode) {
            setCreateMode(false);            
        } else if (dragAndDropMode) {
            setDragAndDropMode(false);
        }
    };

    const onChangeCategoryName = (e) => {
        setCategoryName(e.target.value);
    };

    const onClickShowDnDMenu = () => {
        setDragAndDropMode(true);
    };

    const onClickChecked = () => {
        if (checked) {
            setChecked(false);
        } else {
            setChecked(true);
        }
    };

    const pushCategory = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', categoryName);
        formData.set("subMenu", false);
        formData.set("position", String(categories.length ? categories.length + 1 : 0));
        createCategory(formData).then(data => success()).catch(err => message());    
    };

    return (
        <div className={styles.categoriesBlock}>
            {
                !createMode
                    ?
                    <>            
                        <div onClick={onClickShowForm} className={styles.createCategoryBtn}>
                            <svg className={styles.createCategoryIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                            </svg>
                            <div className={styles.createCategoryText}>
                                Criar uma categoria
                            </div>
                        </div>
                        <h4 className={styles.categoriesListTitle}>
                            Lista de categorias
                        </h4>
                        {loading
                            &&
                            <span className={styles.categoriesLoader}>
                                está carregando...
                            </span>
                        }
                        <ul className={styles.categoriesList}>
                            {
                                categories.length > 0 && !loading
                                &&
                                categories.map((category, i) =>
                                    <li
                                        key={category.id}
                                        draggable={dragAndDropMode && !isSaving ? true : false}
                                        onDragStart={(e) => handleDragStart(e, i)}
                                        onDragOver={(e) => handleDragOver(e, i)}
                                        onDrop={(e) => handleDrop(e, i)}
                                        className={dragAndDropMode ? styles.categoriesItemActive : styles.categoriesItem}
                                    >
                                        <span className={
                                            dragAndDropMode
                                                ?
                                                styles.categoriesDragHandleOn
                                                :
                                                styles.categoriesDragHandleOff
                                        }>
                                            ☰
                                        </span>
                                        <span className={styles.categoriesPosBadge}>#{i + 1} </span> 
                                        {category.name}                   
                                    </li>                    
                                )
                            }
                        </ul>
                        {
                            dragAndDropMode
                                ?
                                <div className={styles.cancelChangeOrder} onClick={onClickCancel}>
                                    Salvar alterações
                                </div>  
                                :                                
                                (categories.length > 0 && !loading
                                    ?
                                    <div onClick={onClickShowDnDMenu} className={styles.changeCategoriesOrderLine}>
                                        <svg className={styles.changeCategoriesOrderIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M61.77 401l17.5-20.15a19.92 19.92 0 0 0 5.07-14.19v-3.31C84.34 356 80.5 352 73 352H16a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h22.83a157.41 157.41 0 0 0-11 12.31l-5.61 7c-4 5.07-5.25 10.13-2.8 14.88l1.05 1.93c3 5.76 6.29 7.88 12.25 7.88h4.73c10.33 0 15.94 2.44 15.94 9.09 0 4.72-4.2 8.22-14.36 8.22a41.54 41.54 0 0 1-15.47-3.12c-6.49-3.88-11.74-3.5-15.6 3.12l-5.59 9.31c-3.72 6.13-3.19 11.72 2.63 15.94 7.71 4.69 20.38 9.44 37 9.44 34.16 0 48.5-22.75 48.5-44.12-.03-14.38-9.12-29.76-28.73-34.88zM496 224H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM16 160h64a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8H64V40a8 8 0 0 0-8-8H32a8 8 0 0 0-7.14 4.42l-8 16A8 8 0 0 0 24 64h8v64H16a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8zm-3.91 160H80a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8H41.32c3.29-10.29 48.34-18.68 48.34-56.44 0-29.06-25-39.56-44.47-39.56-21.36 0-33.8 10-40.46 18.75-4.37 5.59-3 10.84 2.8 15.37l8.58 6.88c5.61 4.56 11 2.47 16.12-2.44a13.44 13.44 0 0 1 9.46-3.84c3.33 0 9.28 1.56 9.28 8.75C51 248.19 0 257.31 0 304.59v4C0 316 5.08 320 12.09 320z" />
                                        </svg>
                                        <span className={styles.changeCategoriesOrderText}>Alterar pedido</span>
                                    </div>
                                    :
                                    ''
                                )                                
                        }
                    </>
                    : 
                    <form onSubmit={pushCategory} className={styles.categoriesCreateForm}>
                        <div className={styles.categoryFormLine}>
                            <label className={styles.categoryLabel} htmlFor="new-category-name">
                                Nome:
                            </label>
                            <input
                                required
                                id="new-category-name"
                                value={categoryName}
                                onChange={onChangeCategoryName}
                                className={styles.categoryInput}
                                name='categoryName'
                                type="text"
                                tabIndex="1"
                            />
                        </div>
                        <div onClick={onClickChecked} className={styles.categoryFormLine}>
                            <label className={styles.categoryLabel} htmlFor="category-with-sub-menu">
                                Subcategorias:
                            </label>
                            <input
                                id="category-with-sub-menu"
                                type="checkbox"
                                checked={checked ? true : false}
                                name="categoryWithSubMenu"
                                tabIndex="2"
                                className="form-login__checkbox"
                            /> 
                            <div className={styles.switchOn}>
                               <div className={checked ? styles.switchOnIcon : styles.switchOffIcon}></div>
                            </div>
                        </div>
                        <div className={styles.addCategoryActions}>
                            <button
                                disabled={categoryName ? false : true}
                                className={categoryName ? styles.addCategoryBtn : styles.addCategoryDisabledBtn}
                                type='submit'
                                tabIndex="3"
                            >
                                Criar
                            </button>                        
                            <button
                                onClick={onClickCancel}
                                className={styles.cancelAddCategoryBtn}
                                type='button'
                                tabIndex="4"
                            >
                                Cancelar
                            </button>                            
                        </div>
                    </form>
            }
        </div>
    );
};

export default AdminProductCategories;