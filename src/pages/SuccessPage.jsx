import React from "react";
import { Link, useLocation } from "react-router-dom";
import { clearItems } from "../redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { scrollTop } from "../js/script";
import { AuthContext } from "../context";
import { updateUser } from "../http/userAPI";
import axios from "axios";

const SuccessPage = () => {
  const dispatch = useDispatch();
  const { adminMode } = React.useContext(AuthContext);
  const [detailsVisibility, setDetailsVisibility] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [existingPromocode, setExistingPromocode] = React.useState('');
  const { serverDomain, imagesCloud} = React.useContext(AuthContext);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const method = queryParams.get("method");
  const referenceData = queryParams.get("data");
  const data = localStorage.getItem("user") ? localStorage.getItem("user") : "";
  const user = data ? JSON.parse(data) : "";
  const orderId = localStorage.getItem("orderId");
  const orderDate = localStorage.getItem("orderDate");
  const orderTotal = localStorage.getItem("orderTotal");
  const clientName = localStorage.getItem("clientName");
  const clientLastName = localStorage.getItem("clientSurname");
  const clientCompany = localStorage.getItem("clientCompany");
  const clientAddress = localStorage.getItem("clientAddress");
  const clientPhone = localStorage.getItem("clientPhone");
  const clientEmail = localStorage.getItem("clientEmail");
  const clientComment = localStorage.getItem("clientComment")
    ? localStorage.getItem("clientComment")
    : "Sem comentários";
  const promocodeDiscount = localStorage.getItem('promocodeDiscount') ? localStorage.getItem('promocodeDiscount') : '';
  const promocode = localStorage.getItem('promocode') ? localStorage.getItem('promocode') : '';
  const totalCount = localStorage.getItem("totalCount");
  const deliveryPrice = localStorage.getItem("deliveryPrice");
  const clientOrder = localStorage.getItem("clientOrder");
  const items = JSON.parse(clientOrder);
  dispatch(clearItems());

  const toggleDetails = () => {
    if (detailsVisibility) {
      setDetailsVisibility(false);
    } else {
      setDetailsVisibility(true);
    }
  };

  const savePromocode = () => {
    const formData = new FormData();
    const id = user.id;
    formData.append('promocode', promocode);
    formData.append('orderId', orderId);
    formData.append('userId', id);
    updateUser(formData, id);
  };

  React.useEffect(() => {
    if (promocode && user) {
      setIsLoading(true);
      axios.get(`${serverDomain}api/user/${user.id}`)
        .then((res) => {
          setExistingPromocode(res.data.promocode.find((item) => item.name === promocode));
          setIsLoading(false);
        });
    }
  }, [promocode]);

  React.useEffect(() => {
    if (!existingPromocode && !isLoading) {
      savePromocode();
    }
  }, [existingPromocode, isLoading]);

  return (
    <div className="main__success success-main">
      <div className="success-main__container">
        <div className="success-main__content">
          {orderId ? (
            <>
              <h2 className="success-main__title">
                Olá{clientName ? ", " + clientName : ""}!
              </h2>
              <div className="success-main__body body-success">
                <p className="body-success__text body-success__text_gold">
                  Obrigado pela sua compra!
                </p>

                <p className="body-success__text bottom-line">
                  {method === "REFERENCE" && referenceData
                    ? "Referência para pagamento:"
                    : "Pagamento concluído com o método:"}
                </p>

                <div className="body-success__block bottom-line">
                  {method === "REFERENCE" && referenceData ? (
                    <>
                      <div className="body-success__line">
                        <div>Referência</div>
                        <div>{JSON.parse(referenceData).reference}</div>
                      </div>
                      <div className="body-success__line">
                        <div>Entidade</div>
                        <div>{JSON.parse(referenceData).entity}</div>
                      </div>
                      <div className="body-success__line">
                        <div>Valor</div>
                        <div>{JSON.parse(referenceData).value} €</div>
                      </div>
                    </>
                  ) : (
                    <div className="body-success__line">
                      <div>Método de pagamento</div>
                      <div>
                        {method === "CARD"
                          ? "Cartão de multibanco"
                          : method === "REFERENCE"
                          ? "Referência de multibanco"
                          : method || "Carregando..."}
                      </div>
                    </div>
                  )}
                </div>

                {method === "REFERENCE" && (
                  <>
                    <p className="body-success__text">
                      Começaremos a preparar o seu pedido logo que recebermos a
                      confirmação do pagamento.
                    </p>
                    <p className="body-success__text">
                      Estes são os dados de que precisa para concluir a compra
                      num multibanco ou online.
                    </p>
                    <p className="body-success__text">
                      Tenha presente que terá de realizar o pagamento no máximo{" "}
                      <span className="bold">de 3 dias</span> corridos.
                    </p>
                  </>
                )}

                <p className="body-success__text">
                  Data estimada de entrega: 1 a 2 dias úteis após o recebimento do pagamento da sua compra.
                </p>
                <h4 className="success-main__subtitle bottom-line">
                  Dados do pedido
                </h4>
                <div className="body-success__block bottom-line">
                  <div className="body-success__line">
                    <div>№ de pedido</div>
                    <div>{orderId}</div>
                  </div>
                  <div className="body-success__line">
                    <div>Data do pedido</div>
                    <div>{orderDate}</div>
                  </div>
                  <div className="body-success__line">
                    <div>Envio para o domicílio</div>
                  </div>
                  <p className="body-success__address">{clientCompany}</p>
                  <p className="body-success__address">
                    {clientName + " " + clientLastName}
                  </p>
                  <p className="body-success__address">{clientAddress}</p>
                  <p className="body-success__address">
                    Tel.{" " + clientPhone}
                  </p>
                  <p className="body-success__address">{clientEmail}</p>
                  <p className="body-success__address bottom-line">
                    Um comentário: {clientComment}
                  </p>
                  <div className="body-success__line">
                    <div>Quantidade total</div>
                    <div>{totalCount}</div>
                  </div>
                  <div
                    onClick={toggleDetails}
                    className="body-success__line body-success__line_cursor"
                  >
                    <div>
                      {detailsVisibility ? "Menos detalhes" : "Mais detalhes"}
                    </div>
                    <svg
                      className={detailsVisibility ? "rotate" : ""}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                    </svg>
                  </div>
                  {items.map((item, i) => (
                    <div
                      className={
                        detailsVisibility
                          ? "body-success__items"
                          : "body-success__items_hidden"
                      }
                      key={i}
                    >
                      <div className="body-success__line-image">
                        <img src={`${imagesCloud}` + item.img} alt="product" />
                      </div>
                      <div className="body-success__line-aside">
                        <p className="bold">
                          {item.name}
                        </p>
                        <div className="body-success__line-price">
                          <div>{item.company} ({item.code}) x {item.count}</div>
                          <span>{(item.price * item.count).toFixed(2)} €</span>
                        </div>
                        {item.isLashes &&
                          <div className="body-success__line-info">
                            {item.curlArr && item.curlArr + (item.thicknessArr || item.lengthArr ? ' / ' : '')}
                            {item.thicknessArr && item.thicknessArr + ' mm' + (item.lengthArr && ' / ')}
                            {item.lengthArr && item.lengthArr + ' mm'}                          
                          </div>                        
                        }
                        <div className="body-success__line-info">
                          {item.info && !item.isLashes
                            ? item.info.map((p, i) => (
                                <span key={i}>
                                  {p.description}
                                  {item.info.length !== (i + 1) && <span> / </span>}
                                </span>
                              ))
                            : ""}                        
                        </div>
                      </div>                      
                    </div>
                  ))}
                  <div className="body-success__line">
                    <div>Custo de entrega</div>
                    <div>{deliveryPrice} €</div>
                  </div>
                  {
                    promocodeDiscount 
                      ?
                      <div className="body-success__line">
                        <div>Desconto {promocode}</div>
                        <div>- {promocodeDiscount} €</div>
                      </div>                      
                      :
                      ''
                  }
                  <div className="body-success__line body-success__line_bold">
                    <div>Valor total</div>
                    <div>{orderTotal} €</div>
                  </div>
                </div>
                {user && !adminMode ? (
                  <Link to="/auth" onClick={() => window.scrollTo(0, 0)} className="body-success__button checkout">
                    Ver a minha compra
                  </Link>
                ) : (
                  <Link
                    to="/"
                    onClick={() => window.scrollTo(0, 0)}
                    className="body-success__button go-shopping scroll-top"
                  >
                    Voltar à página inicial
                  </Link>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="success-main__body body-success">
                <p className="body-success__text">
                  Esta página exibe informações para pagamento do pedido.
                </p>
                <p className="body-success__text">
                  Você ainda não tem um pedido.
                </p>
                <svg
                  className="body-success__svg"
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z" />
                </svg>
                <Link
                  to="/"
                  onClick={scrollTop}
                  className="body-success__button go-shopping scroll-top"
                >
                  Voltar à página inicial
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
