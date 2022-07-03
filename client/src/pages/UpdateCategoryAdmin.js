import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useHistory } from "react-router";

import NavbarAdmin from "../components/NavbarAdmin";

import { useQuery, useMutation } from "react-query";

import { API } from "../config/api";

export default function UpdateCategoryAdmin() {
  const title = "Category admin";
  document.title = "DumbMerch | " + title;

  let history = useHistory();
  let api = API();
  const { id } = useParams();

  const [category, setCategory] = useState({ name: "" });

  let { refetch } = useQuery("categoryCache", async () => {
    const response = await api.get("/category/" + id);
    setCategory({ name: response.data.name });
  });

  const handleChange = (e) => {
    setCategory({
      ...category,
      name: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const body = JSON.stringify(category);

      const config = {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body,
      };

      const response = await api.patch("/category/" + id, config);

      history.push("/category-admin");
    } catch (error) {}
  });

  return (
    <>
      <NavbarAdmin title={title} />
      <Container className="py-5 rounded rounded-5">
        <Row>
          <Col xs="12">
            <div className="text-header-category mb-4 rounded rounded-5">Edit Category</div>
          </Col>
          <Col xs="12">
            <form onSubmit={(e) => handleSubmit.mutate(e)}>
              <input
                onChange={handleChange}
                value={category.name}
                placeholder="category"
                className="input-edit-category mt-4 rounded rounded-5"
              />
              <div className="d-grid gap-2 mt-4 rounded rounded-5">
                <Button type="submit" variant="success" size="md">
                  Save
                </Button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
