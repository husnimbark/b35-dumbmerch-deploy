import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router";

import NavbarAdmin from "../components/NavbarAdmin";

import { useMutation } from "react-query";

import { API } from "../config/api";

export default function AddCategoryAdmin() {
  console.clear();

  const title = "Category admin";
  document.title = "DumbMerch | " + title;

  let history = useHistory();
  let api = API();

  const [category, setCategory] = useState("");

  const handleChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const body = JSON.stringify({ name: category });

      const config = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body,
      };

      const response = await api.post("/category", config);

      history.push("/category-admin");
    } catch (error) {}
  });

  return (
    <>
      <NavbarAdmin title={title} />
      <Container className="py-5 rounded rounded-5">
        <Row>
          <Col xs="12">
            <div className="text-header-category mb-4 rounded rounded-5">Add Category</div>
          </Col>
          <Col xs="12">
            <form onSubmit={(e) => handleSubmit.mutate(e)}>
              <input
                onChange={handleChange}
                placeholder="category"
                value={category}
                name="category"
                className="input-edit-category mt-4 rounded rounded-5"
              />
              <div className="d-grid gap-2 mt-4 rounded rounded-5">
                <Button type="submit" variant="success" size="md">
                  Add
                </Button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
