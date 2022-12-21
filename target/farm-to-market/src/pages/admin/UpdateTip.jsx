import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import TipForm from "../../components/admin/TipForm";
import { addTip } from "../../redux/actions/tip";
import { tipDetails } from "../../services/tips";

const UpdateTip = () => {
  const [tip, setTip] = useState(null);
  const param = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    tipDetails(+param.id).then((res) => {
      if (res.data && res.data.status === 1) {
        setTip(res.data.tip);
      }
    });
  }, [param]);

  if (tip) {
    const { title, content, tip_id, owner, type } = tip;

    const handleSubmit = (data) => {
      var tipData = { ...data, owner, tip_id };
      dispatch(addTip(tipData));
    };
    return (
      <Container className="mb-4 mt-4">
        <div className="d-flex justify-content-center">
          <TipForm
            initialValue={{ title, content, type }}
            onSubmit={handleSubmit}
          />
        </div>
      </Container>
    );
  }
};

export default UpdateTip;
