import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ComplaintForm from "../../components/complaint/ComplaintForm";
import { complaintDetails } from "../../services/complaints";
import { add, addComplaint } from "../../redux/actions/complaint";
import { useDispatch } from "react-redux";

const EditComplaint = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const [complaint, setComplaint] = useState(null);
  useEffect(() => {
    complaintDetails(+param.id).then((res) => {
      if (res.data && res.data.status === 1) {
        setComplaint(res.data.data);
      }
    });
  }, [param.id]);

  if (complaint) {
    const { complaint_id, businessName, reason, image, isAgree, owner } =
      complaint;

    const handleSubmit = (image, data) => {
      const formData = { ...data, complaint_id };
      if (!image) {
        dispatch(addComplaint(formData, "update")).then((data) => {
          complaintDetails(complaint_id).then((res) => {
            if (res.data && res.data.status === 1) {
              setComplaint(res.data.data);
              navigate("/complaint/mycomplaints");
            }
          });
        });
      } else {
        dispatch(add(image, formData, "update")).then((data) => {
          complaintDetails(complaint_id).then((res) => {
            if (res.data && res.data.status === 1) {
              setComplaint(res.data.data);
              navigate("/complaint/mycomplaints");
            }
          });
        });
      }
    };

    return (
      <div className="container">
        <ComplaintForm
          initialValue={{
            businessName,
            reason,
            image,
            isAgree,
            owner,
          }}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }
};

export default EditComplaint;
