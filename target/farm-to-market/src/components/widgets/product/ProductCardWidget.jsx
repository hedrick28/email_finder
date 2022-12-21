import React from "react";
import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { productReport } from "../../../services/reports";

const ProductCardWidget = ({ product }) => {
  const [report, setReport] = useState({});
  useEffect(() => {
    productReport(product.product_id).then((res) => {
      if (res.data) {
        var order = res.data.filter(
          (r) => r.status !== null || r.status !== ""
        ).length;

        var sold = res.data.filter((r) => r.paymentStatus === "paid").length;
        var returned = res.data.filter((r) => r.status === "Returned").length;
        var delivered = res.data.filter((r) => r.status === "Delivered").length;
        var canceled = res.data.filter((r) => r.status === "Cancelled").length;

        setReport({ order, sold, returned, delivered, canceled });
      }
    });
  }, []);

  if (report) {
    return (
      <Row className="mb-2">
        <Col lg={12} className="rating-report m-1">
          <Card>
            <Card.Body>SOLD {report.sold}</Card.Body>
          </Card>
        </Col>
        {/* <Col lg={5} className="rating-report m-1">
          <div>ORDERS {report.order}</div>
        </Col>
        <Col lg={5} className="rating-report m-1">
          <div>DELIVERED {report.delivered}</div>
        </Col>
        <Col lg={5} className="rating-report m-1">
          <div>RETURNED {report.returned}</div>
        </Col>
        <Col lg={5} className="rating-report m-1">
          <div>CANCEL {report.canceled}</div>
        </Col> */}
      </Row>
    );
  }
};

export default ProductCardWidget;
