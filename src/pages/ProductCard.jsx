import React from 'react';
import ProductItem from '../componetns/ProductItem';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../componetns/Loader';


const ProductCard = ({type}) => {
    const [item, setItem] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true); 

    const navigate = useNavigate();
    const {id} = useParams(); 

    React.useEffect(() => {
        setIsLoading(true);
        async function fetchProduct() {
            const { data } = await axios
                .get(
                    `http://localhost:3001/api/product/`+ id,
            );
            if (data) {
                setItem(data);
                setIsLoading(false);                    
            } else {
                window.alert('Produto não encontrado!');
                navigate('/');
            }
        }
        window.scrollTo(0, 0);
        fetchProduct();
    }, [id]);   

    return (
        <div className="main__product-card product-card">
            <div className="product-card__container">
                {isLoading ? <Loader /> : <ProductItem obj={item} key={item.id} {...item} />}
            </div>
        </div>
    );
};

export default ProductCard;