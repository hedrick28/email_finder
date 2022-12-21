import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  complaintDetails,
  complaintApprove,
  complaintDisapprove,
} from "../../services/complaints";
import { allAccountUsers } from "../../services/user";
import { toast } from "react-toastify";

const ComplaintDetails = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    complaintDetails(+param.id).then((res) => {
      if (res.data && res.data.status === 1) {
        setComplaint(res.data.data);
      } else if (res.data && res.data.status === 0) {
        navigate("/complaint");
      }
    });
    allAccountUsers().then((response) => {
      setUsers(response.data);
    });
  }, [param.id]);

  const handleApprove = (id, businessName) => {
    let user = users.find((data) => data.businessName === businessName);
    complaintApprove(id, user.user_id).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
        navigate("/complaint/all");
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
  };

  const handleDisapprove = (id) => {
    complaintDisapprove(id).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
        navigate("/complaint/all");
      } else if (res.data && res.data.status === 0) {
        toast.error(res.data.message);
      }
    });
  };

  if (complaint) {
    return (
      <div className="container mb-4 mt-4">
        <Card style={{ marginBottom: "100px" }}>
          <Card.Body>
            <Row>
              <Col lg={6}>
                <img
                  src={require("../../assets/uploads/" + complaint.image)}
                  className="w-100"
                />
              </Col>
              <Col lg={6}>
                <div className="">
                  <p>
                    <b>Reference Code:</b> {complaint.referenceCode}
                  </p>
                  <p>
                    <b>Date Filed:</b> {complaint.dateFiled}
                  </p>
                  <p>
                    <b>Accuser:</b> {complaint.owner.businessName}
                  </p>
                  <p>
                    <b>Accused:</b> {complaint.businessName}
                  </p>
                  <p>
                    <b>Reason of Report:</b> {complaint.reason}
                  </p>
                  <p>
                    <b>Status:</b> {complaint.status}
                  </p>
                  <button
                    className="btn btn-f-primary btn-sm w-30 m-1"
                    onClick={() => {
                      navigate("/complaint/all");
                    }}
                  >
                    Back
                  </button>
                  {complaint.status === "Pending" ||
                  complaint.status === "Reviewing" ? (
                    <>
                      <button
                        className="btn btn-f-primary btn-sm w-30 m-1"
                        onClick={() => {
                          handleApprove(
                            complaint.complaint_id,
                            complaint.businessName
                          );
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-f-primary btn-sm w-30 m-1"
                        onClick={() => {
                          handleDisapprove(complaint.complaint_id);
                        }}
                      >
                        Disapprove
                      </button>
                    </>
                  ) : null}
                  {complaint.status === "Approved" && (
                    <button
                      className="btn btn-f-primary btn-sm w-30 m-1"
                      onClick={() => {
                        handleDisapprove(complaint.complaint_id);
                      }}
                    >
                      Disapprove
                    </button>
                  )}
                  {complaint.status === "Disapproved" && (
                    <button
                      className="btn btn-f-primary btn-sm w-30 m-1"
                      onClick={() => {
                        handleApprove(
                          complaint.complaint_id,
                          complaint.businessName
                        );
                      }}
                    >
                      Approve
                    </button>
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    );
  }
};

export default ComplaintDetails;
