import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import dateFormat from "dateformat";
import convertRupiah from "rupiah-format";

import Navbar from "../components/Navbar";

import { UserContext } from "../context/userContext";

import imgBlank from "../assets/blank-profile.png";

import { useQuery } from "react-query";

import { API } from "../config/api";

export default function Profile() {
  const title = "Profile";
  document.title = "DumbMerch | " + title;

  let api = API();

  const [state] = useContext(UserContext);

  let { data: profile, refetch: profileRefetch } = useQuery(
    "profileCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await api.get("/profile", config);
      return response.data;
    }
  );

  let { data: transactions, refetch: transactionsRefetch } = useQuery(
    "transactionsCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await api.get("/transactions", config);
      return response.data;
    }
  );

  return (
    <>
      <Navbar title={title} />
      <Container className="my-5 rounded rounded-5">
        <Row>
          <Col md="6">
            <div className="text-header-product mb-4 rounded rounded-5">My Profile</div>
            <Row>
              <Col md="6">
                <img
                  src={profile?.image ? profile.image : imgBlank}
                  className="img-fluid rounded"
                  alt="profile"
                />
              </Col>
              <Col md="6">
                <div className="profile-header">Name</div>
                <div className="profile-content">{state.user.name}</div>

                <div className="profile-header">Email</div>
                <div className="profile-content">{state.user.email}</div>

                <div className="profile-header">Phone</div>
                <div className="profile-content">
                  {profile?.phone ? profile?.phone : "-"}
                </div>

                <div className="profile-header">Gender</div>
                <div className="profile-content">
                  {profile?.gender ? profile?.gender : "-"}
                </div>

                <div className="profile-header">Address</div>
                <div className="profile-content">
                  {profile?.address ? profile?.address : "-"}
                </div>
              </Col>
            </Row>
          </Col>
          <Col md="6">
            <div className="text-header-product mb-4 rounded rounded-5">My Transaction</div>
            {transactions?.length != 0 ? (
              <>
                {transactions?.map((item) => (
                  <div style={{ background: "#303030" }} className="p-2 mb-1 rounded rounded-5">
                    <Container fluid className="px-1">
                      <Row>
                        <Col xs="3">
                          <img
                            src={item.product.image}
                            alt="img"
                            className="img-fluid rounded rounded-5"
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
                          <div
                            className={`status-transaction-${item.status} rounded h-100 d-flex align-items-center justify-content-center`}
                          >
                            {item.status}
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                ))}
              </>
            ) : (
              <div className="no-data-transaction">No transaction</div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
