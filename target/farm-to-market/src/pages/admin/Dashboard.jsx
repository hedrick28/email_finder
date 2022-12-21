import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Card, Row, Col } from "react-bootstrap";
import { allAdminUsers } from "../../services/user";
import { allFarmerUsers } from "../../services/user";
import { allSupplierUsers } from "../../services/user";
import { allComplaints } from "../../services/complaints";
import {
  allVideoTutorials,
  allImageTutorials,
  allArticleTutorials,
} from "../../services/tutorials";
import { getOwnerTips } from "../../services/tips";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faUsers,
  faFileAlt,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { faVideo, faFile, faImage } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [adminAccounts, setAdminAccounts] = useState([]);
  const [farmerAccounts, setFarmerAccounts] = useState([]);
  const [supplierAccounts, setSupplierAccounts] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [articles, setArticles] = useState([]);
  const [tips, setTips] = useState(null);

  useEffect(() => {
    allAdminUsers().then((res) => {
      setAdminAccounts(
        res.data.filter((admin) => {
          return admin.userName !== "superadmin";
        })
      );
    });
    allFarmerUsers().then((res) => {
      setFarmerAccounts(res.data);
    });
    allSupplierUsers().then((res) => {
      setSupplierAccounts(res.data);
    });
    allComplaints().then((res) => {
      setComplaints(res.data);
    });
    allVideoTutorials().then((response) => {
      setVideos(response.data.filter((video) => video.active === true));
    });
    allImageTutorials().then((response) => {
      setImages(response.data.filter((image) => image.active === true));
    });
    allArticleTutorials().then((response) => {
      setArticles(response.data.filter((article) => article.active === true));
    });
    getOwnerTips().then((res) => {
      setTips(res.data.tips);
    });
  }, []);

  return (
    <Container className="mb-4 mt-4">
      <Row>
        <Col>
          <Card className="m-1">
            <Card.Body>
              <Card.Title>SUPERADMIN</Card.Title>
              <Card.Text style={{ fontSize: "50px" }}>
                1
                <FontAwesomeIcon
                  size="xs"
                  style={{ marginLeft: "70px" }}
                  icon={faUserShield}
                />
              </Card.Text>
              <Card.Text>Assigned</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Link
            to={"/users/admins"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Card className="m-1">
              <Card.Body>
                <Card.Title>ADMIN</Card.Title>
                <Card.Text style={{ fontSize: "50px" }}>
                  {adminAccounts?.length}
                  <FontAwesomeIcon
                    size="xs"
                    style={{ marginLeft: "70px" }}
                    icon={faUserShield}
                  />
                </Card.Text>
                <Card.Text>Assigned</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col>
          <Link
            to={"/users/farmers"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Card className="m-1">
              <Card.Body>
                <Card.Title>FARMER</Card.Title>
                <Card.Text style={{ fontSize: "50px" }}>
                  {farmerAccounts?.length}
                  <FontAwesomeIcon
                    size="xs"
                    style={{ marginLeft: "70px" }}
                    icon={faUserCircle}
                  />
                </Card.Text>
                <Card.Text>
                  {farmerAccounts?.length > 1 ? " Members" : " Member"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col>
          <Link
            to={"/users/suppliers"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Card className="m-1">
              <Card.Body>
                <Card.Title>SUPPLIER</Card.Title>
                <Card.Text style={{ fontSize: "50px" }}>
                  {supplierAccounts?.length}
                  <FontAwesomeIcon
                    size="xs"
                    style={{ marginLeft: "70px" }}
                    icon={faUsers}
                  />
                </Card.Text>
                <Card.Text>
                  {supplierAccounts?.length > 1 ? " Members" : " Member"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Link
            to={"/complaint/all"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Card className="m-1">
              <Card.Body>
                <Card.Title>COMPLAINTS</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  &nbsp;
                </Card.Subtitle>
                <Card.Text style={{ fontSize: "50px" }}>
                  {complaints?.length}
                  <FontAwesomeIcon
                    size="xs"
                    style={{ marginLeft: "70px" }}
                    icon={faFileAlt}
                  />
                </Card.Text>
                <Card.Text>Total</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col>
          <Link
            to={videos?.length > 0 ? "/tutorials/videos" : "/tutorials"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Card className="m-1">
              <Card.Body>
                <Card.Title>VIDEO</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  TUTORIALS
                </Card.Subtitle>
                <Card.Text style={{ fontSize: "50px" }}>
                  {videos?.length}
                  <FontAwesomeIcon
                    size="xs"
                    style={{ marginLeft: "70px" }}
                    icon={faVideo}
                  />
                </Card.Text>
                <Card.Text>Active</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>

        <Col>
          <Link
            to={images?.length > 0 ? "/tutorials/images" : "/tutorials"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Card className="m-1">
              <Card.Body>
                <Card.Title>IMAGE</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  TUTORIALS
                </Card.Subtitle>
                <Card.Text style={{ fontSize: "50px" }}>
                  {images?.length}
                  <FontAwesomeIcon
                    size="xs"
                    style={{ marginLeft: "70px" }}
                    icon={faImage}
                  />
                </Card.Text>
                <Card.Text>Active</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col>
          <Link
            to={articles?.length > 0 ? "/tutorials/articles" : "/tutorials"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Card className="m-1">
              <Card.Body>
                <Card.Title>ARTICLE</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  TUTORIALS
                </Card.Subtitle>
                <Card.Text style={{ fontSize: "50px" }}>
                  {articles?.length}
                  <FontAwesomeIcon
                    size="xs"
                    style={{ marginLeft: "70px" }}
                    icon={faFile}
                  />
                </Card.Text>
                <Card.Text>Active</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Link to={"/tips"} style={{ textDecoration: "none", color: "black" }}>
            <Card className="m-1">
              <Card.Body>
                <Card.Title>TIPS&nbsp;&nbsp;&nbsp;</Card.Title>
                <Card.Text style={{ fontSize: "50px" }}>
                  {tips?.length}
                  <FontAwesomeIcon
                    size="xs"
                    style={{ marginLeft: "70px" }}
                    icon={faLightbulb}
                  />
                </Card.Text>
                <Card.Text>Total</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col></Col>
        <Col></Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
