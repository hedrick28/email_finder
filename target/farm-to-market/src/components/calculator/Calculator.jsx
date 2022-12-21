import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Draggable from "react-draggable";
import ModalDialog from "react-bootstrap/ModalDialog";
import { useDispatch, useSelector } from "react-redux";
import { varibales } from "../../redux/constants/variables";
import { Col, Form, Row } from "react-bootstrap";
import Joi from "joi";

class DraggableModalDialog extends React.Component {
  render() {
    return (
      <Draggable handle=".modal-header">
        <ModalDialog {...this.props} />
      </Draggable>
    );
  }
}

const Calculator = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.calculator);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    seedCost: "",
    fertilizerCost: "",
    sprayCost: "",
    laborCost: "",
    materialRentCost: "",
    otherCost: "",
    profit: "",
    totalOutput: "",
    unit: "",
  });

  const [cropCost, setCropCost] = useState(0);

  const schema = Joi.object({
    seedCost: Joi.number().min(0).allow("").optional(),
    fertilizerCost: Joi.number().min(0).allow("").optional(),
    sprayCost: Joi.number().min(0).allow("").optional(),
    laborCost: Joi.number().min(0).allow("").optional(),
    materialRentCost: Joi.number().min(0).allow("").optional(),
    otherCost: Joi.number().min(0).allow("").optional(),
    totalExpenses: Joi.number().min(0).allow("").optional(),
    profit: Joi.number().min(0).allow("").optional(),
    totalOutput: Joi.number().min(0).required(),
    unit: Joi.string().required(),
  });

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.currentTarget.name]: event.currentTarget.value,
    });

    const { error } = schema
      .extract(event.currentTarget.name)
      .label(event.currentTarget.name)
      .validate(event.currentTarget.value);
    if (error) {
      setErrors({
        ...errors,
        [event.currentTarget.name]: error.details[0].message,
      });
    } else {
      delete errors[event.currentTarget.name];
      setErrors(errors);
    }
  };

  const isFormInvalid = () => {
    const result = schema.validate(form);
    return !!result.error;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleCropCost = () => {
    let totalExpenses =
      parseFloat(form.seedCost ? form.seedCost : 0) +
      parseFloat(form.fertilizerCost ? form.fertilizerCost : 0) +
      parseFloat(form.sprayCost ? form.sprayCost : 0) +
      parseFloat(form.laborCost ? form.laborCost : 0) +
      parseFloat(form.materialRentCost ? form.materialRentCost : 0) +
      parseFloat(form.otherCost ? form.otherCost : 0);

    let cost =
      (totalExpenses +
        (parseFloat(form.profit ? form.profit : 0) / 100) * totalExpenses) /
      parseFloat(form.totalOutput);

    setCropCost(cost);
  };

  return (
    <Modal
      size="sm"
      dialogAs={DraggableModalDialog}
      show={show}
      onHide={() => dispatch({ type: varibales.CALCULATOR, payload: false })}
    >
      <Modal.Header closeButton>Calculator</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xs={12} className="mb-2">
              <Form.Control
                value={form.seedCost}
                onChange={handleChange}
                type="number"
                name="seedCost"
                className="form-control"
                placeholder="Seed Cost (if any)"
              />
              {errors.seedCost && (
                <div className="text-danger">{errors.seedCost}</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="mb-2">
              <Form.Control
                value={form.fertilizerCost}
                onChange={handleChange}
                type="number"
                name="fertilizerCost"
                className="form-control"
                placeholder="Fertilizer cost (if any)"
              />
              {errors.fertilizerCost && (
                <div className="text-danger">{errors.fertilizerCost}</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="mb-2">
              <Form.Control
                value={form.sprayCost}
                onChange={handleChange}
                type="number"
                name="sprayCost"
                className="form-control "
                placeholder="Spray cost (if any)"
              />
              {errors.sprayCost && (
                <div className="text-danger">{errors.sprayCost}</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="mb-2">
              <Form.Control
                value={form.laborCost}
                onChange={handleChange}
                type="number"
                name="laborCost"
                className="form-control"
                placeholder="Labor cost (if any)"
              />
              {errors.laborCost && (
                <div className="text-danger">{errors.laborCost}</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="mb-2">
              <Form.Control
                value={form.materialRentCost}
                onChange={handleChange}
                type="number"
                name="materialRentCost"
                className="form-control"
                placeholder="Material rent cost (if any)"
              />
              {errors.materialRentCost && (
                <div className="text-danger">{errors.materialRentCost}</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="mb-2">
              <Form.Control
                value={form.otherCost}
                onChange={handleChange}
                type="number"
                name="otherCost"
                className="form-control"
                placeholder="Other expenses"
              />
              {errors.otherCost && (
                <div className="text-danger">{errors.otherCost}</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="mb-2">
              <Form.Control
                value={form.profit}
                onChange={handleChange}
                type="number"
                name="profit"
                className="form-control"
                placeholder="%profit you like to earn: e.g. 5"
              />
              {errors.profit && (
                <div className="text-danger">{errors.profit}</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col xs={6} className="mb-2">
              <Form.Control
                value={form.totalOutput}
                onChange={handleChange}
                type="number"
                name="totalOutput"
                className="form-control"
                placeholder="total output of your field"
              />
              {errors.totalOutput && (
                <div className="text-danger">{errors.totalOutput}</div>
              )}
            </Col>
            <Col xs={6} className="mb-2">
              <Form.Select
                value={form.unit}
                type="string"
                name="unit"
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value=""></option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="pcs">pcs</option>
              </Form.Select>
              {errors.totalOutput && (
                <div className="text-danger">{errors.totalOutput}</div>
              )}
            </Col>
          </Row>
          <Row>
            <button
              type="button"
              disabled={isFormInvalid()}
              className="btn btn-f-primary mb-2"
              onClick={() => handleCropCost()}
            >
              Calculate Price of Crop Per {form.unit}
            </button>
          </Row>
        </Form>
        {cropCost > 0 && (
          <Col xs={12} className="mb-2">
            You must sell your crop at least{" "}
            <strong>
              PHP{cropCost} per {form.unit}
            </strong>{" "}
            to earn at least <strong>{form.profit ? form.profit : 0}% </strong>
            profit.
          </Col>
        )}
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default Calculator;
