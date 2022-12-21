import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { adDetails } from "../../services/advertisement";
import { getUserInfo } from "../../services/userInf";
import { getPersonMessage } from "../../redux/actions/message";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdvertisementComment from "../../components/advertisement/AdvertisementComment";
import {
  faMessage,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const AdDetails = () => {
  const param = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = getUserInfo();
  const [ads, setAds] = useState(null);
  useEffect(() => {
    adDetails(+param.id).then((res) => {
      if (res.data && res.data.status === 1) {
        setAds(res.data.data);
      } else if (res.data && res.data.status === 0) {
        navigate("/advertisement");
      }
    });
  }, []);

  //   const handleComment = (data) => {
  //     comment(data).then((res) => {});
  //   };

  const handleMessage = () => {
    if (userInfo) {
      dispatch(getPersonMessage(userInfo.data.user_id, ads.owner.user_id));
    } else {
      navigate("/login");
    }
  };

  if (ads) {
    return (
      <div className="container mb-4 mt-4">
        <Card>
          <Card.Body>
            <Row>
              <Col lg={6}>
                <img
                  src={require("../../assets/uploads/" + ads.image)}
                  className="w-100"
                />
              </Col>
              <Col lg={6}>
                <div className="">
                  <h5 className="text-uppercase">{ads.productName}</h5>

                  <p>{ads.description}</p>
                  <p>Category: &nbsp;{ads.category ? ads.category : ""}</p>
                  <p>
                    Quantity Needed: &nbsp;{ads.quantity} {ads.unit}
                  </p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Row className="mb-3">
          <Col lg={5}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={3}>
                    <img
                      src={
                        ads.owner.profile
                          ? require(`../../assets/uploads/${ads.owner.profile}`)
                          : require("../../assets/uploads/empty.jpg")
                      }
                      alt=""
                      width="100"
                      className="rounded-circle"
                    />
                  </Col>
                  <Col xs={12} className="d-flex align-items-center">
                    <Row>
                      <Col xs={12}>
                        <h5 className="text-uppercase">{ads.owner.userName}</h5>
                      </Col>
                      <Col xs={12}>
                        <button
                          hidden={
                            userInfo.data.businessName !==
                            ads.owner.businessName
                              ? ""
                              : "hidden"
                          }
                          className="btn btn-f-primary"
                          onClick={handleMessage}
                        >
                          <FontAwesomeIcon icon={faMessage} className="me-3" />
                          <span>Message</span>
                        </button>
                        {userInfo.data.businessName !==
                          ads.owner.businessName && (
                          <button
                            style={{ marginLeft: "10px" }}
                            className="btn btn-primary"
                            onClick={() =>
                              navigate("/complaint/add", {
                                state: {
                                  report: ads.owner.businessName,
                                },
                              })
                            }
                          >
                            <FontAwesomeIcon
                              icon={faCircleExclamation}
                              className="me-3"
                            />
                            <span>Report this user</span>
                          </button>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <AdvertisementComment advertisement={ads} />
      </div>
    );
  }
};
export default AdDetails;
