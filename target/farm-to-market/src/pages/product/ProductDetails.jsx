import {
  faCartPlus,
  faMessage,
  faMinus,
  faMoneyBill1Wave,
  faPesoSign,
  faPlus,
  faTruck,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProductComment from "../../components/product/ProductComment";
import { getPersonMessage } from "../../redux/actions/message";
import { addToCart } from "../../services/cart";
import { productDetails } from "../../services/product";
import ProductCardWidgets from "../../components/widgets/product/ProductCardWidget";
import { getUserInfo } from "../../services/userInf";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const userInfo = getUserInfo();
  const param = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  useEffect(() => {
    productDetails(+param.id).then((res) => {
      if (res.data && res.data.status === 1) {
        setProduct(res.data.data);
      }
    });
  }, [param]);
  const handleQuantityPlus = () => {
    if (qty === product.stock) {
      return setQty(product.stock);
    }
    return setQty(qty + 1);
  };
  const handleQuantityMinus = () => {
    if (qty < 1 || qty === 1) {
      return setQty(1);
    }
    return setQty(qty - 1);
  };

  const handleOnChange = (e) => {
    e.preventDefault();
    if (e.currentTarget.value > product.stock) {
      return setQty(product.stock);
    } else if (e.currentTarget.value === "") {
      return setQty(1);
    }
    setQty(e.currentTarget.value);
  };

  const handleAddToCart = (type) => {
    const cartData = {
      quantity: qty,
      product,
      buyer: getUserInfo().data,
      seller: product.owner,
      total: qty * product.price,
    };

    if (getUserInfo()) {
      addToCart(cartData).then((res) => {
        if (res.data && res.data.status === 1) {
          if (type === "b") {
            navigate("/cart");
          } else {
            toast.success(res.data.message);
          }
        } else {
          alert("An unexpected error occurred");
        }
      });
    } else {
      navigate("/login");
    }
  };

  const handleMessage = () => {
    if (userInfo) {
      dispatch(getPersonMessage(userInfo.data.user_id, product.owner.user_id));
    } else {
      navigate("/login");
    }
  };

  if (product) {
    return (
      <Container className="mb-4 mt-4">
        <Card className="mb-3">
          <Card.Body>
            <Row>
              <Col lg={6}>
                <img
                  src={require("../../assets/uploads/" + product.image)}
                  className="w-100"
                />
              </Col>
              <Col lg={6} className="pt-2">
                <div className="">
                  <h5 className="text-uppercase">{product.productName}</h5>
                  <p>{product.description}</p>
                  <h2 className="default-bg p-4">
                    <span className="text-danger">
                      <FontAwesomeIcon icon={faPesoSign} />
                      {product.price}
                    </span>
                  </h2>

                  <Row className="mb-3">
                    <Col sm={3}>Stock Available</Col>
                    <Col sm={9}>{product.stock}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={3}>Unit</Col>
                    <Col sm={9}>{product.unit}</Col>
                  </Row>
                  {/* <Row className="mb-3">
                    <Col sm={3}>Shipping Fee</Col>
                    <Col sm={9}>PHP{product.shippingFee}</Col>
                  </Row> */}

                  {userInfo && userInfo.data.address ? (
                    <Row className="mb-3">
                      <Col sm={3}>Shipping To</Col>
                      <Col sm={9}>
                        <FontAwesomeIcon icon={faTruck} /> &nbsp;#
                        {userInfo.data.address.houseNo}{" "}
                        {userInfo.data.address.street}{" "}
                        {userInfo.data.address.barangay}{" "}
                        {userInfo.data.address.city}
                        {" city "}
                        {userInfo.data.address.province}
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                </div>
                <div className="default-bg d-flex justify-content-center p-2">
                  <div>
                    <p className="text-center">Quantity</p>
                    <div className="d-flex justify-content-center">
                      <button
                        className="q-counter-btn"
                        onClick={handleQuantityMinus}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <input
                        className="q-counter"
                        value={qty}
                        onChange={handleOnChange}
                      />
                      <button
                        className="q-counter-btn"
                        onClick={handleQuantityPlus}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                </div>
                <Row className="mt-2 mb-2">
                  <Col lg={6} className="mb-3">
                    <button
                      className="btn btn-warning w-100"
                      onClick={() => handleAddToCart("a")}
                    >
                      <FontAwesomeIcon icon={faCartPlus} className="me-2" />
                      <span>Add To Cart</span>
                    </button>
                  </Col>
                  <Col lg={6} className="mb-3">
                    <button
                      className="btn btn-f-primary w-100"
                      onClick={() => handleAddToCart("b")}
                    >
                      <FontAwesomeIcon
                        icon={faMoneyBill1Wave}
                        className="me-2"
                      />
                      <span>Buy Now</span>
                    </button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Row className="mb-3">
          <Col lg={5}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={3}>
                    <img
                      src={
                        product.owner.profile
                          ? require(`../../assets/uploads/${product.owner.profile}`)
                          : require("../../assets/uploads/empty.jpg")
                      }
                      alt=""
                      width="100"
                      className="rounded-circle"
                    />
                  </Col>
                  <Col xs={9} className="d-flex align-items-center">
                    <Row>
                      <Col xs={12}>
                        <h5 className="text-uppercase">
                          {product.owner.userName}
                        </h5>
                      </Col>
                      <Col xs={12}>
                        <button
                          className="btn btn-f-primary"
                          onClick={handleMessage}
                        >
                          <FontAwesomeIcon icon={faMessage} className="me-3" />
                          <span>Message</span>
                        </button>
                        {userInfo.data.businessName !==
                          product.owner.businessName && (
                          <button
                            style={{ marginLeft: "10px" }}
                            className="btn btn-primary"
                            onClick={() =>
                              navigate("/complaint/add", {
                                state: {
                                  report: product.owner.businessName,
                                },
                              })
                            }
                          >
                            <FontAwesomeIcon
                              icon={faCircleExclamation}
                              className="me-3"
                            />
                            <span>Report this user</span>
                          </button>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <ProductCardWidgets product={product} />
          </Col>
        </Row>

        <ProductComment product={product} />
      </Container>
    );
  }
};

export default ProductDetails;
