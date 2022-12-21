import React, { useState } from "react";
import "./profile.scss";
import { getUserInfo } from "../../services/userInf";
import { Card, Container, Form, Row, Col } from "react-bootstrap";
import Joi from "joi";
import lodash from "../../services/lodash";
import { updateProfile, upload } from "../../services/user";
import { toast } from "react-toastify";
import { numberOnlyInput } from "../../services/inputService";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  regions,
  provinces,
  cities,
  barangays,
} from "select-philippines-address";

const Profile = () => {
  const search = useLocation().search;
  const param = new URLSearchParams(search).get("target");
  const navigate = useNavigate();
  const {
    firstName,
    lastName,
    mobile,
    email,
    user_id,
    birthDate,
    gender,
    profile,
    role,
    image,
  } = getUserInfo().data;
  const [userInfo, setUserInfo] = useState({
    firstName,
    lastName,
    mobile,
    user_id,
    birthDate,
    gender,
    email,
    role,
    image: "",
    imageSupplier: "",
  });
  const [newAddress, setAddress] = useState(
    getUserInfo().data.address
      ? getUserInfo().data.address
      : {
          province: "",
          city: "",
          barangay: "",
          street: "",
          houseNo: "",
          region: "",
          user: userInfo,
        }
  );
  const [errors, setErrors] = useState({});
  const [imageDataSupplier, setImageDataSupplier] = useState(null);
  const [imagePrevSupplier, setImagePrevSupplier] = useState(
    image ? require(`../../assets/uploads/${image}`) : null
  );

  const [imageData, setImageData] = useState(null);
  const [imagePrev, setImagePrev] = useState(
    profile ? require(`../../assets/uploads/${profile}`) : null
  );

  const userInfoSchema = Joi.object({
    user_id: Joi.number().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    birthDate: Joi.string()
      .allow("")
      .required()
      .optional()
      .custom((value, helper) => {
        var dob = new Date(value.split(" ")[0]);
        var dateNow = new Date();
        if (dateNow.getFullYear() - dob.getFullYear() < 15) {
          return helper.message(
            "Invalid birth date, age must be greater than or equal to 15"
          );
        } else {
          return true;
        }
      }),
    image: Joi.string().allow("").optional(),
    imageSupplier: Joi.string().allow("").optional(),
    mobile: Joi.string().required(),
    gender: Joi.string().required(),
    email: Joi.string().required(),
    profile: Joi.string().optional(),
    role: Joi.string().optional(),
  });

  const userAddressSchema = Joi.object({
    address_id: Joi.number().allow(),
    province: Joi.string().required(),
    city: Joi.string().required(),
    barangay: Joi.string().required(),
    street: Joi.string().required(),
    region: Joi.string().required(),
    houseNo: Joi.string().required(),
    user: Joi.object().allow().optional(),
  });

  const handleChange = (e, type = "input") => {
    if (type === "input") {
      e.preventDefault();
    }
    setUserInfo({ ...userInfo, [e.currentTarget.name]: e.currentTarget.value });

    const { error } = userInfoSchema
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

  const [regionData, setRegion] = useState([""]);
  const [provinceData, setProvince] = useState([""]);
  const [cityData, setCity] = useState([""]);
  const [barangayData, setBarangay] = useState([]);

  const region = () => {
    regions().then((response) => {
      setRegion(response);
    });
  };

  const province = (e) => {
    provinces(e.target.value).then((response) => {
      setProvince(response);
      setCity([]);
      setBarangay([]);
    });
    setAddress({
      ...newAddress,
      [e.currentTarget.name]: e.target.selectedOptions[0].text,
    });
  };

  const city = (e) => {
    cities(e.target.value).then((response) => {
      setCity(response);
    });
    setAddress({
      ...newAddress,
      [e.currentTarget.name]: e.target.selectedOptions[0].text,
    });
  };

  const barangay = (e) => {
    barangays(e.target.value).then((response) => {
      setBarangay(response);
    });
    setAddress({
      ...newAddress,
      [e.currentTarget.name]: e.target.selectedOptions[0].text,
    });
  };

  const brgy = (e) => {
    setAddress({
      ...newAddress,
      [e.currentTarget.name]: e.target.selectedOptions[0].text,
    });
  };

  useEffect(() => {
    region();
  }, []);

  const handleChangeAddress = (e) => {
    e.preventDefault();
    setAddress({
      ...newAddress,
      [e.currentTarget.name]: e.currentTarget.value,
    });
    const { error } = userAddressSchema
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
  const isFormValid = () => {
    const userInfoResult = userInfoSchema.validate(userInfo);
    const userAddressResult = userAddressSchema.validate(newAddress);
    return !!userInfoResult.error || !!userAddressResult.error;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      ...userInfo,
      address: newAddress,
    };

    if (imageData && imageData.entries().next().value[1] !== null) {
      upload(imageData).then((res) => {
        if (res.data && res.data.status === 1) {
          update(data);
        }
      });
    } else if (
      imageDataSupplier &&
      imageDataSupplier.entries().next().value[1] !== null
    ) {
      upload(imageDataSupplier).then((res) => {
        if (res.data && res.data.status === 1) {
          update(data);
        }
      });
    } else {
      update(data);
    }
  };

  const update = (data) => {
    updateProfile(data).then((res) => {
      if (res.data && res.data.status === 1) {
        localStorage.setItem("ftm", JSON.stringify(res.data));
        toast.success(res.data.message);
        if (param) {
          navigate("/cart");
        }
      }
    });
  };

  const handleFileChange = (e) => {
    e.preventDefault();

    let file = e.target.files[0];
    var imageData1 = new FormData();
    imageData1.append("imageFile", file);
    setImageData(imageData1);
    setImagePrev(URL.createObjectURL(file));
    setUserInfo({ ...userInfo, [e.currentTarget.name]: file.name });
  };

  const uservalidation = (e) => {
    e.preventDefault();

    let file = e.target.files[0];
    var imageData1 = new FormData();
    imageData1.append("imageFile", file);
    setImageDataSupplier(imageData1);
    setImagePrevSupplier(URL.createObjectURL(file));
    setUserInfo({ ...userInfo, [e.currentTarget.name]: file.name });
  };

  useEffect(() => {
    if (param) {
      document.getElementById("address").scrollIntoView({ behavior: "smooth" });
    }
  }, [param]);

  return (
    <Container className="mb-4 mt-4">
      <Form onSubmit={handleSubmit}>
        <Row className="d-flex justify-content-center align-items-center">
          <Col lg={10}>
            <Card>
              <Card.Header>
                <Card.Title>User Information</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={6} className="mb-3">
                    <div className="d-flex align-items-start justify-content-center align-items-sm-center gap-4">
                      <img
                        src={
                          imagePrev
                            ? imagePrev
                            : require("../../assets/uploads/empty.jpg")
                        }
                        alt="profile"
                        className="profilePicture"
                        id="uploadedAvatar"
                        width={"200px"}
                        height={"150px"}
                      />
                    </div>
                  </Col>
                  <Col
                    lg={6}
                    className=" d-flex justify-content-center align-items-center "
                  >
                    <div className="button-wrapper">
                      <div className="d-flex flex-row justify-content-center align-items-center ">
                        <label
                          htmlFor="upload"
                          className="btn input-f-primary"
                          tabIndex="0"
                          typeof="file"
                        >
                          <input
                            name="profile"
                            accept="image/x-png,image/jpeg,image/jpg"
                            type="file"
                            id="upload"
                            className="account-file-input input-file-upload"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <p className="text-mute mb-0">
                        Allowed JPG, JPEG or PNG. Max size of 1MB
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        name="firstName"
                        onChange={handleChange}
                        value={userInfo.firstName}
                      ></Form.Control>
                      {!!errors.firstName && (
                        <span className="text-danger">{errors.firstName}</span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col lg={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        name="lastName"
                        value={userInfo.lastName}
                        onChange={handleChange}
                      ></Form.Control>
                      {!!errors.lastName && (
                        <span className="text-danger">{errors.lastName}</span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col lg={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Birth Date</Form.Label>
                      <Form.Control
                        name="birthDate"
                        type="date"
                        onChange={handleChange}
                        value={userInfo.birthDate}
                        disabled={true}
                      ></Form.Control>
                      {!!errors.birthDate && (
                        <span className="text-danger">{errors.birthDate}</span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col lg={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Mobile Number</Form.Label>
                      <div className="input-group mb-2">
                        <div className="input-group-prepend">
                          <div className="input-group-text">+63</div>
                        </div>
                        <Form.Control
                          name="mobile"
                          value={userInfo.mobile ? userInfo.mobile : ""}
                          onChange={handleChange}
                          onKeyPress={(e) => numberOnlyInput(e, 10)}
                          disabled={true}
                        ></Form.Control>
                      </div>
                      {!!errors.mobile && (
                        <span className="text-danger">{errors.mobile}</span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col lg={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Gender</Form.Label>
                      <Row>
                        <Col lg={6}>
                          <Form.Check
                            checked={userInfo.gender === "Male" ? true : false}
                            onChange={(e) => handleChange(e, "radio")}
                            name="gender"
                            value="Male"
                            type="radio"
                            label="Male"
                          />
                        </Col>
                        <Col lg={6}>
                          <Form.Check
                            name="gender"
                            checked={
                              userInfo.gender === "Female" ? true : false
                            }
                            onChange={(e) => handleChange(e, "radio")}
                            value="Female"
                            type="radio"
                            label="Female"
                          />
                        </Col>
                      </Row>
                      {!!errors.gender && (
                        <span className="text-danger">{errors.gender}</span>
                      )}
                    </Form.Group>
                  </Col>
                  <Col lg={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        onChange={handleChange}
                        value={userInfo.email}
                      ></Form.Control>
                      {!!errors.email && (
                        <span className="text-danger">{errors.email}</span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <div className="form-select-address">
              <Card className="mt-3" id=" ss">
                <Card.Header>
                  <Card.Title>Address</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Region</Form.Label>
                        <select
                          className="form-control w-100"
                          onChange={province}
                          onSelect={region}
                          name="region"
                        >
                          <option>
                            {newAddress.region ? newAddress.region : ""}
                          </option>
                          {regionData &&
                            regionData.length > 0 &&
                            regionData.map((item, idx) => (
                              <option key={idx} value={item.region_code}>
                                {item.region_name}
                              </option>
                            ))}
                        </select>
                        {!!errors.region && (
                          <span className="text-danger">{errors.region}</span>
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Province</Form.Label>
                        <select
                          onChange={city}
                          name="province"
                          className="form-control"
                        >
                          <option>
                            {newAddress.province ? newAddress.province : ""}
                          </option>
                          {provinceData &&
                            provinceData.length > 0 &&
                            provinceData.map((item, idx) => (
                              <option key={idx} value={item.province_code}>
                                {item.province_name}
                              </option>
                            ))}
                        </select>
                        {!!errors.province && (
                          <span className="text-danger">{errors.province}</span>
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>City / Municipality</Form.Label>
                        <select
                          onChange={barangay}
                          name="city"
                          className="form-control"
                        >
                          <option>
                            {newAddress.city ? newAddress.city : ""}
                          </option>
                          {cityData &&
                            cityData.length > 0 &&
                            cityData.map((item, idx) => (
                              <option key={idx} value={item.city_code}>
                                {item.city_name}
                              </option>
                            ))}
                        </select>
                        {!!errors.city && (
                          <span className="text-danger">{errors.city}</span>
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Barangay</Form.Label>
                        <select
                          onChange={brgy}
                          name="barangay"
                          className="form-control"
                        >
                          <option>
                            {newAddress.barangay ? newAddress.barangay : ""}
                          </option>
                          {barangayData &&
                            barangayData.length > 0 &&
                            barangayData.map((item, idx) => (
                              <option key={idx} value={item.brgy_code}>
                                {item.brgy_name}
                              </option>
                            ))}
                        </select>
                        {!!errors.barangay && (
                          <span className="text-danger">{errors.barangay}</span>
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Street</Form.Label>
                        <Form.Control
                          name="street"
                          onChange={handleChangeAddress}
                          value={newAddress.street}
                        />
                        {!!errors.street && (
                          <span className="text-danger">{errors.street}</span>
                        )}
                      </Form.Group>
                      <br />
                    </Col>
                    <Col lg={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>House Number</Form.Label>
                        <Form.Control
                          name="houseNo"
                          onChange={handleChangeAddress}
                          value={newAddress.houseNo}
                        />
                        {!!errors.houseNo && (
                          <span className="text-danger">{errors.houseNo}</span>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
            <Card className="mt-3" id="address">
              <Card.Header>
                <Card.Title>File Upload</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <div className="col-12">
                    For verification purposes, please upload a photo of the
                    following:
                  </div>
                </Row>
                <div className="card m-2">
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img
                        src={imagePrevSupplier ? imagePrevSupplier : ""}
                        className="img-fluid rounded-start"
                        alt="Valid ID"
                        id="uploadedID"
                        width={"200px"}
                        height={"150px"}
                      />
                      <label
                        htmlFor="uploadedID"
                        className="btn input-f-primary"
                        tabIndex="0"
                        typeof="file"
                      >
                        <input
                          name="image"
                          accept="image/*"
                          type="file"
                          id="uploadedID"
                          className="account-file-input input-file-upload"
                          onChange={uservalidation}
                        />
                      </label>

                      <p className="text-mute mb-0">
                        <i>Allowed JPG, JPEG or PNG. Max size of 1MB</i>
                      </p>
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">Valid ID</h5>
                        <p className="card-text">
                          List of Acceptable Valid IDs : e-Card/UMID,
                          Employees's ID/Office ID, Driver's License, PRC ID,
                          Passport, SSS ID, Voter's ID/COMELEC Registration
                          Form, National ID, NBI Clearance, PWD ID, Barangay ID,
                          Pag-ibig ID, Philhealth ID, School ID
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <div className="mt-3 d-flex justify-content-end">
              <button
                disabled={isFormValid()}
                type="submit"
                className="btn btn-f-primary"
              >
                Submit
              </button>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default Profile;
