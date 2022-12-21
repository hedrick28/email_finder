import React, { useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { getUserInfo } from "../../services/userInf";
import Joi from "joi";
import lodash from "../../services/lodash";

const AdvertisementForm = ({ onSubmit, initialValue }) => {
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(
    initialValue || {
      category: "",
      productName: "",
      description: "",
      quantity: 0,
      owner: getUserInfo() && getUserInfo().data,
      image: "",
      unit: "",
    }
  );

  const schema = Joi.object({
    category: Joi.string().required(),
    productName: Joi.string().required(),
    description: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    image: Joi.string().required(),
    unit: Joi.string().required(),
    owner: Joi.object().allow({}).allow().required(),
  });

  const [imageData, setImageData] = useState(null);
  const [imagePrev, setImagePrev] = useState(
    initialValue ? require(`../../assets/uploads/${initialValue.image}`) : null
  );

  const handleFileChange = (e) => {
    e.preventDefault();

    let file = e.target.files[0];
    var imageData1 = new FormData();
    imageData1.append("imageFile", file);
    setImageData(imageData1);
    setImagePrev(URL.createObjectURL(file));
    setForm({ ...form, [e.currentTarget.name]: file.name });
  };

  const handleChange = (e, type = "input") => {
    if (type === "input") {
      e.preventDefault();
    }
    setForm({ ...form, [e.currentTarget.name]: e.currentTarget.value });

    const { error } = schema
      .extract(e.currentTarget.name)
      .label(lodash(e.currentTarget.name))
      .validate(e.currentTarget.value);

    if (error) {
      setErrors({
        ...errors,
        [e.currentTarget.name]: error.details[0].message,
      });
    } else {
      delete errors[e.currentTarget.name];
      setErrors(errors);
    }
  };

  const isFormInvalid = () => {
    const result = schema.validate(form);
    return !!result.error;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(imageData, form);
  };

  return (
    <Container className="mt-4 mb-4">
      <Form onSubmit={handleSubmit}>
        <Card>
          <Card.Header>
            <Card.Title>
              {initialValue ? "Edit Advertisement" : "Post Advertisement"}
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col lg={6}>
                <Row>
                  <Col lg={6} className="mb-3">
                    <div className="d-flex align-items-start justify-content-center align-items-sm-center gap-4">
                      <img
                        src={imagePrev ? imagePrev : ""}
                        alt="advertisement"
                        className="profilePicture"
                        id="uploadedAvatar"
                        width={"200px"}
                        height={"150px"}
                      />
                    </div>
                  </Col>
                  <Col
                    lg={6}
                    className=" d-flex justify-content-center align-items-center "
                  >
                    <div className="button-wrapper">
                      <div className="d-flex flex-row justify-content-center align-items-center ">
                        <label
                          htmlFor="upload"
                          className="btn input-f-primary"
                          tabIndex="0"
                          typeof="file"
                        >
                          <input
                            name="image"
                            accept="image/*"
                            type="file"
                            id="upload"
                            className="account-file-input input-file-upload"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <p className="text-mute mb-0">
                        Allowed JPG, JPEG or PNG. Max size of 1MB
                      </p>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col lg={6}>
                <Form.Group>
                  <Form.Label className="text-uppercase fw-bold">
                    Category
                  </Form.Label>
                  <Form.Select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value=""></option>
                    <option value="root crops">Root Crops</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="seeds">Seeds</option>
                  </Form.Select>
                  {!!errors.category && (
                    <span className="text-danger">{errors.category}</span>
                  )}
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-uppercase fw-bold">
                    Product Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    size="1x"
                    name="productName"
                    value={form.productName}
                    onChange={handleChange}
                  />
                  {!!errors.productName && (
                    <span className="text-danger">{errors.productName}</span>
                  )}
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-uppercase fw-bold">
                    Product Description
                  </Form.Label>
                  <Form.Control
                    type="text"
                    size="1x"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                  {!!errors.description && (
                    <span className="text-danger">{errors.description}</span>
                  )}
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-uppercase fw-bold">
                    Needed Quantity
                  </Form.Label>
                  <Form.Control
                    type="text"
                    size="1x"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                  />
                  {!!errors.quantity && (
                    <span className="text-danger">{errors.quantity}</span>
                  )}
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-uppercase fw-bold">
                    Unit
                  </Form.Label>
                  <Row>
                    <Col>
                      <Form.Check
                        value="Per Gram(s)"
                        type="radio"
                        name="unit"
                        checked={form.unit === "Per Gram(s)" ? true : false}
                        onChange={(e) => handleChange(e, "radio")}
                        label="Per Gram(s)"
                        size="1x"
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        name="unit"
                        checked={form.unit === "Per Kilo" ? true : false}
                        onChange={(e) => handleChange(e, "radio")}
                        type="radio"
                        label="Per Kilo"
                        size="1x"
                        value="Per Kilo"
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        name="unit"
                        checked={form.unit === "Per Piece" ? true : false}
                        onChange={(e) => handleChange(e, "radio")}
                        type="radio"
                        label="Per Piece"
                        size="1x"
                        value="Per Piece"
                      />
                    </Col>
                  </Row>
                  {!!errors.unit && (
                    <span className="text-danger">{errors.unit}</span>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <button
              type="submit"
              disabled={isFormInvalid()}
              className="btn btn-f-primary"
            >
              Submit
            </button>
          </Card.Footer>
        </Card>
      </Form>
    </Container>
  );
};

export default AdvertisementForm;
