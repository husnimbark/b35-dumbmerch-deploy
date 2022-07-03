import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import convertRupiah from "rupiah-format";

import Navbar from "../components/Navbar";

import { useQuery, useMutation } from "react-query";

import { API } from "../config/api";

export default function DetailProduct() {
  let history = useHistory();
  let { id } = useParams();
  let api = API();

  let { data: product, refetch } = useQuery("Cache", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
    const response = await api.get("/product/" + id, config);
    return response.data;
  });

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = "SB-Mid-client-6__ZGq5gOh_xc_Vq";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const handleCart = useMutation(async () => {
    try {
      let data = {
        idProduct: product.id,
        idBuyer: product.user.id,
        idSeller: product.user.id,
        price: product.price,
      };

      const body = JSON.stringify(data);

      const config = {
        method: "POST",
        headers: {
          Authorization: "Basic " + localStorage.token,
          "Content-type": "application/json",
        },
        body,
      };

      const response = await api.post("/cart", config);
    } catch (error) {}
  });

  const handleBuy = useMutation(async () => {
    try {
      const data = {
        idProduct: product.id,
        idSeller: product.user.id,
        price: product.price,
      };

      const body = JSON.stringify(data);

      const config = {
        method: "POST",
        headers: {
          Authorization: "Basic " + localStorage.token,
          "Content-type": "application/json",
        },
        body,
      };

      const response = await api.post("/transaction", config);

      const token = response.payment.token;

      window.snap.pay(token, {
        onSuccess: function (result) {
          history.push("/profile");
        },
        onPending: function (result) {
          history.push("/profile");
        },
        onError: function (result) {},
        onClose: function () {
          alert("you closed the popup without finishing the payment");
        },
      });
    } catch (error) {}
  });

  return (
    <div>
      <Navbar />
      <Container className="py-5 rounded rounded-5">
        <Row>
          <Col md="2"></Col>
          <Col md="3">
            <img src={product?.image} className="img-fluid rounded rounded-5" />
          </Col>
          <Col md="5">
            <div className="text-header-product-detail">{product?.name}</div>
            <div className="text-content-product-detail">
              Stock : {product?.qty}
            </div>
            <p className="text-content-product-detail mt-4">{product?.desc}</p>
            <div className="text-price-product-detail text-end mt-4">
              {convertRupiah.convert(product?.price)}
            </div>
            <div className="d-grid gap-2 mt-5 rounded rounded-5">
              <button
                onClick={() => handleBuy.mutate()}
                className="btn btn-buy"
              >
                Buy
              </button>
              <button
                onClick={() => handleCart.mutate()}
                className="btn btn-primary"
              >
                Add to Cart
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
