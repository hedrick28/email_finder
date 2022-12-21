import { faPesoSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { findOwnerProduct } from "../../services/product";

const Products = () => {
  const [products, setProducts] = useState(null);
  const param = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    findOwnerProduct(+param.id).then((res) => {
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
      <Container className="mb-4 mt-4">
        <Card className="product-card-report">
          <Card.Body>
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
                    <div className="card ">
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
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  } else {
    return (
      <div className="container mb-4 mt-4">
        <h5>No Available Product</h5>
      </div>
    );
  }
};

export default Products;
