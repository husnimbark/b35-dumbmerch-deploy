import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import dateFormat from "dateformat";
import convertRupiah from "rupiah-format";
import Navbar from "../components/Navbar";
import DeleteData from "../components/modal/DeleteData";
import { useHistory } from "react-router";

import { useQuery, useMutation } from "react-query";
import { API } from "../config/api";
import cartEmpty from "../assets/no-cart.png";

export default function Cart() {
  let api = API();
  let history = useHistory();

  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const title = "Cart";
  document.title = "DumbMerch | " + title;

  let { data: carts, refetch: cartsRefetch } = useQuery(
    "cartsCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await api.get("/carts", config);
      return response.data;
    }
  );

  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  const deleteById = useMutation(async (id) => {
    try {
      const config = {
        method: "DELETE",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      await api.delete(`/cart/${id}`, config);
      cartsRefetch();
    } catch (error) {}
  });

  useEffect(() => {
    if (confirmDelete) {
      handleClose();
      deleteById.mutate(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  return (
    <>
      <Navbar title={title} />
      <Container>
        <div className="text-header-product mt-5 rounded rounded-5">My Cart</div>
        {carts?.length != 0 ? (
          <>
            {carts?.map((item) => (
              <div
                style={{ background: "#303030" }}
                className="p-2 mb-1 mt-3 rounded rounded-5"
              >
                <Container fluid className="px-1">
                  <Row>
                    <Col xs="3">
                      <img
                        src={item.product.image}
                        alt="img"
                        className="img-fluid"
                        style={{
                          height: "120px",
                          width: "170px",
                          objectFit: "cover",
                        }}
                      />
                    </Col>
                    <Col xs="6">
                      <div
                        style={{
                          fontSize: "18px",
                          color: "#F74D4D",
                          fontWeight: "500",
                          lineHeight: "19px",
                        }}
                      >
                        {item.product.name}
                      </div>
                      <div
                        className="mt-2"
                        style={{
                          fontSize: "14px",
                          color: "#F74D4D",
                          fontWeight: "300",
                          lineHeight: "19px",
                        }}
                      >
                        {dateFormat(
                          item.createdAt,
                          "dddd, d mmmm yyyy, HH:MM "
                        )}
                        WIB
                      </div>

                      <div
                        className="mt-3"
                        style={{
                          fontSize: "14px",
                          fontWeight: "300",
                        }}
                      >
                        Price : {convertRupiah.convert(item.price)}
                      </div>

                      <div
                        className="mt-3"
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                        }}
                      >
                        Sub Total : {convertRupiah.convert(item.price)}
                      </div>
                    </Col>
                    <Col xs="3">
                      <Button
                        className="btn-sm mb-4 mt-3"
                        style={{ width: "135px" }}
                      >
                        Buy
                      </Button>
                      <Button
                        onClick={() => {
                          handleDelete(item.id);
                        }}
                        className="btn-sm btn-danger"
                        style={{ width: "135px" }}
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </div>
            ))}
          </>
        ) : (
          <Col>
            <div className="text-center pt-5">
              <img
                src={cartEmpty}
                className="img-fluid ms-5"
                style={{ width: "45%" }}
              />
              <div className="mt-3">No Items In Cart</div>
            </div>
          </Col>
        )}
      </Container>
      <DeleteData
        setConfirmDelete={setConfirmDelete}
        show={show}
        handleClose={handleClose}
      />
    </>
  );
}
