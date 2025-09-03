import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
//import { clearItems } from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../http/userAPI";
import axios from "axios";
import { AuthContext } from "../context";
//import { sendEmail } from "../http/productAPI";

import { submitPurchase } from "../http/productAPI";
import { bodyLock, checkedCheckbox, closePopup } from "../js/script";
import { getCountryCallingCode, getCountries } from "libphonenumber-js";
import DeliveryConditions from "../componetns/UX/Popups/DeliveryConditions";

const SubmitPage = () => {
  //const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { totalPrice, items } = useSelector((state) => state.cart);
  const totalCount = items.reduce(
    (sum, item) =>
      !item.available && item.available !== "undefined"
        ? sum
        : sum + item.count,
    0
  );

  const { serverDomain, imagesCloud, isAuth, setShowConditions, showConditions} = React.useContext(AuthContext);

  const [deliveryPrices, setDeliveryPrices] = React.useState([]);
  const [deliveryPrice, setDeliveryPrice] = React.useState("0.00");
  const [orderNumber, setOrderNumber] = React.useState("");
  const [isPortugal, setIsPortugal] = React.useState(0);
  const [isSpain, setIsSpain] = React.useState(0);  
  const [username, setUsername] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [phone, setPhone] = React.useState("+351");
  const [email, setEmail] = React.useState("");
  const [firstAddress, setFirstAddress] = React.useState("");
  const [secondAddress, setSecondAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [country, setCountry] = React.useState("PT");
  const [telCode, setTelCode] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [addresses, setAddresses] = React.useState([]);
  const [mainData, setMainData] = React.useState({});
  const [visibleList, setVisibleList] = React.useState(false);
  const [paymentDetails, setPaymentDetails] = React.useState([]);
  const [mbWayPayments, setMbWayPayments] = React.useState([]);
  const [payment, setPayment] = React.useState("");
  const [resetForm, setResetForm] = React.useState(false);
  //const [timeMark, setTimeMark] = React.useState(6);
  const [showPromocodeBlock, setShowPromocodeBlock] = React.useState(false);
  const [showCommentTextarea, setShowCommentTextarea] = React.useState(false);
  const [showAddressForm, setShowAddressForm] = React.useState(false);

  const [brands, setBrands] = React.useState([]);

  const [promocode, setPromocode] = React.useState('');
  const [availablePromocode, setAvailablePromocode] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [promocodes, setPromocodes] = React.useState([]);
  const [promocodeValue, setPromocodeValue] = React.useState(0);
  const [userPromocodes, setUserPromocodes] = React.useState([]);
  const [usedPromocode, setUsedPromocode] = React.useState('');
  const [promocodeBrandId, setPromocodeBrandId] = React.useState(0);
  const [promocodeBrandName, setPromocodeBrandName] = React.useState('');
  const [promocodeReusable, setPromocodeReusable] = React.useState(false);

  const [countryValue, setCountryValue] = React.useState('');
  const [checked, setChecked] = React.useState(false);

  const data = localStorage.getItem("user") ? localStorage.getItem("user") : "";
  const user = data ? JSON.parse(data) : "";
  const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const orderItems = items.filter((item) => item.available);


  const promoItems = promocodeBrandName && promocodeBrandId > 0
    ?
    items.filter((item) => item.company === promocodeBrandName)
    :
    []; 
  
  const promoItemsPrices = promoItems ? promoItems.map((item) => item.price * item.count) : [];
  const promoItemsSum = promoItemsPrices.length > 0 ? promoItemsPrices.reduce((sum, price) => sum + Number(price), 0) : totalPrice;

  const finalSum = promocodeValue && availablePromocode && message ? (totalPrice - (promoItemsSum * promocodeValue / 100 ).toFixed(2)) : totalPrice;

  React.useEffect(() => {
    axios.get(`${serverDomain}api/brand`).then((res) => {
      setBrands(res.data);
    });
  }, [serverDomain]);

  React.useEffect(() => {
      axios.get(`${serverDomain}api/promocode`).then((res) => {
      setPromocodes(res.data);
    });
  }, [serverDomain, availablePromocode]);

  React.useEffect(() => {
    if (user) {
      axios.get(`${serverDomain}api/user/${user.id}`)
        .then((res) => {
          setUserPromocodes(res.data.promocode);
        });
    }
  }, [user.id]);

  React.useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const error = queryParams.get("error");
    if (error) {
      window.alert(decodeURIComponent(error));
    }
  }, [location]);

  React.useEffect(() => {
    let random = symbols[Math.floor(Math.random() * symbols.length)];
    let newSymbols = "";
    while (newSymbols.length < 7) {
      newSymbols += random;
      random = symbols[Math.floor(Math.random() * symbols.length)];
    }
    setOrderNumber(newSymbols);
  }, [items]);

  React.useEffect(() => {
    if (country === "PT") {
      setIsPortugal(true);
      setIsSpain(false);
    } else {
      setIsPortugal(false);
      if (country === "ES") {
        setIsSpain(true);
        setIsPortugal(false);
      } else {
        setIsSpain(false);
      }
    }
  }, [country, isPortugal, isSpain]);


  React.useEffect(() => {
    axios.get(`${serverDomain}api/delivery`).then((res) => {
      setDeliveryPrices(res.data);
    });
  }, [serverDomain]);

  React.useEffect(() => {
    if (user) {


    if (deliveryPrices.length) {
      const oneProduct = deliveryPrices.find(
        (delivery) => delivery.type === "Um produto"
      );
      const moreProducts = deliveryPrices.find(
        (delivery) => delivery.type === "Mais produtos"
      );
      const freeDelivery = deliveryPrices.find(
        (delivery) => delivery.type === "Entrega grátis"
      );
      const otherCountry = deliveryPrices.find(
        (delivery) => delivery.type === "Outro país"
      );
      const spain = deliveryPrices.find(
        (delivery) => delivery.type === "Espanha"
      );

      const oneProductAz = deliveryPrices.find(
        (delivery) => delivery.type === "Um produto (Açores)"
      );
      const moreProductsAz = deliveryPrices.find(
        (delivery) => delivery.type === "Mais produtos (Açores)"
      );
      const freeDeliveryAz = deliveryPrices.find(
        (delivery) => delivery.type === "Entrega grátis (Açores)"
      );

      if (isPortugal) {
        if (postalCode && postalCode[0] == 9) {
          if (postalCode.length == 8) {
            window.alert('Prestar atenção! Os custos de envio para as Ilhas dos Açores são calculados de forma diferente.');
          }
          if (totalCount === 1 && totalPrice < freeDeliveryAz.requiredSum) {
            setDeliveryPrice(oneProductAz.price);
          } else if (totalCount > 1 && totalPrice < freeDeliveryAz.requiredSum) {
            setDeliveryPrice(moreProductsAz.price);
          } else {
            setDeliveryPrice(freeDeliveryAz.price);
          }
        } else {
          if (totalCount === 1 && totalPrice < freeDelivery.requiredSum) {
            setDeliveryPrice(oneProduct.price);
          } else if (totalCount > 1 && totalPrice < freeDelivery.requiredSum) {
            setDeliveryPrice(moreProducts.price);
          } else {
            setDeliveryPrice(freeDelivery.price);
          }          
        }
      } else if (isSpain) {
          setDeliveryPrice(spain.price);  
      } else {
        setDeliveryPrice(otherCountry.price);          
      }
      }
    }
  }, [totalCount, totalPrice, deliveryPrices, isPortugal, isSpain, postalCode]);

  React.useEffect(() => {
    if (user.id && !mainData) {
      setUsername(user.firstName);
      setSurname(user.lastName);
      setPhone(user.phone);
      setEmail(user.email);
    }
    if (user.id && mainData) {
      setUsername(mainData.firstName ? mainData.firstName : user.firstName);
      setSurname(mainData.lastName ? mainData.lastName : user.lastName);
      setPhone(mainData.phone ? mainData.phone : user.phone);
      setEmail(mainData.email ? mainData.email : user.email);
      setCompany(mainData.company ? mainData.company : company);
      setFirstAddress(mainData.firstAddress);
      setSecondAddress(
        mainData.secondAddress ? mainData.secondAddress : secondAddress
      );
      setCountry(mainData.country ? mainData.country : country);
      setCity(mainData.city);
      setRegion(mainData.region);
      setPostalCode(mainData.postalCode);
    }
    if (resetForm) {
      setUsername("");
      setSurname("");
      setPhone("");
      setEmail("");
      setCompany("");
      setFirstAddress("");
      setSecondAddress("");
      setCountry("PT");
      setCity("");
      setRegion("");
      setPostalCode("");
    }
  }, [mainData, user.id, resetForm]);

  React.useEffect(() => {
    if (user.id) {
      axios.get(`${serverDomain}api/user/${user.id}`).then((res) => {
        setAddresses(res.data.address);
      });
    }
  }, [isAuth, serverDomain, user.id]);

  React.useEffect(() => {
    if (addresses.length) {
      setMainData(addresses.find((address) => address.mainAddress));
    }
  }, [addresses]);

  React.useEffect(() => {
    axios.get(`${serverDomain}api/payment`).then((res) => {
      setPaymentDetails(res.data);
      setMbWayPayments(
        res.data
          .filter((payment) => payment.type === "MBway")
          .filter((mbw) => mbw.available)
      );
    });
  }, [serverDomain]);

  React.useEffect(() => {
    const result = paymentDetails.length
      ? '<b style="font-size: 120%;"><span style="padding: 0 0 20px 0;">IBAN </span></b><br>' +
        paymentDetails[0].account +
        '<br><br><b style="font-size: 120%;"><span style="padding: 0 0 20px 0;">Nome </span></b><br>' +
        paymentDetails[0].recipient +
        '<br><br><b style="font-size: 120%;"><span style="padding: 0 0 20px 0;">MBway </span></b>' +
        (mbWayPayments.length
          ? mbWayPayments.map((mbp) => `<br><span>${mbp.account}</span>`)
          : "<br><span>Temporariamente indisponível</span>")
      : "";
    setPayment(result);
  }, [paymentDetails, mbWayPayments]);

  React.useEffect(() => {
    if (telCode) {
      setPhone(telCode);
    }
  }, [telCode]);

  React.useEffect(() => {
    if (promocodeBrandId > 0) {
      setPromocodeBrandName(
        brands.length > 0
          ?
          brands.find((brand) => brand.id == promocodeBrandId)?.name
          :
          ''
      )
    }
  }, [promocodeBrandId, brands]);

  const countries = getCountries().map((countryCode) => {
    return {
      code: countryCode,
      name: new Intl.DisplayNames(["pt"], { type: "region" }).of(countryCode),
      telCode: `+${getCountryCallingCode(countryCode)}`,
    };
  });

  const onChangeCompany = (event) => {
    setCompany(event.target.value.slice(0, 9));
  };

  const onChangeUsername = (event) => {
    setUsername(
      event.target.value
        ? event.target.value[0].toUpperCase() + event.target.value.slice(1)
        : ""
    );
  };

  const onChangeSurname = (event) => {
    setSurname(
      event.target.value
        ? event.target.value[0].toUpperCase() + event.target.value.slice(1)
        : ""
    );
  };

  const onChangePhone = (event) => {
    setPhone(event.target.value.slice(0, 13));
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value.toLowerCase());
  };

  const onChangeFAddress = (event) => {
    setFirstAddress(event.target.value.split(',').join(' '));
  };

  const onChangeSAddress = (event) => {
    setSecondAddress(event.target.value.split(',').join(' '));
  };

  const onChangeCity = (event) => {
    setCity(
      event.target.value
        ? (event.target.value[0].toUpperCase() + event.target.value.slice(1)).split(',').join(' ')
        : ""
    );
  };

  const onChangeComment = (event) => {
    setComment(event.target.value);
  };

  const showCountries = () => {
    if (!visibleList) {
      setVisibleList(true);
    } else {
      setVisibleList(false);
      setCountryValue('');
    }
  };

  const onChangeCountry = (countryCode) => {
    setCountry(countryCode);
    const newTelCode = `+${getCountryCallingCode(countryCode)}`;
    setPhone(newTelCode);
    setVisibleList(false);
    setCountryValue('');
    if (countryCode !== "PT") {
      window.alert(`Atenção!\nOs custos de entrega foram ajustados dependendo do país de entrega.`);      
    }
  };

  const onChangeCountryValue = (event) => {
    setCountryValue(event.target.value);
  };

  const onChangeRegion = (event) => {
    setRegion(
      event.target.value
        ? (event.target.value[0].toUpperCase() + event.target.value.slice(1)).split(',').join(' ')
        : ""
    );
  };

  const onChangePostalCode = (event) => {
    if (country === "PT") {
      if (event.target.value.length > 4 && event.target.value[4] !== "-") {
        setPostalCode(
          event.target.value.slice(0, 4) + "-" + event.target.value.slice(4, 8)
        );
      } else {
        setPostalCode(event.target.value.slice(0, 8));
      }
    } else {
      setPostalCode(event.target.value.slice(0, 10));
    }
  };

  const onChangePromocode = (e) => {
    setAvailablePromocode(false);
    setMessage('');
    setPromocode(e.target.value.trim());
  }

  React.useEffect(() => {
    if (promocode && promocodes) {
      const match = promocodes.find((code) => promocode.toLowerCase() === code.name.toLowerCase());
      setPromocodeReusable(match ? match.reusable : false);
      setPromocodeBrandId(match ? match.brandId : 0);
      const usedPromo = userPromocodes.length ? userPromocodes.find((item) => item.name.toLowerCase() === promocode.toLowerCase()) : '';
      if (match) {
        if (usedPromo) {
          if (match.reusable) {
            setAvailablePromocode(true);
            setPromocodeValue(match.value);            
          } else {
            setAvailablePromocode(false);            
          }
        } else {
          setAvailablePromocode(true);
          setPromocodeValue(match.value); 
        }
      }
    }
  }, [promocodes, promocode, usedPromocode, userPromocodes]);

  const onClickUsePromo = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
      if (availablePromocode) {
        setMessage('Código de desconto aplicado.');
        setUsedPromocode(promocode);
        setPromocode('');
      } else {
        setMessage('O código de desconto está incorreto ou já foi aplicado anteriormente.');
      }     
  };

  const onClickShowComment = () => {
    if (showCommentTextarea) {
      setShowCommentTextarea(false);
    } else {
      setShowCommentTextarea(true);
    }
  };

  const openConditions = () => {
    setShowConditions(true);
    window.scrollTo(0, 0);
    bodyLock();
  };

  const order =
    orderItems.map(
      (item, index) =>
        (index > 0 ? "<br><br>" : "") +
        "<b>" +
        (index + 1) +
        ". " +
        item.name +
        "</b><br>Marca: " +
        item.company +
        "<br>Código: " +
        item.code +
        "<br>" +
        (item.curlArr ? "Curvatura: " + item.curlArr + "<br>" : "") +
        (item.thicknessArr
          ? "Grossura: " + item.thicknessArr + " mm<br>"
          : "") +
        (item.lengthArr ? "Tamanho: " + item.lengthArr + " mm<br>" : "") +
        (item.isLashes
          ? ""
          : item.info.map(
              (obj) => obj.title + ": " + obj.description + "<br>"
            )) +
        "Preço: " +
        item.price +
        " €<br>" +
        "Quantidade: " +
        item.count
    ) +
    '<br><br><b style="font-size: 110%; padding-bottom: 20px;"><span style="padding-right: 10px;">Quantidade total: </span>' +
    totalCount +
    '</b><br><b style="font-size: 110%; padding-bottom: 20px;"><span style="padding-right: 10px;">Custo de entrega: </span>' +
    deliveryPrice +
    " €</b>" +
    (usedPromocode ? '<br><br><b style="font-size: 110%; color: #AD902B; padding-bottom: 20px;"><span style="padding-right: 10px;">Desconto: </span>' +
    '- ' + promocodeValue + '%  ' + usedPromocode.toUpperCase() +
    "</b>" : '') + 
    '<br><br><b style="font-size: 125%; color: #AD902B; padding-bottom: 20px;"><span style="padding-right: 10px;">Valor total: </span>' +
    (finalSum + Number(deliveryPrice)).toFixed(2) +
    " €</b>";

  const success = async (response) => {
    const date = new Date();
    const today = date.toISOString().slice(0, 10);
    const countryData = countries.find((c) => c.code === country);

    localStorage.setItem("orderId", orderNumber);
    localStorage.setItem("orderDate", today);
    localStorage.setItem("clientName", username);
    localStorage.setItem("clientSurname", surname);
    localStorage.setItem("clientPhone", phone);
    localStorage.setItem("clientEmail", email);
    localStorage.setItem("clientOrder", JSON.stringify(orderItems));
    localStorage.setItem("clientCompany", company ? company : " ");
    localStorage.setItem(
      "clientAddress",
      `Rua: ${firstAddress}, Número da porta: ${secondAddress}, Código postal/ZIP: ${postalCode}, ${city}, ${region}, ${countryData.code}`
    );
    localStorage.setItem("clientCountry", countryData);
    localStorage.setItem("clientComment", comment ? comment : " ");
    if (promocodeValue && usedPromocode) {
      localStorage.setItem("promocodeDiscount", (totalPrice * promocodeValue / 100).toFixed(2));
      localStorage.setItem("promocode", usedPromocode.toUpperCase());
    } else {
      localStorage.removeItem("promocodeDiscount");
      localStorage.removeItem("promocode");
    }
    localStorage.setItem(
      "orderTotal",
      (finalSum + Number(deliveryPrice)).toFixed(2)
    );
    localStorage.setItem("totalCount", totalCount);
    localStorage.setItem("deliveryPrice", (+deliveryPrice).toFixed(2));
    localStorage.setItem("order", order);

    const orderData = {
        orderId: orderNumber,
        orderDate: today,
        clientName: username,
        clientSurname: surname,
        clientPhone: phone,
        clientEmail: email,
        clientOrder: JSON.stringify(orderItems),
        clientCompany: company ? company : " ",
        clientAddress: `Rua: ${firstAddress}, Número da porta: ${secondAddress}, Código postal/ZIP: ${postalCode}, ${city}, ${region}, ${countryData.code}`,
        clientComment: comment ? comment : " ",
        orderTotal: localStorage.getItem('orderTotal'),
        totalCount: totalCount,
        deliveryPrice: (+deliveryPrice).toFixed(2),
        order: order,
        clientCountry: countryData,
    };

    await fetch(`${serverDomain}api/sibs/saveOrder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    });
    //dispatch(clearItems());
    navigate("/sibs-form", { state: response.paymentInfo });
    window.scrollTo(0, 0);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const id = user ? user.id : 0;
    const countryData = countries.find((c) => c.code === country);

    if (
      orderNumber &&
      username &&
      surname &&
      phone &&
      email &&
      items &&
      firstAddress &&
      secondAddress &&
      postalCode &&
      city &&
      region &&
      country &&
      finalSum &&
      totalCount &&
      deliveryPrice
    ) {
      setResetForm(false);
      formData.append("userId", id);
      formData.append("items", JSON.stringify(orderItems));
      formData.append("quantity", totalCount);
      formData.append("deliveryPrice", deliveryPrice);
      formData.append(
        "sum",
        (finalSum + Number(deliveryPrice)).toFixed(2)
      );
      formData.append("orderNumber", orderNumber);
      formData.append("userOrder", order);
      formData.append("userName", username);
      formData.append("userSurname", surname);
      formData.append("userEmail", email);
      formData.append("userPhone", phone);
      formData.append("paymentList", payment);
      formData.append("userCompany", company ? company : " ");
      formData.append(
        "userAddress",
        `Rua: ${firstAddress}, Número da porta: ${secondAddress}, ${city}, ${region}, ${country}`
      );
      formData.append("userPostalCode", postalCode);
      formData.append("userComment", comment);
      formData.append("countryCode", countryData.code);
      formData.append("promocodeName", usedPromocode ? usedPromocode.toUpperCase() : '');
      formData.append("promocodeValue", usedPromocode && promocodeValue ? promocodeValue : '');

      try {
        const response = await submitPurchase(formData);
        if (response.success) {
          if (id > 0) {
            updateUser(formData, id).then((data) => success(response));
          } else {
            window.alert('Usuário não encontrado.');
          }
        } else {
          window.alert("Erro ao enviar o pedido. Tente novamente.");
        }
      } catch (error) {
        window.alert("Erro ao enviar pedido. Tente novamente.");
      }
    } else {
      window.alert("Por favor, preencha todos os campos obrigatórios.");
      setResetForm(true);
      closePopup();
      window.scrollTo(0, 0);
    }
  };

  const redirectToCart = () => {
    localStorage.setItem("redirected", true);
  };

  const deletePromocode = () => {
    setMessage('');
    setAvailablePromocode(false);
    setUsedPromocode('');
    setPromocodeValue(0);
  };

  const onClickShowPromoLine = () => {
    if (showPromocodeBlock) {
      setShowPromocodeBlock(false);
    } else {
      setShowPromocodeBlock(true);
    }
  };

  const onClickChecked = () => {
    checkedCheckbox();
    if (checked) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  };

  const onClickShowAddressForm = () => {
    window.scrollTo(0, 0);
    if (showAddressForm) {
      setShowAddressForm(false);
    } else {
      setShowAddressForm(true);
    }
  };

  return (
    <div className="cart__popup popup-cart">
      {showConditions && <DeliveryConditions deliveryPrices={deliveryPrices} />}
        <div className="popup-cart__content">
          <div className="popup-cart__text">
            <p className="popup-cart__paragraph">
              Pedimos desculpas, o site está passando por trabalhos técnicos. 
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
              <path d="M308.5 135.3c7.1-6.3 9.9-16.2 6.2-25c-2.3-5.3-4.8-10.5-7.6-15.5L304 89.4c-3-5-6.3-9.9-9.8-14.6c-5.7-7.6-15.7-10.1-24.7-7.1l-28.2 9.3c-10.7-8.8-23-16-36.2-20.9L199 27.1c-1.9-9.3-9.1-16.7-18.5-17.8C173.9 8.4 167.2 8 160.4 8l-.7 0c-6.8 0-13.5 .4-20.1 1.2c-9.4 1.1-16.6 8.6-18.5 17.8L115 56.1c-13.3 5-25.5 12.1-36.2 20.9L50.5 67.8c-9-3-19-.5-24.7 7.1c-3.5 4.7-6.8 9.6-9.9 14.6l-3 5.3c-2.8 5-5.3 10.2-7.6 15.6c-3.7 8.7-.9 18.6 6.2 25l22.2 19.8C32.6 161.9 32 168.9 32 176s.6 14.1 1.7 20.9L11.5 216.7c-7.1 6.3-9.9 16.2-6.2 25c2.3 5.3 4.8 10.5 7.6 15.6l3 5.2c3 5.1 6.3 9.9 9.9 14.6c5.7 7.6 15.7 10.1 24.7 7.1l28.2-9.3c10.7 8.8 23 16 36.2 20.9l6.1 29.1c1.9 9.3 9.1 16.7 18.5 17.8c6.7 .8 13.5 1.2 20.4 1.2s13.7-.4 20.4-1.2c9.4-1.1 16.6-8.6 18.5-17.8l6.1-29.1c13.3-5 25.5-12.1 36.2-20.9l28.2 9.3c9 3 19 .5 24.7-7.1c3.5-4.7 6.8-9.5 9.8-14.6l3.1-5.4c2.8-5 5.3-10.2 7.6-15.5c3.7-8.7 .9-18.6-6.2-25l-22.2-19.8c1.1-6.8 1.7-13.8 1.7-20.9s-.6-14.1-1.7-20.9l22.2-19.8zM112 176a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM504.7 500.5c6.3 7.1 16.2 9.9 25 6.2c5.3-2.3 10.5-4.8 15.5-7.6l5.4-3.1c5-3 9.9-6.3 14.6-9.8c7.6-5.7 10.1-15.7 7.1-24.7l-9.3-28.2c8.8-10.7 16-23 20.9-36.2l29.1-6.1c9.3-1.9 16.7-9.1 17.8-18.5c.8-6.7 1.2-13.5 1.2-20.4s-.4-13.7-1.2-20.4c-1.1-9.4-8.6-16.6-17.8-18.5L583.9 307c-5-13.3-12.1-25.5-20.9-36.2l9.3-28.2c3-9 .5-19-7.1-24.7c-4.7-3.5-9.6-6.8-14.6-9.9l-5.3-3c-5-2.8-10.2-5.3-15.6-7.6c-8.7-3.7-18.6-.9-25 6.2l-19.8 22.2c-6.8-1.1-13.8-1.7-20.9-1.7s-14.1 .6-20.9 1.7l-19.8-22.2c-6.3-7.1-16.2-9.9-25-6.2c-5.3 2.3-10.5 4.8-15.6 7.6l-5.2 3c-5.1 3-9.9 6.3-14.6 9.9c-7.6 5.7-10.1 15.7-7.1 24.7l9.3 28.2c-8.8 10.7-16 23-20.9 36.2L315.1 313c-9.3 1.9-16.7 9.1-17.8 18.5c-.8 6.7-1.2 13.5-1.2 20.4s.4 13.7 1.2 20.4c1.1 9.4 8.6 16.6 17.8 18.5l29.1 6.1c5 13.3 12.1 25.5 20.9 36.2l-9.3 28.2c-3 9-.5 19 7.1 24.7c4.7 3.5 9.5 6.8 14.6 9.8l5.4 3.1c5 2.8 10.2 5.3 15.5 7.6c8.7 3.7 18.6 .9 25-6.2l19.8-22.2c6.8 1.1 13.8 1.7 20.9 1.7s14.1-.6 20.9-1.7l19.8 22.2zM464 304a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
            </svg>
            <p className="popup-cart__paragraph"> Fazer um pedido no site está temporariamente indisponível. </p>
            <p className="popup-cart__paragraph"> Utilize estes contactos para fazer uma encomenda: </p>
            <ul className="popup-cart__items contacts__items">
                <li className="contacts__item item-contacts popup-cart__item">
                  <Link to='https://www.instagram.com/bestbuybeauty.pt/'>
                    bestbuybeauty.pt
                  </Link>
                </li>
                <li className="contacts__item item-contacts popup-cart__item">
                  <Link to='https://www.instagram.com/sculptorlash_pt/'>
                    sculptorlash_pt
                  </Link>
                </li>
                <li className="contacts__item item-contacts popup-cart__item">
                  <div>
                    +351 960 201 624
                  </div>
                </li>
                <li className="contacts__item item-contacts popup-cart__item">
                  <Link to='mailto:bestbuybeauty.pt@gmail.com'>
                    bestbuybeauty.pt@gmail.com
                  </Link>
                </li>
              </ul>
            <p className="popup-cart__paragraph"> Obrigado pela sua compreensão!</p>
          </div>  

          <div className="popup-cart__body">
            {user
              ? 
              <form
                onSubmit={submitForm}
                id="email-form"
                className="popup-cart__form popup-form email-form"
              >
                <div className="popup-form__text">
                  Por favor, deixe seus dados para fazer um pedido.
                </div>
              {showAddressForm &&
                <>
                  `<div className="popup-form__line">
                    <label
                      hidden
                      htmlFor="user-company-input"
                      className="popup-form__label"
                    >
                      NIF (opcional)
                    </label>
                    <input
                      hidden
                      id="user-company-input"
                      autoComplete="new-password"
                      type="text"
                      name="Empresa"
                      data-error="Error"
                      placeholder="000000000"
                      className="popup-form__input"
                      value={company}
                      onChange={onChangeCompany}
                    />
                  </div>
                  <div className="popup-form__line">
                    <label htmlFor="user-name-input" className="popup-form__label">
                      Primeiro Nome
                    </label>
                    <input
                      required
                      id="user-name-input"
                      tabIndex="1"
                      autoComplete="new-password"
                      type="text"
                      name="nome"
                      data-error="Error"
                      placeholder="Nome"
                      className="popup-form__input _req"
                      value={username}
                      onChange={onChangeUsername}
                    />
                  </div>
                  <div className="popup-form__line">
                    <label htmlFor="user-surname-input" className="popup-form__label">
                      Último Nome
                    </label>
                    <input
                      required
                      id="user-surname-input"
                      tabIndex="2"
                      autoComplete="new-password"
                      type="text"
                      name="Sobrenome"
                      data-error="Error"
                      placeholder="Sobrenome"
                      className="popup-form__input"
                      value={surname}
                      onChange={onChangeSurname}
                    />
                  </div>
                  <div className="popup-form__line">
                    <label
                      htmlFor="user-f-address-input"
                      className="popup-form__label"
                    >
                      Rua
                    </label>
                    <input
                      required
                      id="user-f-address-input"
                      tabIndex="3"
                      autoComplete="new-password"
                      type="text"
                      name="Morada_1"
                      data-error="Error"
                      className="popup-form__input"
                      value={firstAddress}
                      onChange={onChangeFAddress}
                    />
                  </div>
                  <div className="popup-form__line">
                    <label
                      htmlFor="user-s-address-input"
                      className="popup-form__label"
                    >
                      Número da porta
                    </label>
                    <input
                      required
                      id="user-s-address-input"
                      tabIndex="4"
                      autoComplete="new-password"
                      type="text"
                      name="Morada_2"
                      data-error="Error"
                      className="popup-form__input"
                      value={secondAddress}
                      onChange={onChangeSAddress}
                    />
                  </div>
                  <div className="popup-form__line">
                    <label htmlFor="user-city-input" className="popup-form__label">
                      Cidade
                    </label>
                    <input
                      required
                      id="user-city-input"
                      tabIndex="5"
                      autoComplete="new-password"
                      type="text"
                      name="Cidade"
                      data-error="Error"
                      className="popup-form__input"
                      value={city}
                      onChange={onChangeCity}
                    />
                  </div>
                  <div className="popup-form__line popup-form__line_select">
                    <label htmlFor="user-country-input" className="popup-form__label">
                      País
                    </label>
                    <input
                      readOnly
                      required
                      onClick={showCountries}
                      id="user-country-input"
                      tabIndex="6"
                      autoComplete="new-password"
                      type="text"
                      name="País"
                      data-error="Error"
                      className="popup-form__input popup-form__input_select"
                      value={countries.find((c) => c.code === country)?.name || ""}
                    />
                    <svg
                      onClick={showCountries}
                      className={visibleList ? "popup-form__arrow popup-form_rotate" : "popup-form__arrow"}
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 448 512"
                    >
                      <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                    </svg>
                    <div
                      className={
                        visibleList
                          ? "popup-form__wrapper"
                          : "popup-form__wrapper_hidden"
                      }
                  >

                      <ul
                        className={
                          visibleList ? "popup-form__list" : "popup-form__list_hidden"
                        }
                    >
                      <li className="popup-form__search-line">
                        <input
                          id="country-search-input"
                          name="country_value"
                          type="text"
                          placeholder="Digite seu país"
                          tabIndex="7"
                          value={countryValue}
                          onChange={onChangeCountryValue}
                          className={"popup-form__search"}
                        />
                          <svg
                            className="popup-form__search_svg"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512">
                            <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3
                            44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208
                            208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4
                            9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7
                            0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128
                            0 70.7-57.2 128-128 128z" />
                          </svg>
                        </li>
                      {countryValue
                        ?
                        countries.filter((country) => country.name.toLowerCase().includes(countryValue.toLowerCase())).map((country) => (
                        <li
                            onClick={() => onChangeCountry(country.code)}
                            key={country.code}
                            className={"popup-form__item"}
                          >
                            {country.name} {country.telCode}
                          </li>
                          )
                          )
                        :
                        countries.map((country) => (
                          <li
                            onClick={() => onChangeCountry(country.code)}
                            key={country.code}
                            className={"popup-form__item"}
                          >
                            {country.name} {country.telCode}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="popup-form__line">
                    <label htmlFor="user-region-input" className="popup-form__label">
                      Concelho
                    </label>
                    <input
                      required
                      id="user-region-input"
                      tabIndex="8"
                      autoComplete="new-password"
                      type="text"
                      name="Concelho"
                      data-error="Error"
                      className="popup-form__input"
                      value={region}
                      onChange={onChangeRegion}
                    />
                  </div>
                  <div className="popup-form__line">
                    <label
                      htmlFor="user-postal-code-input"
                      className="popup-form__label"
                    >
                      Código postal/ZIP
                    </label>
                    <input
                      required
                      id="user-postal-code-input"
                      tabIndex="9"
                      autoComplete="new-password"
                      type="text"
                      pattern={
                        country === "PT" ? "[0-9]{4}-[0-9]{3}" : "[0-9-A-Za-z]"
                      }
                      name="Código_postal/ZIP"
                      data-error="Error"
                      className="popup-form__input"
                      value={postalCode}
                      onChange={onChangePostalCode}
                    />
                  </div>
                  <div className="popup-form__line">
                    <label htmlFor="user-contact-input" className="popup-form__label">
                      Telemóvel
                    </label>
                    <input
                      required
                      id="user-contact-input"
                      tabIndex="10"
                      autoComplete="new-password"
                      type="tel"
                      pattern="\+?[0-9\s\-\(\)]+"
                      name="Telefone"
                      data-error="Error"
                      placeholder="+351XXXXXXXXXX"
                      className="popup-form__input _req"
                      value={phone}
                      onChange={onChangePhone}
                    />
                  </div>
                  <div className="popup-form__line">
                    <label htmlFor="user-email-input" className="popup-form__label">
                      E-mail
                    </label>
                    <input
                      required
                      id="user-email-input"
                      tabIndex="11"
                      autoComplete="new-password"
                      type="email"
                      name="email"
                      data-error="Error"
                      placeholder="example@email.com"
                      className="popup-form__input _req _email"
                      value={email}
                      onChange={onChangeEmail}
                    />
                  </div>
                  <div className="popup-form__line">
                    <label hidden htmlFor="order" className="popup-form__label">
                      Ordem:{" "}
                    </label>
                    <textarea
                      hidden
                      id="order"
                      readOnly
                      name="Ordem"
                      value={order}
                      className="popup-form__textarea _order"
                    />
                  </div>
                </>
              }
              <div className="popup-form__line">
                <div className="popup-form__preview preview-popup-form">
                  <h4 className="preview-popup-form__title">
                    Representação de endereço:
                  </h4>
                  <div className="preview-popup-form__body">
                    <div className="preview-popup-form__line">
                      {username} {surname}
                    </div>
                    <div className="preview-popup-form__line">
                      {firstAddress && firstAddress + ', '}
                      {secondAddress && secondAddress + ', '}
                      {city && city + ', '}
                      {country + ', '}
                      {region && region + ', '}
                      <span className="preview-popup-form_no-wrap">{postalCode}</span>
                      {firstAddress && secondAddress && city && region && postalCode
                        ?
                        ''
                        : <span className="preview-popup-form__warning">
                          <br />O endereço está incompleto!
                        </span>
                      }
                    </div>
                    <div className="preview-popup-form__line">
                      {phone}
                    </div>
                    <div className="preview-popup-form__line">
                      {email}
                    </div> 
                    <div onClick={onClickShowAddressForm} className="preview-popup-form__line">
                      {
                        showAddressForm
                          ?
                          <svg className="preview-popup-form__hide-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z" />
                          </svg>
                            :  
                          <svg className="preview-popup-form__show-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                          </svg>
                      }
                    </div> 
                  </div>
                </div>
              </div>
              <div className="popup-form__line popup-line__checkbox">
                <label
                  onClick={onClickChecked}
                  htmlFor="verifyAddress"
                  className={"form-login__label checkbox-label"}
                >
                    Confirmo que o endereço está correto <span>*</span>
                </label>
                <input
                  required
                  id="verifyAddress"
                  type="checkbox"
                  name="verifyAddress"
                  tabIndex="12"
                  className="form-login__checkbox"
                /> 
              </div>
              {
                !checked &&
                <div className="popup-form__line">
                  <Link onClick={() => window.scrollTo(0, 0)} to={'/auth'} className="popup-form__link">
                    Ou selecione outro endereço existente como seu endereço principal <span>aqui</span>.
                  </Link>
                </div>
              }
              <div className="popup-form__line popup-line__textarea">
                <label onClick={onClickShowComment} htmlFor="user-comment" className="popup-form__label popup-form__label_comment">
                  {showCommentTextarea ? 'Ocultar comentário' : 'Deixe um comentário'}
                      {
                        showCommentTextarea
                          ?
                          <svg className="popup-form__hide-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z" />
                          </svg>
                            :  
                          <svg className="popup-form__show-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
                          </svg>
                      }
                </label>
                {showCommentTextarea
                  &&
                    <textarea
                    id="user-comment"
                    tabIndex="13"
                    className="popup-form__textarea"
                    name="Comente"
                    placeholder="Ola! Aqui você pode deixar suas dúvidas ou desejos."
                    cols="10"
                    rows="5"
                    maxLength="150"
                    value={comment}
                    onChange={onChangeComment}
                  />
                }
              </div>
              <button
                disabled={deliveryPrices.length > 0 ? false : true}
                type="submit"
                tabIndex="14"
                className={
                  checked && deliveryPrices.length > 0
                    ?
                    "popup-form__button checkout scroll-top"
                    :
                    "popup-form__button checkout checkout_disabled scroll-top"
                }
                >
                  Pagar {(+finalSum + +deliveryPrice).toFixed(2)} €
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                  </svg>
                </button>
              </form>
              :
              <div className="popup-cart__redirect redirect-cart">
                <p className="redirect-cart__text redirect-cart__text_gold">
                  Se você é um novo cliente, <br />
                  registre-se para continuar fazendo seu pedido.
                </p>
                <Link onClick={redirectToCart} className="redirect-cart__link redirect-cart__link_black" to='/registration'>
                  Cadastre-se aqui
                </Link>
                <p className="redirect-cart__text">
                  Você já tem uma conta pessoal em nosso site? <br />
                  Faça login para concluir sua compra.
                </p>
                <Link onClick={redirectToCart} className="redirect-cart__link" to='/login'>
                  Faça login aqui
                </Link>
              </div>
            }          
          </div>
        <div className="popup-cart__aside aside-popup-cart">
          <div className="aside-popup-cart__wrapper">
            <div className="aside-popup-cart__items">
              {
                items.map((item, index) => 
                  <div key={index} className="aside-popup-cart__item item-aside-popup">
                    <div className="item-aside-popup__image">
                      <img src={`${imagesCloud}` + item.img} alt="product" />
                      <span>{item.count}</span>
                    </div>
                    <div className="item-aside-popup__info">
                      <div className="item-aside-popup__info-top">
                        <div className="item-aside-popup__name">
                          {item.name}
                          {
                            item.isLashes
                              &&
                              <div>
                                {'(' + item.curlArr + "/" + item.thicknessArr + '/' + item.lengthArr + ' mm' + ')'}
                              </div>
                          }                           
                        </div>

                        <div className={
                          usedPromocode && (promocodeBrandId === '0' || item.company === promocodeBrandName)
                            ?
                            "item-aside-popup__price_strike"
                            :
                            "item-aside-popup__price"
                        }>
                          {(item.price * item.count).toFixed(2) + ' €' }                         
                        </div>
                      </div>   
                     
                      {
                        usedPromocode && promocodeValue
                          ?
                          (promocodeBrandId === '0' || item.company === promocodeBrandName
                            ?
                            <div className="item-aside-popup__info-bottom">
                              <div className="item-aside-popup__used-promocode">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 252.1V48C0 21.5 21.5 0 48 0h204.1a48 48 0 0 1 33.9 14.1l211.9 211.9c18.7 18.7 18.7 49.1 0 67.9L293.8 497.9c-18.7 18.7-49.1 18.7-67.9 0L14.1 286.1A48 48 0 0 1 0 252.1zM112 64c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z"/></svg>
                                {usedPromocode + ' (-' + (item.price * promocodeValue / 100 * item.count).toFixed(2) + ' €)'}
                              </div>
                              <div className="item-aside-popup__promo-price">
                                {((item.price - (item.price * promocodeValue / 100)) * item.count).toFixed(2) + ' €'}                         
                              </div>
                            </div>
                            :
                            ''
                          )  
                          :
                          ''
                      }
                    </div>
                  </div>
                )
              }
            </div>
            {user 
              ?
              <>
                {showPromocodeBlock
                  &&
                  <div className="aside-popup-cart__line aside-popup-cart__line_promo">
                    <input type="text"
                      disabled={usedPromocode ? true : false}
                      placeholder="Código de desconto"
                      value={promocode}
                      onChange={onChangePromocode}
                      className="aside-popup-cart__input" />
                    {
                      !usedPromocode.length && promocode.length && !message
                        ?
                        <button onClick={onClickUsePromo} className="aside-popup-cart__btn" type="button">
                          Aplicar
                        </button>
                        :
                        <button disabled className="aside-popup-cart__btn aside-popup-cart__btn_disabled" type="button">
                          Aplicar
                        </button>
                    }
                  </div>  
                }
                <div className="aside-popup-cart__switch" onClick={(onClickShowPromoLine)}>
                  {showPromocodeBlock
                    ?
                    promocode.length < 1 && '- Ocultar o campo do código promocional'
                    :
                    '+ Adicione um código promocional'
                  }
                </div>
                <div className={message ? "aside-popup-cart__line aside-popup-cart__line_msg aside-popup-cart__line_overflow" : "aside-popup-cart__line"}>
                  <div className={availablePromocode ? "aside-popup-cart__text aside-popup-cart__text_msg" : "aside-popup-cart__text aside-popup-cart__text_msg aside-popup-cart__text_msg-red"}>
                    {message
                      ?
                      availablePromocode
                      ?
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M173.9 439.4l-166.4-166.4c-10-10-10-26.2 0-36.2l36.2-36.2c10-10 26.2-10 36.2 0L192 312.7 432.1 72.6c10-10 26.2-10 36.2 0l36.2 36.2c10 10 10 26.2 0 36.2l-294.4 294.4c-10 10-26.2 10-36.2 0z" /></svg>
                      :
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.2 0-44.5l-22.2-22.2c-12.3-12.3-32.2-12.3-44.5 0L176 189.3 75.9 89.2c-12.3-12.3-32.2-12.3-44.5 0L9.2 111.5c-12.3 12.3-12.3 32.2 0 44.5L109.3 256 9.2 356.1c-12.3 12.3-12.3 32.2 0 44.5l22.2 22.2c12.3 12.3 32.2 12.3 44.5 0L176 322.7l100.1 100.1c12.3 12.3 32.2 12.3 44.5 0l22.2-22.2c12.3-12.3 12.3-32.2 0-44.5L242.7 256z" /></svg>
                      :
                      ''
                    }
                    {message} 
                  </div>
                </div>
              </>
              :
              ''
            }
            {usedPromocode
              ?
              <div className="aside-popup-cart__line aside-popup-cart__line_overflow">
                <div className="aside-popup-cart__used-promocode">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 252.1V48C0 21.5 21.5 0 48 0h204.1a48 48 0 0 1 33.9 14.1l211.9 211.9c18.7 18.7 18.7 49.1 0 67.9L293.8 497.9c-18.7 18.7-49.1 18.7-67.9 0L14.1 286.1A48 48 0 0 1 0 252.1zM112 64c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z"/></svg>
                  {usedPromocode}
                  <svg onClick={deletePromocode} className="delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.2 0-44.5l-22.2-22.2c-12.3-12.3-32.2-12.3-44.5 0L176 189.3 75.9 89.2c-12.3-12.3-32.2-12.3-44.5 0L9.2 111.5c-12.3 12.3-12.3 32.2 0 44.5L109.3 256 9.2 356.1c-12.3 12.3-12.3 32.2 0 44.5l22.2 22.2c12.3 12.3 32.2 12.3 44.5 0L176 322.7l100.1 100.1c12.3 12.3 32.2 12.3 44.5 0l22.2-22.2c12.3-12.3 12.3-32.2 0-44.5L242.7 256z"/></svg>
                </div>
              </div>
              :
              ""
            }
            {promocodes.length > 0 && usedPromocode
              ?
              <div className="aside-popup-cart__line aside-popup-cart__line_label aside-popup-cart__line_overflow">
                <div className="aside-popup-cart__discount-persent">
                  {promocodeBrandName && promocodeBrandName + ', '}
                  {promocodeReusable && 'Reutilizável'}
                </div>
              </div>
              :
              ''
            }
            <div className="aside-popup-cart__line">
              <div className="aside-popup-cart__text">
                Subtotal {totalCount} {totalCount > 1 ? 'itens' : 'iten'}
              </div>
              <div className="aside-popup-cart__text">
                {totalPrice.toFixed(2)} €
              </div>
            </div>
            {
              usedPromocode.length
                ?
                <div className="aside-popup-cart__line aside-popup-cart__line_label aside-popup-cart__line_overflow">
                  <div className="aside-popup-cart__discount-persent">
                    {promocodeValue}% de desconto
                  </div>
                  <div className="aside-popup-cart__discount-sum">
                    - {(totalPrice - finalSum).toFixed(2)} €
                  </div>
                </div>  
                :
                ''
            }
            <div className="aside-popup-cart__line">
              <div className="aside-popup-cart__text aside-popup-cart__text-delivery">
                Envio
                <svg onClick={openConditions} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 8C119 8 8 119.1 8 256c0 137 111 248 248 248s248-111 248-248C504 119.1 393 8 256 8zm0 448c-110.5 0-200-89.4-200-200 0-110.5 89.5-200 200-200 110.5 0 200 89.5 200 200 0 110.5-89.4 200-200 200zm107.2-255.2c0 67.1-72.4 68.1-72.4 92.9V300c0 6.6-5.4 12-12 12h-45.6c-6.6 0-12-5.4-12-12v-8.7c0-35.7 27.1-50 47.6-61.5 17.6-9.8 28.3-16.5 28.3-29.6 0-17.2-22-28.7-39.8-28.7-23.2 0-33.9 11-48.9 30-4.1 5.1-11.5 6.1-16.7 2.1l-27.8-21.1c-5.1-3.9-6.3-11.1-2.6-16.4C184.8 131.5 214.9 112 261.8 112c49.1 0 101.5 38.3 101.5 88.8zM298 368c0 23.2-18.8 42-42 42s-42-18.8-42-42 18.8-42 42-42 42 18.8 42 42z"/></svg>
              </div>
              <div className="aside-popup-cart__text">{user ? (deliveryPrice > 0 ? deliveryPrice + ' €' : (deliveryPrices.length ? 'GRÁTIS' : 'Carregando...')) : "Depende do país"}</div>
            </div>
            <div className="aside-popup-cart__line aside-popup-cart__line_overflow">
              {
                isPortugal && user
                &&
                <div className="aside-popup-cart__text-group text-group">
                  <div className="text-group__label">{deliveryPrice > 0 ? "CTT Expresso" : "Portes grátis (CTT Expresso)"}</div>
                  {postalCode && postalCode[0] == 9 ? <div>Ilhas de Portugal</div> : ''}  
                  <div>{postalCode && postalCode[0] == 9 ? "Entrega em 3 a 5 dias úteis" : "Entrega em 1-2 dias úteis"}</div>
                </div>
              }
              {
                isSpain && user
                &&
                <div className="aside-popup-cart__text-group text-group">
                  <div className="text-group__label">Envio CTT</div>
                  <div>Entrega em 2-5 dias úteis</div>
                </div>
              }
              {
                !isPortugal && !isSpain && user
                  &&
                  <div className="aside-popup-cart__text-group text-group">
                    <div className="text-group__label">Envio CTT</div>
                    <div>Entrega em 3-7 dias úteis</div>
                  </div>
              }
            </div>
            <div className="aside-popup-cart__line">
              <div
                className="aside-popup-cart__text aside-popup-cart__text-total"
              >
                Total
              </div>
              <div className="aside-popup-cart__text-total">
                {(+finalSum + +deliveryPrice).toFixed(2)} €
              </div>
            </div>
          </div>
        </div>
        </div>

    </div>
  );
};

export default SubmitPage;
