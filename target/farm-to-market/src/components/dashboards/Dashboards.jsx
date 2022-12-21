import { CChartBar, CChartPie } from "@coreui/react-chartjs";
import React from "react";
import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getNotif } from "../../services/notif";
import { getSellerOrders, myPurchases } from "../../services/order";
import { annualRevenueReport } from "../../services/reports";
import { getUserInfo } from "../../services/userInf";

const Dashboards = () => {
  const [report, setReport] = useState(null);
  const [pieReport, setPieReport] = useState({});
  const [purchases, setPurchases] = useState(0);
  const [notif, setNotif] = useState({});
  const userInfo = getUserInfo() && getUserInfo().data;
  useEffect(() => {
    annualRevenueReport(userInfo.user_id).then((res) => {
      if (res.data) {
        setReport(res.data);
      }
    });

    getSellerOrders(userInfo.user_id).then((res) => {
      if (res.data) {
        setPieReport({
          delivered: res.data.filter((c) => c.status === "Delivered").length,
          cancel: res.data.filter((c) => c.status === "Canceled").length,
          pending: res.data.filter((c) => c.status === "Pending").length,
          shipped: res.data.filter((c) => c.status === "Shipped").length,
          all: res.data.length,
        });
      }
    });
    myPurchases(userInfo.user_id).then((res) => {
      if (res.data) {
        setPurchases(res.data.length);
      }
    });

    getNotif(userInfo.user_id).then((res) => {
      if (res.data) {
        setNotif({
          tips: res.data.tips.length,
          complaints: res.data.complaints.length,
        });
      }
    });
  }, []);

  const getReport = (m) => {
    var total = 0;
    report.map((rep) => {
      let date = new Date(rep[1]).toLocaleString("default", {
        month: "long",
      });
      if (date === m) {
        total += rep[0];
      }
    });

    return total;
  };

  if (report) {
    return (
      <Container className="mb-4 mt-4">
        <Row>
          <Col lg={6} className="mb-4">
            <Row>
              <Col lg={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <CChartBar
                      data={{
                        labels: [
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ],
                        datasets: [
                          {
                            label: "Monthly Sales",
                            backgroundColor: "#0d6efd",
                            data: [
                              getReport("January"),
                              getReport("February"),
                              getReport("March"),
                              getReport("April"),
                              getReport("May"),
                              getReport("June"),
                              getReport("July"),
                              getReport("August"),
                              getReport("September"),
                              getReport("October"),
                              getReport("November"),
                              getReport("December"),
                            ],
                          },
                        ],
                      }}
                      labels="months"
                    />
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={12}>
                <Row>
                  <Col lg={6} className="mb-4">
                    <Link
                      to="/orders"
                      className="text-decoration-none"
                      style={{ color: "#000" }}
                    >
                      <Card>
                        <Card.Body className="text-center">
                          <h3>Orders</h3>
                          <h2>{pieReport.all}</h2>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                  <Col lg={6}>
                    <Link
                      to="/mypurchases"
                      className="text-decoration-none"
                      style={{ color: "#000" }}
                    >
                      <Card>
                        <Card.Body className="text-center">
                          <h3>Purchases</h3>
                          <h2>{purchases}</h2>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                </Row>
              </Col>
              <Col lg={12}>
                <Row>
                  <Col lg={6} className="mb-4">
                    <Card>
                      <Card.Body className="text-center">
                        <h3>Tips</h3>
                        <h2>{notif.tips}</h2>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={6}>
                    <Card>
                      <Card.Body className="text-center">
                        <h3>Complaints</h3>
                        <h2>{notif.complaints}</h2>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col lg={6}>
            <Card>
              <Card.Body>
                {pieReport && (
                  <CChartPie
                    data={{
                      labels: ["Delivered", "Pending", "Shipped", "Canceled"],
                      datasets: [
                        {
                          data: [
                            pieReport.delivered,
                            pieReport.pending,
                            pieReport.shipped,
                            pieReport.cancel,
                          ],
                          backgroundColor: [
                            "#04b250",
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                          ],
                        },
                      ],
                    }}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default Dashboards;
