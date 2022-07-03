import React from "react";

import default_profile from "../../assets/blank-profile.png";

export default function Chat({ contact, user, messages, sendMessage }) {
  return (
    <>
      {contact ? (
        <>
          <div
            id="chat-messages"
            style={{ height: "80vh" }}
            className="overflow-auto px-3 py-2 rounded rounded-5"
          >
            {messages.map((item, index) => (
              <div key={index}>
                <div
                  className={`d-flex py-1 ${
                    item.idSender === user.id
                      ? "justify-content-end"
                      : "justify-content-start"
                  }`}
                >
                  {item.idSender !== user.id && (
                    <img
                      src={contact.profile?.image || default_profile}
                      className="rounded-circle me-2 img-chat rounded rounded-5"
                      alt="bubble avatar"
                    />
                  )}
                  <div
                    className={
                      item.idSender === user.id ? "chat-me" : "chat-other"
                    }
                  >
                    {item.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: "6vh" }} className="px-3 rounded rounded-5">
            <input
              placeholder="Send Message"
              className="input-message px-4 rounded rounded-5"
              onKeyPress={sendMessage}
            />
          </div>
        </>
      ) : (
        <div
          style={{ height: "89.5vh" }}
          className="h4 d-flex justify-content-center align-items-center rounded rounded-5"
        >
          No Message
        </div>
      )}
    </>
  );
}
