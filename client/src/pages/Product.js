import Masonry from "react-masonry-css";
import { Container, Row, Col } from "react-bootstrap";

import Navbar from "../components/Navbar";
import ProductCard from "../components/card/ProductCard";

import imgEmpty from "../assets/empty.svg";

import { useQuery } from "react-query";

import { API } from "../config/api";

export default function Product() {
  let api = API();

  const title = "Shop";
  document.title = "DumbMerch | " + title;

  let { data: products, refetch } = useQuery("productsCache", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
    const response = await api.get("/products", config);
    return response.data;
  });

  const breakpointColumnsObj = {
    default: 6,
    1100: 4,
    700: 3,
    500: 2,
  };

  return (
    <div>
      <Navbar title={title} />
      <Container className="mt-5">
        <Row>
          <Col>
            <div className="text-header-product">Product</div>
          </Col>
        </Row>
        <Row className="my-4 rounded rounded-5">
          {products?.length != 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {products?.map((item, index) => (
                <ProductCard item={item} index={index} />
              ))}
            </Masonry>
          ) : (
            <Col>
              <div className="text-center pt-5 rounded rounded-5 p-4">
                <img
                  src={imgEmpty}
                  className="img-fluid"
                  style={{ width: "40%" }}
                />
                <div className="mt-3">No data product</div>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}
