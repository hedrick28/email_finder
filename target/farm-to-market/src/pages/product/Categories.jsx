import { faPesoSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { categories } from "../../services/product";

const Categories = () => {
  const param = useParams();
  const [products, setProducts] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    categories(param.type).then((res) => {
      if (res.data) {
        setProducts(res.data);
      }
    });
  }, [param]);

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
                        <p className="badge bg-warning">
                          <FontAwesomeIcon size="xs" icon={faPesoSign} />
                          {product.price}
                        </p>
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
  } else {
    return (
      <Container className="mb-4 mt-4">
        <h4>No Product Available</h4>
      </Container>
    );
  }
};

export default Categories;
