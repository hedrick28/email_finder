import Joi from "joi";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { allUsers } from "../../services/user";
import lodash from "../../services/lodash";
import { getUserInfo } from "../../services/userInf";

const TipForm = ({ onSubmit, initialValue }) => {
  const [users, setUsers] = useState(null);
  const [errors, setErrors] = useState({});
  const [tip, setTip] = useState(
    initialValue || {
      title: "",
      content: "",
      owner: getUserInfo() && getUserInfo().data,
      everyone: true,
      type: "",
    }
  );
  useEffect(() => {
    allUsers().then((res) => {
      if (res.data) {
        setUsers(res.data);
      }
    });
  }, []);

  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    owner: Joi.object().allow(),
    everyone: Joi.bool().allow(false),
    type: Joi.string().allow("").required(),
  });

  const handleChange = (e) => {
    e.preventDefault();
    if (e.currentTarget.name === "respondent") {
      if (e.currentTarget.value === "true") {
        setTip({
          ...tip,
          everyone: e.currentTarget.value,
          [e.currentTarget.name]: {},
        });
      } else {
        setTip({
          ...tip,
          [e.currentTarget.name]: JSON.parse(e.currentTarget.value),
          everyone: false,
        });
      }
    } else {
      setTip({ ...tip, [e.currentTarget.name]: e.currentTarget.value });
    }

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
    const result = schema.validate(tip);
    return !!result.error;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(tip);
  };
  if (users) {
    return (
      <Card className="tip-card">
        <Card.Header>
          <Card.Title>{initialValue ? "Edit Tip" : "Create Tip"}</Card.Title>
        </Card.Header>
        <Form onSubmit={handleSubmit}>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={tip.title}
                onChange={handleChange}
              />
              {!!errors.title && (
                <span className="text-danger">{errors.title}</span>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>

              <textarea
                name="content"
                value={tip.content}
                onChange={handleChange}
                className="form-control"
                rows="8"
              ></textarea>
              {!!errors.content && (
                <span className="text-danger">{errors.content}</span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label>To</Form.Label>
                  <Form.Select name="type" onChange={handleChange}>
                    <option value="true">Everyone</option>
                    <option value="farmer">Farmers</option>
                    <option value="supplier">Suppliers</option>
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-f-primary"
              disabled={isFormInvalid()}
            >
              Send
            </button>
          </Card.Footer>
        </Form>
      </Card>
    );
  }
};

export default TipForm;
