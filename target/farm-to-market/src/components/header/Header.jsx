import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faCalculator,
  faCartShopping,
  faDashboard,
  faHome,
  faLightbulb,
  faMessage,
  faRightFromBracket,
  faSearch,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "react-bootstrap/Dropdown";
import { getUserInfo } from "../../services/userInf";
import {
  getNotif,
  seenTip,
  seenNotifComplaint,
  seenAds,
} from "../../services/notif";
import { useState } from "react";
import TipModal from "../modals/TipModal";
import { useDispatch } from "react-redux";
import { tipModal } from "../../redux/actions/tipModal";
import { deleteTip } from "../../redux/actions/tip";
import { getNames, myMessages } from "../../services/message";
import { getPersonMessage } from "../../redux/actions/message";
import { Fragment } from "react";
import { varibales } from "../../redux/constants/variables";

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [notif, setNotif] = useState(null);
  const [tipModalContent, setTipModalContent] = useState(null);
  const [messageLength, setMessageLength] = useState(null);
  const [search, setSearch] = useState("");
  const userInfo = getUserInfo();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch({
      type: varibales.PERSONMESSAGE,
      payload: {
        show: false,
        data: [],
        receiver: null,
        receiverDetails: null,
      },
    });
    localStorage.removeItem("ftm");
    navigate("/");
  };
  const location = useLocation();

  useEffect(() => {
    setShowHeader(!location.pathname.includes("gcash"));
    if (getUserInfo()) {
      getNotif(getUserInfo().data.user_id).then((res) => {
        if (res.data && res.data.status === 1) {
          setNotif({ ...res.data });
          console.log(res.data);
          const unique = [
            ...new Set(
              res.data.messages.map((messages) => messages.sender.user_id)
            ),
          ];
          setMessageLength(unique.length);
        }
      });
    }
  }, []);

  const handleTipOnClick = (data, type) => {
    if (type === "complaint") {
      let content = {
        title: "Complaint " + data.referenceCode,
        content: data.reason,
        complaint_id: data.complaint_id,
      };
      seenNotifComplaint(data.complaint_id).then((res) => {
        if (res.data && res.data.status === 1) {
          dispatch(tipModal(true));
          setTipModalContent(content);
        }
      });
    } else if (type === "advertisement") {
      seenAds(data.advertisement_id).then((res) => {
        if (res.data && res.data.status === 1) {
          dispatch(tipModal(true));
          navigate("/advertisement/details/" + data.advertisement_id);
        }
      });
    } else {
      seenTip(data.tip_id).then((res) => {
        if (res.data && res.data.status === 1) {
          dispatch(tipModal(true));
          setTipModalContent(data);
        }
      });
    }
  };

  const handleDeleteTip = (id, data) => {
    dispatch(deleteTip(id, data));
  };

  const handleSearch = () => {
    navigate(`/search?key=${search}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && search === "") {
      event.preventDefault();
    }
  };

  //messages functions
  const [names, setNames] = useState(null);
  const [namesBackup, setNamesBackup] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleGetNames = (e) => {
    getNames().then((res) => {
      if (res.data) {
        setNamesBackup(res.data);
        setNames(res.data);
      }
    });
  };

  const handleFocusOut = (e) => {
    e.preventDefault();
    // setIsSearching(false);
  };

  const [searchContact, setSearchContact] = useState("");
  const hadleMessageSearchOnChange = (e) => {
    e.preventDefault();
    setIsSearching(true);
    var search = e.currentTarget.value;

    setSearchContact(e.currentTarget.value);

    if (search === "") {
      return setNames(namesBackup);
    }
    const result = namesBackup.filter(
      (name) =>
        (name.firstName.toLowerCase().includes(search.toLowerCase()) ||
          name.lastName.toLowerCase().includes(search.toLowerCase())) &&
        name.user_id !== userInfo.data.user_id
    );

    setNames(result);
  };

  const handleSelectPerson = (e, data) => {
    e.preventDefault();
    dispatch(getPersonMessage(userInfo.data.user_id, data.user_id, data));
    setIsSearching(false);
    setSearchContact("");
  };

  const [myMsgss, setMyMsgs] = useState(null);
  const [uniqueData, setUniqueData] = useState(null);
  const handleGetMyMessage = () => {
    myMessages(userInfo.data.user_id).then((res) => {
      if (res.data) {
        const unique = [
          ...new Set(res.data.map((messages) => messages.sender.user_id)),
        ];
        setMyMsgs(res.data);
        setUniqueData(unique);
      }
    });
  };

  const Sample = (data) => {
    const unique = myMsgss.filter((m) => m.sender.user_id === data);
    const isNotSeen = unique.filter((s) => !s.seen).length;
    const notSeentMessage = unique.filter((s) => !s.seen);

    return (
      <Dropdown.Item
        onClick={(e) => handleSelectPerson(e, unique[0].sender)}
        className={`${!!isNotSeen ? "is-not-seen-bg fw-bold" : ""} mb-2`}
      >
        <div className="d-flex">
          <img
            src={
              unique[0].sender.profile
                ? require(`../../assets/uploads/${unique[0].sender.profile}`)
                : require(`../../assets/uploads/empty.jpg`)
            }
            alt="profile"
            width="50"
            className="rounded-circle me-3"
          />
          <div>
            <div className="text-capitalize">
              {unique[0].sender.firstName} {unique[0].sender.lastName}
            </div>
            <div className={`${isNotSeen ? "fw-bold" : ""} text-capitalize`}>
              {notSeentMessage.length > 0
                ? notSeentMessage[0].message
                : unique[0].message}
            </div>
          </div>
        </div>
      </Dropdown.Item>
    );
  };

  return (
    <div className={showHeader ? "header-show" : "header-none"}>
      <nav className="navbar f-bg-primary navbar-expand-lg navbar-light">
        {tipModalContent && (
          <TipModal content={tipModalContent} onDelete={handleDeleteTip} />
        )}

        <div className="container">
          <div className="d-flex justify-content-between header-content-wrapper">
            <Link className="navbar-brand logo-wrapper" to="">
              <img
                className="logo"
                src={require("../../assets/logo/logo.png")}
              />
            </Link>
            <div className="mobile-header">
              <ul className="navbar-nav w-100">
                {userInfo && (
                  <>
                    <li className="d-flex justify-content-center align-items-center">
                      <Link className="badge" to="">
                        <FontAwesomeIcon
                          icon={faHome}
                          color="#30830c"
                          size="2x"
                        />
                      </Link>
                    </li>
                    <li className="d-flex justify-content-center align-items-center">
                      <Link className="badge" to="/cart">
                        <FontAwesomeIcon
                          icon={faCartShopping}
                          color="#30830c"
                          size="2x"
                        />
                        {notif && notif.cartSize > 0 && (
                          <span className="badge bg-danger">
                            {notif && notif.cartSize}
                          </span>
                        )}
                      </Link>
                    </li>
                    {notif && userInfo.data.role !== "admin" && (
                      <li className="d-flex justify-content-center align-items-center">
                        <Dropdown>
                          <Dropdown.Toggle className="header-profile notif-dropdown">
                            <Link className="badge">
                              <FontAwesomeIcon
                                icon={faBell}
                                color="#30830c"
                                size="2x"
                              />
                              {(notif && notif.complaintSize > 0) ||
                              notif.advertisementSize > 0 ? (
                                <span className="badge bg-danger">
                                  {notif.complaintSize +
                                    notif.advertisementSize}
                                </span>
                              ) : (
                                ""
                              )}
                            </Link>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {notif &&
                              notif.complaints.map((complaint, idx) => (
                                <Dropdown.Item
                                  className="notif-item"
                                  key={idx}
                                  onClick={() =>
                                    handleTipOnClick(complaint, "complaint")
                                  }
                                >
                                  <div
                                    className={`${
                                      !complaint.seen ? "fw-bold" : ""
                                    } notif-content`}
                                  >
                                    <div>
                                      Complaint {complaint.referenceCode}
                                    </div>
                                    <p>{complaint.reason}</p>
                                  </div>
                                </Dropdown.Item>
                              ))}
                            {notif &&
                              notif.advertisement.map((advertisement, idx) => (
                                <Dropdown.Item
                                  className="notif-item"
                                  key={idx}
                                  onClick={() =>
                                    handleTipOnClick(
                                      advertisement,
                                      "advertisement"
                                    )
                                  }
                                >
                                  <div
                                    className={`${
                                      !advertisement.seen ? "fw-bold" : ""
                                    } notif-content`}
                                  >
                                    <div>
                                      Advertisement{" "}
                                      {advertisement.advertisement_id}
                                    </div>
                                    <p>{advertisement.category}</p>
                                  </div>
                                </Dropdown.Item>
                              ))}
                          </Dropdown.Menu>
                          {/* <Dropdown.Menu>
                            {notif && (
                              <Dropdown.Item
                                className="notif-item"

                                onClick={() =>
                                  handleTipOnClick(
                                    advertisement,
                                    "advertisement"
                                  )
                                }
                              >
                                <div
                                  className={`${
                                    !advertisement.seen ? "fw-bold" : ""
                                  } notif-content`}
                                ></div>
                              </Dropdown.Item>
                            )}
                          </Dropdown.Menu> */}
                        </Dropdown>
                      </li>
                    )}
                    <li className=" justify-content-center align-items-center">
                      <Dropdown onToggle={handleGetMyMessage}>
                        <Dropdown.Toggle className="header-profile notif-dropdown">
                          <Link className="badge">
                            <FontAwesomeIcon
                              icon={faMessage}
                              color="#30830c"
                              size="2x"
                            />
                            {messageLength > 0 && (
                              <span className="badge bg-danger">
                                {messageLength}
                              </span>
                            )}
                          </Link>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {userInfo && (
                            <Dropdown.Header>
                              <div className="input-group rounded message-search">
                                <input
                                  value={searchContact}
                                  type="search"
                                  className="form-control rounded"
                                  placeholder="Search"
                                  aria-label="Search"
                                  aria-describedby="search-addon"
                                  onChange={hadleMessageSearchOnChange}
                                  onFocus={handleGetNames}
                                  onBlur={handleFocusOut}
                                />
                                <span
                                  className="input-group-text border-0"
                                  id="search-addon"
                                >
                                  <FontAwesomeIcon icon={faSearch} />
                                </span>
                              </div>
                            </Dropdown.Header>
                          )}

                          <Dropdown.Divider />
                          <div className="notif">
                            {isSearching ? (
                              <>
                                {names.map((name, idx) => (
                                  <Dropdown.Item
                                    key={idx}
                                    onClick={(e) => handleSelectPerson(e, name)}
                                  >
                                    <img
                                      src={
                                        name.profile
                                          ? require(`../../assets/uploads/${name.profile}`)
                                          : require(`../../assets/uploads/empty.jpg`)
                                      }
                                      alt="profile"
                                      width="50"
                                      className="rounded-circle me-3"
                                    />
                                    <span className="text-capitalize">
                                      {name.firstName} {name.lastName}
                                    </span>
                                  </Dropdown.Item>
                                ))}
                              </>
                            ) : (
                              uniqueData &&
                              uniqueData.map((data, idx) => (
                                <Fragment key={idx}>{Sample(data)}</Fragment>
                              ))
                            )}
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>

                    {notif && userInfo.data.role !== "admin" && (
                      <li>
                        <Dropdown>
                          <Dropdown.Toggle className="header-profile notif-dropdown">
                            <Link className="badge">
                              <FontAwesomeIcon
                                icon={faLightbulb}
                                size="2x"
                                color="#30830c"
                              />
                              {notif && notif.tipSize > 0 && (
                                <span className="badge bg-danger">
                                  {notif.tipSize}
                                </span>
                              )}
                            </Link>
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="notif">
                            {notif &&
                              notif.tips.map((tip, idx) => (
                                <Dropdown.Item
                                  className="notif-item"
                                  key={idx}
                                  onClick={() => handleTipOnClick(tip, "tip")}
                                >
                                  <div
                                    className={`${
                                      !tip.seen ? "fw-bold" : ""
                                    } notif-content`}
                                  >
                                    <div>{tip.title}</div>
                                    <p>{tip.content}</p>
                                  </div>
                                </Dropdown.Item>
                              ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
          <div className="collapse navbar-collapse" id="navbarNav">
            {userInfo && (
              <form
                className="d-flex w-100 align-self-center mt-2"
                action="/search"
              >
                <div className="input-group mb-3 ">
                  <input
                    name="key"
                    onKeyDown={handleKeyDown}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    className="form-control search-input"
                    placeholder="Search product"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                  />
                  <span
                    onClick={handleSearch}
                    className="input-group-text btn-f-primary"
                    id="basic-addon2"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                </div>
              </form>
            )}

            <ul className="navbar-nav w-100 justify-content-end">
              {!userInfo && (
                <>
                  <li className="nav-item nav-router-link">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item nav-router-link">
                    <Link className="nav-link" to="/register">
                      Register
                    </Link>
                  </li>
                </>
              )}
              {userInfo && (
                <>
                  <li className="hide-on-mobile justify-content-center align-items-center me-4 ">
                    <Link className="badge" to="/cart">
                      <FontAwesomeIcon
                        icon={faCartShopping}
                        color="#30830c"
                        size="2x"
                      />
                      {notif && notif.cartSize > 0 && (
                        <span className="badge bg-danger">
                          {notif && notif.cartSize}
                        </span>
                      )}
                    </Link>
                  </li>
                  {notif && userInfo.data.role !== "admin" && (
                    <li className="justify-content-center align-items-center hide-on-mobile">
                      <Dropdown>
                        <Dropdown.Toggle className="header-profile notif-dropdown">
                          <Link className="badge">
                            <FontAwesomeIcon
                              icon={faBell}
                              color="#30830c"
                              size="2x"
                            />
                            {(notif && notif.complaintSize > 0) ||
                            notif.advertisementSize > 0 ? (
                              <span className="badge bg-danger">
                                {notif.complaintSize + notif.advertisementSize}
                              </span>
                            ) : (
                              ""
                            )}
                          </Link>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {notif &&
                            notif.complaints.map((complaint, idx) => (
                              <Dropdown.Item
                                className="notif-item"
                                key={idx}
                                onClick={() =>
                                  handleTipOnClick(complaint, "complaint")
                                }
                              >
                                <div
                                  className={`${
                                    !complaint.seen ? "fw-bold" : ""
                                  } notif-content`}
                                >
                                  <div>Complaint {complaint.referenceCode}</div>
                                  <p>{complaint.reason}</p>
                                </div>
                              </Dropdown.Item>
                            ))}
                          {notif &&
                            notif.advertisement.map((advertisement, idx) => (
                              <Dropdown.Item
                                className="notif-item"
                                key={idx}
                                onClick={() =>
                                  handleTipOnClick(
                                    advertisement,
                                    "advertisement"
                                  )
                                }
                              >
                                <div
                                  className={`${
                                    !advertisement.seen ? "fw-bold" : ""
                                  } notif-content`}
                                >
                                  <div>
                                    Advertisement{" "}
                                    {advertisement.advertisement_id}
                                  </div>
                                  <p>{advertisement.category}</p>
                                </div>
                              </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                  )}

                  <li className=" justify-content-center align-items-center hide-on-mobile">
                    <Dropdown onToggle={handleGetMyMessage}>
                      <Dropdown.Toggle className="header-profile notif-dropdown">
                        <Link className="badge">
                          <FontAwesomeIcon
                            icon={faMessage}
                            color="#30830c"
                            size="2x"
                          />
                          {messageLength > 0 && (
                            <span className="badge bg-danger">
                              {messageLength}
                            </span>
                          )}
                        </Link>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Header>
                          <div className="input-group rounded message-search">
                            <input
                              value={searchContact}
                              type="search"
                              className="form-control rounded"
                              placeholder="Search"
                              aria-label="Search"
                              aria-describedby="search-addon"
                              onChange={hadleMessageSearchOnChange}
                              onFocus={handleGetNames}
                              onBlur={handleFocusOut}
                            />
                            <span
                              className="input-group-text border-0"
                              id="search-addon"
                            >
                              <FontAwesomeIcon icon={faSearch} />
                            </span>
                          </div>
                        </Dropdown.Header>
                        <Dropdown.Divider />
                        <div className="notif">
                          {isSearching ? (
                            <>
                              {names.map((name, idx) => (
                                <Dropdown.Item
                                  key={idx}
                                  onClick={(e) => handleSelectPerson(e, name)}
                                >
                                  <img
                                    src={
                                      name.profile
                                        ? require(`../../assets/uploads/${name.profile}`)
                                        : require(`../../assets/uploads/empty.jpg`)
                                    }
                                    alt="profile"
                                    width="50"
                                    className="rounded-circle me-3"
                                  />
                                  <span className="text-capitalize">
                                    {name.firstName} {name.lastName}
                                  </span>
                                </Dropdown.Item>
                              ))}
                            </>
                          ) : (
                            uniqueData &&
                            uniqueData.map((data, idx) => (
                              <Fragment key={idx}>{Sample(data)}</Fragment>
                            ))
                          )}
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>

                  {notif && userInfo.data.role !== "admin" && (
                    <li className="hide-on-mobile-1">
                      <Dropdown>
                        <Dropdown.Toggle className="header-profile notif-dropdown">
                          <Link className="badge">
                            <FontAwesomeIcon
                              icon={faLightbulb}
                              size="2x"
                              color="#30830c"
                            />
                            {notif && notif.tipSize > 0 && (
                              <span className="badge bg-danger">
                                {notif.tipSize}
                              </span>
                            )}
                          </Link>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="notif">
                          {notif &&
                            notif.tips.map((tip, idx) => (
                              <Dropdown.Item
                                className="notif-item"
                                key={idx}
                                onClick={() => handleTipOnClick(tip, "tip")}
                              >
                                <div
                                  className={`${
                                    !tip.seen ? "fw-bold" : ""
                                  } notif-content`}
                                >
                                  <div>{tip.title}</div>
                                  <p>{tip.content}</p>
                                </div>
                              </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                  )}
                  <li>
                    <Dropdown>
                      <Dropdown.Toggle
                        id="dropdown-basic"
                        className="header-profile"
                      >
                        {userInfo && userInfo.data.firstName.toUpperCase()}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="/dashboard">
                          <FontAwesomeIcon
                            icon={faDashboard}
                            className="f-text-color"
                          />
                          <span className="ms-2">Dashboard</span>
                        </Dropdown.Item>
                        <Dropdown.Item href="/profile">
                          <FontAwesomeIcon
                            icon={faUserCheck}
                            className="f-text-color"
                          />
                          <span className="ms-2">Profile</span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            dispatch({
                              type: varibales.CALCULATOR,
                              payload: true,
                            })
                          }
                        >
                          <FontAwesomeIcon
                            icon={faCalculator}
                            className="f-text-color"
                          />
                          <span className="ms-2">Calculator</span>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>
                          <FontAwesomeIcon
                            icon={faRightFromBracket}
                            className="f-text-color"
                          />
                          <span className="ms-2">Logout</span>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
