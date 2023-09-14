import axios from 'axios';
import React from 'react';
import styles from './UpdateType.module.scss';
import { AuthContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import { fetchAndUpdateType } from '../../http/productAPI';

const UpdateType = ({typeItem}) => {

    const { setUpdateTypeMode, serverDomain } = React.useContext(AuthContext);    
    const navigate = useNavigate();
    const inputRef = React.useRef();
    const [visibility, setVisibility] = React.useState(false);
    const [categories, setCategories] = React.useState([]);
    const [name, setName] = React.useState('');
    const [categoryId, setCategoryId] = React.useState(1);
    const [categoryName, setCategoryName] = React.useState('Selecione a Categoria');
    const [img, setImg] = React.useState(null);

    React.useEffect(() => {
        setName(typeItem.name); 
        const category = categories.find(category => category.id === typeItem.categoryId);
        if (category) {
            setCategoryName(category.name ? category.name : categoryName);            
        }
    }, [typeItem, categories]);

    const success = () => {
        window.alert('Tipo atualizado com sucesso!');
        setUpdateTypeMode(false);  
        navigate('/auth');
        window.scrollTo(0, 0);        
    }

    const closePopup = () => {
        setUpdateTypeMode(false); 
    }

    const toggleOptions = () => {
        if (visibility) {
            setVisibility(false);        
        } else {
            setVisibility(true);            
        }
    }

    const hideOptions = (id, name) => {
        setCategoryId(id);
        setCategoryName(name);
        setVisibility(false);        
    }

    React.useEffect(() => {
        axios.get(`${serverDomain}api/category`)
            .then((res) => {
                setCategories(res.data);
            });
    }, []);

    const submenuCategories = categories.filter((category) => category.subMenu);

    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const selectFile = (event) => {
        setImg(event.target.files[0]);
    }

    const updateTypeItem = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const id = typeItem.id;
        formData.set('name', name);
        formData.set('img', img);
        formData.set('category', categoryId);
        fetchAndUpdateType(formData, id).then(data => success());
    }

    return (
        <div className={styles.createType}>
            <form onSubmit={updateTypeItem} className={styles.formType}>
                <div className={styles.line}>
                    <label htmlFor="type-name" className={styles.label} placeholder='Name'>Nome:</label>
                    <input id="type-name" required tabIndex="1" type='text' className={styles.formInput}
                        ref={inputRef}
                        value={name}
                        onChange={onChangeName}
                    />                    
                </div>
                <div className={styles.line}>
                    <label htmlFor="type-category" className={styles.label}>Categoria:</label>
                    <div id="type-category" required tabIndex="2" className={styles.formSelect} onClick={toggleOptions}>
                        {categoryName}
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                            <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                        </svg>
                    </div>
                    {visibility ? 
                        <div className={styles.options}>
                            {submenuCategories.map((category) => 
                                <div key={category.name} onClick={() => hideOptions(category.id, category.name)} className={styles.option}>{category.name}</div>
                            )}                         
                        </div>  
                        : ''
                    }
                </div>
                <svg className={styles.closePopup} onClick={closePopup} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 352 512">
                    <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
                </svg> 
                <div className={styles.line}>
                    <label htmlFor="type-file" className={styles.label}>Imagem:</label>
                    <input id="type-file" required tabIndex="3" type='file' className={styles.formFile}
                        onChange={selectFile}
                    />                    
                </div>
                <button type='submit' tabIndex='4' className={styles.button}>Tipo de atualização</button>
            </form>            
        </div>

    );
};

export default UpdateType;