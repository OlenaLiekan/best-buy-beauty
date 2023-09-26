import React from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../componetns/Loader';
import NotFoundProduct from '../componetns/NotFoundProduct';
import { camelize } from '../js/script';
import { useDispatch } from 'react-redux';
import { setBrandId } from '../redux/slices/filterSlice';
import { AuthContext } from '../context';
import CreateType from '../componetns/CreateType';
import UpdateType from '../componetns/UpdateType';

const Catalog = () => { 

    const dispatch = useDispatch();
    const [catalogItems, setCatalogItems] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [typeItem, setTypeItem] = React.useState({});
    const [typeId, setTypeId] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true); 
    const {
        isAuth,
        adminMode,
        createTypeMode,
        setCreateTypeMode,
        updateTypeMode,
        setUpdateTypeMode,
        serverDomain,
        imagesCloud
    } = React.useContext(AuthContext);

    const onChangeBrand = (id) => {
        dispatch(setBrandId(id));
    }

    React.useEffect(() => {
        setIsLoading(true);
        axios
            .get(
                `${serverDomain}api/type`,
            )
            .then((res) => {
                setCatalogItems(res.data);
                setIsLoading(false);
            });
        window.scrollTo(0, 0);
    }, []);
    
    React.useEffect(() => {
        setIsLoading(true);
        axios
            .get(
                `${serverDomain}api/category`,
            )
            .then((res) => {
                setCategories(res.data);
                setIsLoading(false);
            });
        window.scrollTo(0, 0);
    }, []);
    
    const removeType = (id) => {
        if (window.confirm('Tem certeza de que deseja excluir o tipo?')) {
            axios.delete(`${serverDomain}api/type?id=${id}`)
                .then(() => {
                    window.alert('O tipo foi excluído com sucesso!');
                });      
        } else {
            window.alert('Cancelar exclusão.');
        }
    }

    React.useEffect(() => {
        if (typeId) {
            axios.get(`${serverDomain}api/type/${typeId}`)
                .then((res) => {
                    setTypeItem(res.data);
                }); 
            if (typeItem) {
                setUpdateTypeMode(true);
                setCreateTypeMode(false);
                window.scrollTo(0, 0);
            }                 
        }
    }, [typeId]);

    const createModeOn = () => {
        setCreateTypeMode(true);
        setUpdateTypeMode(false);
    }

    React.useEffect(() => {
        if (!updateTypeMode) {
            setTypeId('');
        }
    }, [updateTypeMode]);


    return (
        <div className="main__catalog catalog">
            <div className="catalog__container">
                <div className="catalog__content">
                    {isAuth && adminMode && createTypeMode ? <CreateType /> : ''}      
                    { isAuth && adminMode && updateTypeMode ? <UpdateType typeItem={typeItem} /> : ''}  
                    {isLoading ? <Loader /> : 
                        <div className="catalog__items">  
                            <div className={isAuth && adminMode && !createTypeMode ? "catalog__item item-catalog" : 'item-catalog_hidden'}>
                                <div className="item-catalog__content">
                                    <div className='item-catalog__add' onClick={createModeOn}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                                            <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z" />
                                        </svg>                                        
                                    </div>
                                </div>
                            </div>    
                            {catalogItems.slice(1).map((catalogItem) => 
                                    <div onClick={() => onChangeBrand(0)} key={catalogItem.id} value={catalogItem.name} className="catalog__item item-catalog">
                                        <div className="item-catalog__content">
                                            <div className={isAuth && adminMode ? 'item-catalog__actions' : 'item-catalog__actions_hidden'}>
                                                <svg className='delete-category' onClick={() => removeType(catalogItem.id)} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                                    <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z" />
                                                </svg>
                                                <svg className='update-category' onClick={() => setTypeId(catalogItem.id)} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                                    <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
                                                </svg>                                                
                                            </div>
                                      
                                            {categories.map((category) =>  
                                                
                                            <h3 key={category.id} className="item-catalog__category">  
                                                <span className={category.id === catalogItem.categoryId ? "item-catalog__name" : "item-catalog__name_hidden"} value={category.name}>
                                                    { category.name } 
                                                </span>
                                            </h3> 
                                            )}  

                                            <Link to={`/${camelize(catalogItem.name)}`}>
                                                <div className="item-catalog__image">
                                                    <img src={`${serverDomain}` + catalogItem.img} alt="category" />
                                                </div>                                                 
                                            </Link>
                                        </div>
                                        <Link to={`/${camelize(catalogItem.name)}`}>
                                            <h2 className="item-catalog__title">
                                                {catalogItem.name}
                                            </h2>                                            
                                        </Link>
                                    </div>
                            )      
                            }    
                        </div>                                 
                    }
                    {catalogItems.length < 1 && !isLoading ? <NotFoundProduct/> : ''}                    
                </div>
            </div>   
      </div>
    );
};

export default Catalog;