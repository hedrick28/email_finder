import {
  faEllipsisVertical,
  faPencilAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useEffect, useState } from "react";
import { Card, Col, Container, Dropdown, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deleteTip } from "../../redux/actions/tip";
import { tipDetails } from "../../services/tips";
import { getUserInfo } from "../../services/userInf";

const TipDetails = () => {
  const param = useParams();
  const [tip, setTip] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    tipDetails(+param.id).then((res) => {
      setTip(res.data.tip);
    });
  }, [param]);
  const handleDeleteTip = (id) => {
    dispatch(deleteTip(id, getUserInfo().data.role));
    navigate("/tips");
  };
  const handleUpdate = () => {
    navigate(`/tip/edit/${tip.tip_id}`);
  };
  if (tip) {
    return (
      <Container className="mb-4 mt-4">
        <Card>
          <Card.Header className="f-card-header">
            <Dropdown>
              <Dropdown.Toggle className="notif-dropdown">
                <FontAwesomeIcon color="#000" icon={faEllipsisVertical} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleDeleteTip(tip.tip_id)}>
                  <FontAwesomeIcon
                    color="#04b250"
                    className="me-3"
                    icon={faTrashAlt}
                  />
                  Delete
                </Dropdown.Item>
                <Dropdown.Item onClick={handleUpdate}>
                  <FontAwesomeIcon
                    color="#04b250"
                    className="me-3"
                    icon={faPencilAlt}
                  />
                  Update
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col lg={2}>
                <h6>Title</h6>
              </Col>
              <Col lg={10}>
                <p>{tip.title}</p>
              </Col>
            </Row>
            <Row>
              <Col lg={2}>
                <h6>Content</h6>
              </Col>
              <Col lg={10}>
                <p>{tip.content}</p>
              </Col>
            </Row>
            <Row>
              <Col lg={2}>
                <h6>Receiver</h6>
              </Col>
              <Col lg={10}>
                <p>{tip.type}s</p>
              </Col>
            </Row>
            {tip.seen && (
              <Row>
                <Col lg={2}>
                  <h6>Seen Date</h6>
                </Col>
                <Col lg={10}>
                  <p>{tip.seenDate}</p>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      </Container>
    );
  }
};

export default TipDetails;
