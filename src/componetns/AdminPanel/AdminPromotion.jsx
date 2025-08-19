import React from 'react';
import { AuthContext } from '../../context';
import styles from './AdminPanel.module.scss';

const AdminPromotion = () => {

    const { isBlackFriday } = React.useContext(AuthContext);

    return (
        <div className={styles.promotionBlock}>
            <h4>Lançamento da promoção</h4>
            <div className={styles.promotionBody}>
                <ul className={styles.promotionItems}>
                    <li className={styles.promotionItem}>
                        <div className={styles.promotionTop}>
                            <div className={styles.promotionTopLine}>
                                <span className={styles.promotionTopLabel}>
                                    Nome:
                                </span>
                                Promoção
                            </div>
                            <div className={styles.promotionTopLine}>
                                <span className={styles.promotionTopLabel}>
                                    Data válida:
                                </span>
                                19.08.2025 - 24.08.2025
                            </div>
                            <div className={styles.promotionTopLine}>
                                <span className={styles.promotionTopLabel}>
                                    Status:
                                </span>
                                <span className={
                                    isBlackFriday
                                        ?
                                        styles.promotionStatusOn
                                        :
                                        styles.promotionStatusOff
                                }>
                                    {isBlackFriday ? " Ativo" : " Concluído"}
                                </span>
                            </div>                        
                        </div>
                        <div className={styles.promotionBottom}>
                            <div className={styles.promotionBottomLabel}>
                                Aplica-se a marcas:
                            </div>
                            <ul className={styles.promotionBrands}>
                                <li className={styles.promotionBrand}>
                                    <div className={styles.promotionBrandName}>
                                        oh OCHI
                                    </div>
                                    <div className={styles.promotionBrandPercent}>- 10%</div>
                                </li>
                            </ul>
                        </div>                        
                    </li>
                </ul>
            </div>
          
        </div>
    );
};

export default AdminPromotion;