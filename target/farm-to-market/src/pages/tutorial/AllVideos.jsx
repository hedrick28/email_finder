import React, { useState, useEffect } from "react";
import { Container, Card, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { allVideoTutorials, setVisibility } from "../../services/tutorials";
import { getUserInfo } from "../../services/userInf";

const AllVideos = () => {
  const MAX_LENGTH = 43;
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    allVideoTutorials().then((response) => {
      if (getUserInfo().data.role === "admin") {
        setVideos(response.data);
      } else {
        setVideos(response.data.filter((video) => video.active === true));
      }
    });
  }, []);

  const handleVisibility = (id, type) => {
    setVisibility(id).then((response) => {
      if (type === "video") {
        allVideoTutorials().then((response) => {
          setVideos(response.data);
        });
      }
    });
  };

  const filtered = videos.filter((value) => {
    if (searchTerm === undefined) {
      return value;
    } else if (searchTerm === "") {
      return value;
    } else if (value.title?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return value;
    } else if (
      value.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return value;
    }
  });

  return (
    <Container className="mt-4 mb-4">
      <Row>
        <div>
          <button
            type="button"
            className="btn btn-f-primary btn-sm"
            style={{
              color: "green",
              marginRight: "15px",
              justifySelf: "right",
            }}
            onClick={() => navigate("/tutorials")}
          >
            <FontAwesomeIcon icon={faLeftLong} />
            &nbsp;Back
          </button>

          {getUserInfo().data.role === "admin" && (
            <button
              type="button"
              className="btn btn-f-primary btn-sm"
              style={{ color: "green", marginRight: "15px" }}
              onClick={() =>
                navigate("/tutorials/add", {
                  state: {
                    type: "Video",
                  },
                })
              }
            >
              <FontAwesomeIcon icon={faPlusSquare} />
              &nbsp;Add Videos
            </button>
          )}

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
            placeholder="Search for videos..."
          />
          <button
            type="button"
            style={{
              color: "white",
              marginRight: "15px",
              background: "green",
            }}
            onClick={() => setSearchTerm("")}
          >
            Clear
          </button>
        </div>

        <Row xs={1} md={4} className="g-2">
          {filtered.map((data) => (
            <Col key={data.tutorial_id}>
              <Card>
                <Link
                  to={`/tutorials/detail/${data.tutorial_id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <Card.Img
                    width={"200px"}
                    height={"150px"}
                    variant="top"
                    src={require("../../assets/uploads/" + data.image)}
                  />

                  <Card.Body style={{ height: "150px" }}>
                    <Card.Title>{data.title}</Card.Title>
                    <Card.Text>
                      {data.description.length > MAX_LENGTH ? (
                        <>{data.description.substring(0, MAX_LENGTH)}...</>
                      ) : (
                        data.description
                      )}
                    </Card.Text>
                  </Card.Body>
                </Link>
                {getUserInfo().data.role === "admin" ? (
                  <Card.Footer>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                      <button
                        className="btn btn-f-primary btn-sm me-md-2"
                        onClick={() => {
                          handleVisibility(data.tutorial_id, data.type);
                        }}
                      >
                        {data.active === true ? "Hide" : "Show"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-f-primary btn-sm"
                        onClick={() =>
                          navigate(`/tutorials/edit/${data.tutorial_id}`, {
                            state: {
                              type: "Video",
                            },
                          })
                        }
                      >
                        &nbsp;Edit&nbsp;
                      </button>
                    </div>
                  </Card.Footer>
                ) : null}
              </Card>
            </Col>
          ))}
        </Row>
      </Row>
    </Container>
  );
};

export default AllVideos;
