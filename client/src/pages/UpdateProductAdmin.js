import React, { useState, useEffect, createElement } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useHistory } from "react-router";

import NavbarAdmin from "../components/NavbarAdmin";
import CheckBox from "../components/form/CheckBox";

import { useQuery, useMutation } from "react-query";

import { API } from "../config/api";

export default function UpdateProductAdmin() {
  const title = "Product admin";
  document.title = "DumbMerch | " + title;

  let history = useHistory();
  let api = API();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState([]);
  const [preview, setPreview] = useState(null);
  const [product, setProduct] = useState({});
  const [form, setForm] = useState({
    image: "",
    name: "",
    desc: "",
    price: "",
    qty: "",
  });

  let { productRefetch } = useQuery("productCache", async () => {
    const config = {
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
    const response = await api.get("/product/" + id, config);
    setForm({
      name: response.data.name,
      desc: response.data.desc,
      price: response.data.price,
      qty: response.data.qty,
      image: response.data.image,
    });
    setProduct(response.data);
  });

  let { categoriesRefetch } = useQuery("categoriesCache", async () => {
    const response = await api.get("/categories");
    setCategories(response.data);
  });

  const handleChangeCategoryId = (e) => {
    const id = e.target.value;
    const checked = e.target.checked;

    if (checked == true) {
      setCategoryId([...categoryId, parseInt(id)]);
    } else {
      let newCategoryId = categoryId.filter((categoryIdItem) => {
        return categoryIdItem != id;
      });
      setCategoryId(newCategoryId);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      setPreview(e.target.files);
    }
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      if (preview) {
        formData.set("image", preview[0], preview[0]?.name);
      }
      formData.set("name", form.name);
      formData.set("desc", form.desc);
      formData.set("price", form.price);
      formData.set("qty", form.qty);
      formData.set("categoryId", categoryId);

      const config = {
        method: "PATCH",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
        body: formData,
      };

      const response = await api.patch("/product/" + product.id, config);

      history.push("/product-admin");
    } catch (error) {}
  });

  useEffect(() => {
    const newCategoryId = product?.categories?.map((item) => {
      return item.id;
    });

    setCategoryId(newCategoryId);
  }, [product]);

  return (
    <>
      <NavbarAdmin title={title} />
      <Container className="py-5 rounded rounded-5">
        <Row>
          <Col xs="12">
            <div className="text-header-category mb-4 rounded rounded-5">Update Product</div>
          </Col>
          <Col xs="12">
            <form onSubmit={(e) => handleSubmit.mutate(e)}>
              {!preview ? (
                <div>
                  <img
                    src={form.image}
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <div>
                  <img
                    src={URL.createObjectURL(preview[0])}
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <input
                type="file"
                id="upload"
                name="image"
                hidden
                onChange={handleChange}
              />
              <label for="upload" className="label-file-add-product rounded rounded-5">
                Upload file
              </label>
              <input
                type="text"
                placeholder="Product Name"
                name="name"
                onChange={handleChange}
                value={form.name}
                className="input-edit-category mt-4"
              />
              <textarea
                placeholder="Product Desc"
                name="desc"
                onChange={handleChange}
                value={form.desc}
                className="input-edit-category mt-4"
                style={{ height: "130px" }}
              ></textarea>
              <input
                type="number"
                placeholder="Price (Rp.)"
                name="price"
                onChange={handleChange}
                value={form.price}
                className="input-edit-category mt-4"
              />
              <input
                type="number"
                placeholder="Stock"
                name="qty"
                onChange={handleChange}
                value={form.qty}
                className="input-edit-category mt-4"
              />

              <div className="card-form-input mt-4 px-2 py-1 pb-2 rounded rounded-5">
                <div
                  className="text-secondary mb-1"
                  style={{ fontSize: "15px" }}
                >
                  Category
                </div>
                {product &&
                  categories.map((item) => (
                    <label class="checkbox-inline me-4 rounded rounded-5">
                      <CheckBox
                        categoryId={categoryId}
                        value={item.id}
                        handleChangeCategoryId={handleChangeCategoryId}
                      />
                      <span className="ms-2">{item.name}</span>
                    </label>
                  ))}
              </div>

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
