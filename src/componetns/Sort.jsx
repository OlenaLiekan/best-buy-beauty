import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSort } from '../redux/slices/filterSlice';

function Sort({arrItem}) {

  const dispatch = useDispatch();
  const sort = useSelector(state => state.filter.sort);
  const sortRef = React.useRef();

  const [open, setOpen] = React.useState(false);
  const list = [
    { name: 'popularidade', sortProperty: 'rating' },
    { name: 'preço mais alto', sortProperty: 'price' },
    { name: 'preço mais baixo', sortProperty: '-price' },
    { name: 'nome A - Z', sortProperty: '-name' }, 
    { name: 'nome Z - A', sortProperty: 'name' },   
  ];
  const onClickListItem = (obj) => {
    dispatch(setSort(obj));
    setOpen(false);
  }

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.composedPath().includes(sortRef.current)) {  
        setOpen(false);
      }
    };
    document.body.addEventListener('click', handleClickOutside);
    return () => document.body.removeEventListener('click', handleClickOutside);
  }, []);

return (
    <div ref={sortRef} className="product-main__sort sort-product">
        <div className="sort-product__body">
            Classificar por:
            <div className="sort-product__popup popup-sort">
                <span className="popup-sort__label" onClick={() => setOpen(!open)}>{sort.name}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                  </svg>            
                </span>
                {open && (
                  <div className="sort__popup">
                    <ul className="popup-sort__list list-popup-sort">
                        {
                        list.map((obj, i) => (
                          <li
                            key={i}
                            onClick={() => onClickListItem(obj)}
                            className={sort.sortProperty === obj.sortProperty ? 'active' : ''}>
                              {obj.name}
                          </li>
                        ))
                        }
                    </ul>
                  </div>
                )}
            </div>
        </div>
    </div>
  );
}

export default Sort;