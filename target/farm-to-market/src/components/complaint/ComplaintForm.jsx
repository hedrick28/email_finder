import React, { useState, useEffect } from "react";
import Joi from "joi";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Container, Form, Row } from "react-bootstrap";
import { allAccountUsers } from "../../services/user";
import { getUserInfo } from "../../services/userInf";
import lodash from "../../services/lodash";

const ComplaintForm = ({ onSubmit, initialValue }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportbusinessName = location.state?.report;
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(
    initialValue || {
      businessName: reportbusinessName ? reportbusinessName : "",
      reason: "",
      image: "",
      isAgree: "",
      owner: getUserInfo() && getUserInfo().data,
    }
  );
  const [imageData, setImageData] = useState(null);
  const [imagePrev, setImagePrev] = useState(
    initialValue ? require(`../../assets/uploads/${initialValue.image}`) : null
  );
  const [users, setUsers] = useState([]);
  const [fileError, setFileError] = useState("");
  const userInfo = getUserInfo();

  useEffect(() => {
    allAccountUsers().then((response) => {
      setUsers(response.data);
    });
  }, []);

  const schema = Joi.object({
    businessName: Joi.string().required(),
    reason: Joi.string().max(250).required(),
    image: Joi.string().required(),
    isAgree: Joi.string().required(),
    owner: Joi.object().allow({}).allow().required(),
  });

  const handleFileChange = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    var imageData1 = new FormData();
    imageData1.append("imageFile", file);
    setImageData(imageData1);
    setImagePrev(URL.createObjectURL(file));
    setForm({ ...form, [e.currentTarget.name]: file.name });

    if (e.target.files.length < 1) {
      return;
    }
    if (isValidFileUploaded(file)) {
      setFileError("");
    } else {
      setFileError("Please choose a valid image.");
    }
  };

  const isValidFileUploaded = (file) => {
    const validExtensions = ["png", "jpeg", "jpg"];
    const fileExtension = file.type.split("/")[1];
    return validExtensions.includes(fileExtension);
  };

  const handleChange = (e, type = "input") => {
    if (type === "input") {
      e.preventDefault();
    }
    setForm({ ...form, [e.currentTarget.name]: e.currentTarget.value });

    const { error } = schema
      .extract(e.currentTarget.name)
      .label(lodash(e.currentTarget.name))
      .validate(e.currentTarget.value);

    if (error) {
      setErrors({
        ...errors,
        [e.currentTarget.name]: error.details[0].message,
      });
    } else {
      delete errors[e.currentTarget.name];
      setErrors(errors);
    }
  };

  const handleChangeCheckBox = (event) => {
    let check = "";
    if (form.isAgree === "") {
      check = "true";
      delete errors[event.currentTarget.name];
      setErrors(errors);
    } else {
      check = "";
      setErrors({
        ...errors,
        isAgree: "Please agree with the terms and conditions",
      });
    }
    setForm({ ...form, isAgree: check });
  };

  const isFormInvalid = () => {
    const result = schema.validate(form);
    return !!result.error;
  };

  const handleCheckBusiness = () => {
    let businessname = users.find(
      (data) => data.businessName === form.businessName
    );

    if (businessname === null || businessname === undefined) {
      if (form.businessName === "") {
        return false;
      }
      return true;
    } else {
      if (userInfo.data.businessName === businessname?.businessName) {
        return true;
      }
    }

    return false;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(imageData, form);
  };

  return (
    <Container className="mt-4 mb-4">
      <Form onSubmit={handleSubmit}>
        <Card>
          <Card.Header>
            <Card.Title>
              {initialValue ? "Edit Complaint" : "Add Complaint"}
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Form.Group>
                <Form.Label>Who would you like to report?</Form.Label>
                <Form.Control
                  list="datalistOptions"
                  type="text"
                  size="1x"
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  required
                />
                <datalist id="datalistOptions">
                  {users
                    .filter(
                      (user) =>
                        user.activeDeactive === false &&
                        user.businessName !== null &&
                        userInfo.data.businessName !== user.businessName
                    )
                    .map((data) => {
                      return (
                        <option key={data.userName} value={data.businessName}>
                          {data.businessName}
                        </option>
                      );
                    })}
                </datalist>
                {errors.businessName && (
                  <div className="text-danger">
                    Please state the businessName of the one you want to report.
                  </div>
                )}
                {handleCheckBusiness() ? (
                  <div className="text-danger">
                    This businessname is not existing. Make sure spelling is
                    correct.
                  </div>
                ) : null}
              </Form.Group>
            </Row>
            <Row>
              <Form.Group>
                <Form.Label className="mt-3">
                  What is your reason for reporting?
                </Form.Label>
                <Form.Control
                  type="text"
                  size="1x"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  required
                />
                {errors.reason && (
                  <div className="text-danger">
                    Please state your reason for the report (maximum of 250
                    characters).
                  </div>
                )}
              </Form.Group>
            </Row>
            <Row className="justify-content-center ">
              <Form.Label className="mt-3">Proof of report</Form.Label>

              <div className="d-flex align-items-start justify-content-center align-items-sm-center gap-4">
                <img
                  src={imagePrev ? imagePrev : ""}
                  alt="proof"
                  className="proof"
                  id="uploadedProof"
                  width={"200px"}
                  height={"150px"}
                  required
                />
              </div>

              <div className="d-flex flex-row justify-content-center align-items-center">
                <label
                  htmlFor="upload"
                  className="btn input-f-primary"
                  tabIndex="0"
                  typeof="file"
                >
                  <input
                    name="image"
                    accept="image/*"
                    type="file"
                    id="upload"
                    className="account-file-input input-file-upload"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <div className="d-flex flex-row justify-content-center align-items-center ">
                <p className="text-mute mb-0">Allowed JPG, JPEG or PNG.</p>
              </div>
              <div className="d-flex flex-row justify-content-center align-items-center ">
                {fileError && <div className="text-danger">{fileError}</div>}
              </div>
            </Row>
            <Row>
              <Form.Group>
                <Form.Label className="mt-3">
                  Please be mindful that your report will be evaluated by the
                  admin. Complaints without factual support will lead to your
                  dismembership.
                </Form.Label>
                <div className="col-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isAgree"
                      checked={form.isAgree === "true"}
                      onChange={handleChangeCheckBox}
                      id="isAgree"
                      required
                    />
                    <label className="form-check-label" htmlFor="isAgree">
                      Agree to terms and conditions
                    </label>
                  </div>
                </div>

                {!!errors.isAgree && (
                  <div className="text-danger">
                    Please agree with the terms and conditions.
                  </div>
                )}
              </Form.Group>
            </Row>
          </Card.Body>
          <Card.Footer>
            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
              <button
                className="btn btn-f-primary me-md-2"
                type="button"
                onClick={() => {
                  navigate("/complaint/mycomplaints");
                }}
              >
                &nbsp;&nbsp;Back&nbsp;&nbsp;
              </button>
              <button
                className="btn btn-f-primary"
                type="submit"
                disabled={
                  isFormInvalid() ||
                  initialValue === form ||
                  (initialValue !== form ? fileError : false)
                }
              >
                Submit
              </button>
            </div>
          </Card.Footer>
        </Card>
      </Form>
    </Container>
  );
};

export default ComplaintForm;
