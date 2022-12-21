import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faClose, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPersonMessage } from "../../redux/actions/message";
import { varibales } from "../../redux/constants/variables";
import { sendMessage } from "../../services/message";
import { getUserInfo } from "../../services/userInf";

const Messages = () => {
  const targetRef = useRef(null);
  const dispatch = useDispatch();
  const sender = getUserInfo() && getUserInfo().data;
  const [myMessage, setMyMessage] = useState("");
  const message = useSelector((state) => state.message);

  const handleSendMessage = () => {
    const data = {
      sender,
      receiver: { user_id: message.receiver },
      message: myMessage,
    };

    sendMessage(data).then((res) => {
      if (res.data && res.data.status === 1) {
        dispatch(
          getPersonMessage(
            sender.user_id,
            message.receiver,
            message.receiverDetails
          )
        );
        setMyMessage("");
      }
    });
  };

  const handleMessageClose = () => {
    dispatch({
      type: varibales.PERSONMESSAGE,
      payload: {
        show: false,
        data: [],
        receiver: null,
        receiverDetails: null,
      },
    });
  };

  const getSendDate = (data) => {
    const curDate = new Date();
    const date = data.split(" ");
    const date1 = new Date(date[0]);
    if (
      date1.getFullYear() === curDate.getFullYear() &&
      date1.getMonth() === curDate.getMonth() &&
      date1.getDate() === curDate.getDate()
    ) {
      return date[1];
    }

    return `${date1.getUTCFullYear()}/${date1.getMonth()}/${date1.getDate()}  ${
      date[1]
    }`;
  };

  const handleKeyDown = (event, data) => {
    if (event.key === "Enter" && myMessage === "") {
      return event.preventDefault();
    }

    if (event.key === "Enter" && myMessage !== "") {
      handleSendMessage();
    }
  };

  return (
    <div style={message.show ? { display: "block" } : { display: "none" }}>
      <div className="messenger-container">
        <div className="row d-flex justify-content-center">
          <div className="col-sm-8 w-100">
            <div className="card" id="chat2">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span className="mb-0 text-capitalize">
                  {message.receiverDetails && (
                    <>
                      {message.receiverDetails.firstName}&nbsp;&nbsp;&nbsp;
                      {message.receiverDetails.lastName}
                    </>
                  )}
                </span>
                <div>
                  <span className="me-3">
                    <FontAwesomeIcon icon={faGear} />
                  </span>
                  <span onClick={handleMessageClose}>
                    <FontAwesomeIcon icon={faClose} />
                  </span>
                </div>
              </div>
              <div
                className="card-body chat-wrapper"
                style={{
                  position: "relative",
                  height: "250px",
                  display: "flex",
                  flexDirection: "column-reverse",
                }}
              >
                {message.data && (
                  <>
                    {[...message.data].reverse().map((msg, idx) => (
                      <div key={idx}>
                        {msg.sender.user_id === getUserInfo().data.user_id ? (
                          <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                            <div>
                              <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                                {msg.message}
                              </p>
                              <p className="small me-3 mb-3 rounded-3 text-muted">
                                {getSendDate(msg.sendDate)}
                              </p>
                            </div>
                            <img
                              src={
                                msg.sender.profile
                                  ? require(`../../assets/uploads/${msg.sender.profile}`)
                                  : require("../../assets/uploads/empty.jpg")
                              }
                              alt="avatar 1"
                              className="rounded-circle"
                              style={{ width: "45px", height: "100%" }}
                            />
                          </div>
                        ) : (
                          <div className="d-flex flex-row justify-content-start">
                            <img
                              src={
                                msg.receiver.profile
                                  ? require(`../../assets/uploads/${msg.receiver.profile}`)
                                  : require("../../assets/uploads/empty.jpg")
                              }
                              alt="avatar 1"
                              style={{ width: "45px", height: "100%" }}
                              className="rounded-circle"
                            />
                            <div>
                              <p
                                className="small p-2 ms-3 mb-1 rounded-3"
                                style={{ backgroundColor: "#f5f6f7" }}
                              >
                                {msg.message}
                              </p>

                              <p className="small ms-3 mb-3 rounded-3 text-muted">
                                {getSendDate(msg.sendDate)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}

                <div ref={targetRef}></div>
              </div>
              <div className="card-footer text-muted d-flex justify-content-start align-items-center">
                <input
                  autoComplete="off"
                  type="text"
                  className="form-control form-control-xs"
                  id="exampleFormControlInput1"
                  placeholder="Type message"
                  value={myMessage}
                  onChange={(e) => setMyMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  disabled={myMessage === "" ? true : false}
                  className="ms-3 btn btn-info"
                  onClick={handleSendMessage}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
