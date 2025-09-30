import React from 'react';

import styles from './AdminPanel.module.scss';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context';
import { setCategoryId } from '../../redux/slices/filterSlice';
import { useDispatch } from 'react-redux';

import AdminInitial from './AdminInitial';
import AdminPromocodes from './AdminPromocodes';
import AdminPromotion from './AdminPromotion';
import AdminProductCategories from './AdminProductCategories';
import AdminProductAvailability from './AdminProductAvailability';
import AdminTestimonials from './AdminTestimonials';
import AdminDeliveryPrices from './AdminDeliveryPrices';
import AdminOrders from './AdminOrders';

const AdminPanel = () => {

    const [path, setPath] = React.useState('');
    const { activeAuthOption } = React.useContext(AuthContext);

    const navigate = useNavigate();
    const dispatch = useDispatch();
   
    React.useEffect(() => {
        if (path) {
            if (path === 'produtos?sortProperty=rating&categoryId=0&brandId=0&currentPage=1') {
                dispatch(setCategoryId(0));
                localStorage.removeItem('categoryId');
                localStorage.removeItem('subItems');
            }
            navigate(`/${path}`);
            window.scrollTo(0, 0);
        }
    }, [path, navigate, dispatch]);

    return (
        <div className={styles.body}>

                { activeAuthOption === 0 && <AdminInitial/> }

                { activeAuthOption === 1 && <AdminProductCategories/> }
                
                { activeAuthOption === 2 && <AdminProductAvailability/> }
                
                { activeAuthOption === 3 && <AdminPromocodes/> }

                { activeAuthOption === 4 && <AdminPromotion/> }

                { activeAuthOption === 5 && <AdminTestimonials/> }

                {activeAuthOption === 6 && <AdminDeliveryPrices />}
                
                { activeAuthOption === 7 && <AdminOrders/> }

        </div>

    );
};

export default AdminPanel;