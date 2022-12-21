import { faPesoSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Recommended from "../../components/landing/Recommended";
import { searchProduct } from "../../services/product";

const Search = () => {
  const search = useLocation().search;
  const key = new URLSearchParams(search).get("key");
  const [products, setProducts] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    searchProduct(key).then((res) => {
      if (res.data) {
        setProducts(res.data);
      }
    });
  }, [key]);
  const handleProductDetails = (e, id) => {
    e.preventDefault();

    return navigate(`/details/product/${id}`);
  };
  if (products && products.length > 0) {
    return (
      <>
        <Container className="mb-4 mt-4">
          <h3>Search Results</h3>
          <Row>
            {products.map((product, idx) => (
              <Col lg={3} md={4} sm={6} xs={12} key={idx}>
                <Link
                  className="product-link"
                  onClick={(e) => handleProductDetails(e, product.product_id)}
                >
                  <Card>
                    <img
                      className="card-img-top product-image"
                      src={
                        product.image &&
                        require(`../../assets/uploads/${product.image}`)
                      }
                      alt="Card image cap"
                    />
                    <Card.Body>
                      <p className="card-title fw-bold">
                        {product.productName}
                      </p>

                      <p className="card-text-f">{product.description}</p>
                      <p className="badge bg-warning">
                        <FontAwesomeIcon size="xs" icon={faPesoSign} />
                        {product.price}
                      </p>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
        <Recommended />
      </>
    );
  } else if (products && products.length <= 0) {
    return (
      <>
        <Container className="mb-4 mt-4">
          <h3>No Result Found</h3>
        </Container>
        <Recommended />
      </>
    );
  }
};

export default Search;
