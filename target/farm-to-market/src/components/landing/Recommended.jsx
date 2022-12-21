import { faPesoSign, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { allProducts } from "../../services/product";

const Recommended = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  useEffect(() => {
    allProducts().then((res) => {
      if (res.data) {
        setProducts(res.data);
      }
    });
  }, []);

  const handleProductDetails = (e, id) => {
    e.preventDefault();

    return navigate(`/details/product/${id}`);
  };
  if (products && products.length > 0) {
    return (
      <div className="container mt-4">
        <div className="card">
          <div className="card-body">
            <Card.Title>ALL PRODUCTS</Card.Title>
            <div className="row">
              {products.map((product, idx) => (
                <div
                  className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-2"
                  key={idx}
                >
                  <Link
                    className="product-link"
                    onClick={(e) => handleProductDetails(e, product.product_id)}
                  >
                    <div className="card">
                      <img
                        className="card-img-top product-image"
                        src={
                          product.image &&
                          require(`../../assets/uploads/${product.image}`)
                        }
                        alt="Card image cap"
                      />
                      <div className="card-body">
                        <p className="card-title fw-bold">
                          {product.productName}
                        </p>

                        <p className="card-text-f">{product.description}</p>
                        <h4>
                          <FontAwesomeIcon size="xs" icon={faPesoSign} />
                          {product.price}
                        </h4>
                        {/* <button className="btn btn-f-primary w-100 text-uppercase">
                          <FontAwesomeIcon icon={faPlusSquare} /> add to cart
                        </button> */}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Container className="mb-4 mt-4">
      <h4>No Product Available</h4>
    </Container>
  );
};

export default Recommended;
