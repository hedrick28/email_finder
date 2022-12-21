import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { complaintDetails, complaintCancel } from "../../services/complaints";
import { toast } from "react-toastify";
import { getUserInfo } from "../../services/userInf";

const ComplaintDetails = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const userInfo = getUserInfo();

  useEffect(() => {
    complaintDetails(+param.id).then((res) => {
      if (res.data && res.data.status === 1) {
        setComplaint(res.data.data);
      } else if (res.data && res.data.status === 0) {
        navigate("/complaint/mycomplaints");
      }
    });
  }, [param.id]);

  const handleCancelReport = (id) => {
    complaintCancel(id).then((res) => {
      if (res.data && res.data.status === 1) {
        toast.success(res.data.message);
        navigate("/complaint/mycomplaints");
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
                    <b>Accused:</b> {complaint.businessName}
                  </p>
                  <p>
                    <b>Reason of Report:</b> {complaint.reason}
                  </p>
                  <p>
                    <b>Status:</b> {complaint.status}
                  </p>
                  <p>
                    <b>Date Settled: </b>
                    {complaint.dateSettled ? complaint.dateSettled : "-"}
                  </p>
                  <button
                    className="btn btn-f-primary btn-sm w-30 m-1"
                    onClick={() => {
                      navigate("/complaint/mycomplaints");
                    }}
                  >
                    Back
                  </button>
                  {(complaint.status === "Pending" ||
                    complaint.status === "Reviewing") &&
                  userInfo.data.businessName !== complaint.businessName ? (
                    <button
                      className="btn btn-f-primary btn-sm w-30 m-1"
                      onClick={() => {
                        handleCancelReport(complaint.complaint_id);
                      }}
                    >
                      Cancel Report
                    </button>
                  ) : null}
                  {complaint.status === "Pending" &&
                  userInfo.data.businessName !== complaint.businessName ? (
                    <Link
                      className="btn btn-f-primary btn-sm me-2 m-1"
                      to={`/complaint/mycomplaints/edit/${complaint.complaint_id}`}
                    >
                      Edit
                    </Link>
                  ) : null}
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
