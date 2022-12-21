import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  userDetails,
  addressDetails,
  approveUser,
  disapproveUser,
} from "../../services/user";
import { toast } from "react-toastify";

const AccountDetails = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    userDetails(+param.id).then((res) => {
      if (res.data && res.data.status === 1) {
        setAccount(res.data.data);
      } else if (res.data && res.data.status === 0) {
        toast.error("account does not exist");
      }
    });
    addressDetails(+param.id).then((res) => {
      if (res.data && res.data.status === 1) {
        setAddress(res.data.data);
      } else if (res.data && res.data.status === 0) {
        toast.error("address does not exist");
      }
    });
  }, [param.id]);

  const handleApproval = (id, role) => {
    approveUser(id).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
    navigate(`/users/${role}s`);
  };

  const handleDisapproval = (id, role) => {
    disapproveUser(id).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
    navigate(`/users/${role}s`);
  };

  const handleIsFormInValid = () => {
    if (account.image === null) {
      return true;
    }
    if (address === "null") {
      return true;
    }
    return false;
  };

  if (account) {
    return (
      <Container className="mb-4 mt-4">
        <Form>
          <Row className="d-flex justify-content-center align-items-center">
            <Col lg={10}>
              <Card>
                <Card.Header>
                  <Card.Title>User Information</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Row className="justify-content-center">
                    <Col lg={6} className="mb-3">
                      <div className="d-flex align-items-start justify-content-center align-items-sm-center gap-4">
                        <img
                          className="img-fluid rounded"
                          src={
                            account.profile
                              ? require(`../../assets/uploads/${account.profile}`)
                              : require(`../../assets/uploads/empty.jpg`)
                          }
                          alt="profile picture"
                          width={"200px"}
                          height={"150px"}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          readOnly
                          value={account.firstName}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          readOnly
                          value={account.lastName}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Birthday</Form.Label>
                        <Form.Control
                          readOnly
                          value={account.birthDate}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Gender</Form.Label>
                        <Form.Control
                          readOnly
                          value={account.gender ? account.gender : "N/A"}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control
                          readOnly
                          value={account.mobile}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          readOnly
                          value={account.email ? account.email : "N/A"}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={4} className="mb-3">
                      <Form.Group>
                        <Form.Label>Business Name</Form.Label>
                        <Form.Control
                          readOnly
                          value={
                            account.businessName ? account.businessName : "N/A"
                          }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col lg={4} className="mb-3">
                      <Form.Group>
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                          readOnly
                          value={account.role}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col lg={4} className="mb-3">
                      <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                          readOnly
                          value={
                            account.activeDeactive === false
                              ? account.approvalStatus === "For Approval"
                                ? "For Approval"
                                : "Disapproved"
                              : "Deactive"
                          }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          readOnly
                          value={
                            address
                              ? (address.houseNo ? "#" + address.houseNo : "") +
                                " " +
                                (address.street ? address.street : "") +
                                " " +
                                (address.barangay ? address.barangay : "") +
                                " " +
                                (address.city ? address.city : "") +
                                " " +
                                (address.province ? address.province : "")
                              : "N/A"
                          }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              {account.role !== "admin" ? (
                <Card className="mt-3">
                  <Card.Header>
                    <Card.Title>Submitted Documents</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col lg={6} className="mb-3">
                        <div className="d-flex align-items-start justify-content-left align-items-sm-center gap-4">
                          <img
                            className="img-fluid rounded"
                            src={
                              account.image
                                ? require(`../../assets/uploads/${account.image}`)
                                : require(`../../assets/uploads/notfound.png`)
                            }
                            alt="valid ID"
                            width={"200px"}
                            height={"150px"}
                          />
                        </div>
                      </Col>
                      <Col lg={6} className="mb-3">
                        <div>
                          <h5 className="card-title">Valid ID</h5>
                          <p className="card-text">
                            List of Acceptable Valid IDs : e-Card/UMID,
                            Employees's ID/Office ID, Driver's License, PRC ID,
                            Passport, SSS ID, Voter's ID/COMELEC Registration
                            Form, National ID, NBI Clearance, PWD ID, Barangay
                            ID, Pag-ibig ID, Philhealth ID, School ID
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ) : null}
            </Col>
            {account.approvalStatus === "For Approval" &&
            account.role !== "admin" ? (
              <div className="d-grid gap-2 d-md-flex justify-content-md-center m-3">
                <button
                  disabled={handleIsFormInValid()}
                  type="button"
                  className="btn btn-f-primary me-md-2"
                  onClick={() => handleApproval(account.user_id, account.role)}
                >
                  &nbsp;&nbsp;Approve&nbsp;&nbsp;
                </button>
                <button
                  disabled={handleIsFormInValid()}
                  type="button"
                  className="btn btn-f-primary"
                  onClick={() =>
                    handleDisapproval(account.user_id, account.role)
                  }
                >
                  Disapprove
                </button>
              </div>
            ) : null}
          </Row>
        </Form>
      </Container>
    );
  }
};

export default AccountDetails;
