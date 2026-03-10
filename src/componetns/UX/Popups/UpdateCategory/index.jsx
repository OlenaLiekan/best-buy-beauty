import React from 'react';
import styles from './UpdateCategory.module.scss';
import { AuthContext } from '../../../../context';
import { fetchAndUpdateType, updateCategory } from '../../../../http/productAPI';
import axios from 'axios';

const UpdateCategory = ({categoryItem}) => {

    const inputRef = React.useRef();
    const { setUpdateCategoryMode, serverDomain } = React.useContext(AuthContext);

    const [name, setName] = React.useState('');
    const [type, setType] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        setName(categoryItem.name);   
    }, [categoryItem]);

    React.useEffect(() => {
        if (categoryItem && !categoryItem.subMenu) {
            setIsLoading(true);
            axios
                .get(
                    `${serverDomain}api/type?categoryId=${categoryItem.id}`,
                )
                .then((res) => {
                    if (res.data.length > 0) {
                        setType(res.data[0]);                        
                    }
                    setIsLoading(false);
                });
        }
    }, [serverDomain, categoryItem]);

    const successType = () => {
        window.alert('Tipo atualizado com sucesso!');
        setUpdateCategoryMode(false);  
    };

    
    const message = () => {
        window.alert('Ocorreu um erro!');
    };

    const success = () => {
        window.alert('Categoria atualizada com sucesso!');
        if (!categoryItem.subMenu && type) {
            const typeId = type.id;
            const formData = new FormData();
            formData.set('name', name);
            fetchAndUpdateType(formData, typeId).then(data => successType()).catch(err => message());
        }
        setUpdateCategoryMode(false);  
        window.scrollTo(0, 0);
    }

    const onChangeName = (event) => { 
        setName(event.target.value);
    };

    const closeUpdatePopup = () => {
        setUpdateCategoryMode(false);
    }

    const pushCategory = (e) => {
        e.preventDefault();
        const id = categoryItem.id;
        const formData = new FormData();
        formData.set('name', name);
        updateCategory(formData, id).then(data => success()).catch(err => message());
    }

    return (
        <div className={styles.updateCategory}>
            <svg onClick={closeUpdatePopup} className={styles.close} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 352 512">
                <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
            </svg>
            <form onSubmit={pushCategory} className={styles.formCategory}>
                <div className={styles.line}>
                    <label htmlFor="category-name" className={styles.label}>Nome:</label>
                    <input id="category-name" required tabIndex="1" type='text' className={styles.formInput}
                        ref={inputRef}    
                        value={name}
                        onChange={onChangeName} />                   
                </div>

                <button type='submit'tabIndex='2' className={styles.button}>Atualizar categoria</button>
            </form>            
        </div>
    );
};

export default UpdateCategory;