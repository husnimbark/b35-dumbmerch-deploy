import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";

import NavbarAdmin from "../components/NavbarAdmin";

import Contact from "../components/complain/Contact";
import Chat from "../components/complain/Chat";

import { UserContext } from "../context/userContext";

import { io } from "socket.io-client";

let socket;
export default function ComplainAdmin() {
  const [contact, setContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);

  const title = "Complain admin";
  document.title = "DumbMerch | " + title;

  const [state] = useContext(UserContext);

  useEffect(() => {
    socket = io("http://localhost:4000", {
      auth: {
        token: localStorage.getItem("token"),
      },
      query: {
        id: state.user.id,
      },
    });

    socket.on("new message", () => {
      socket.emit("load messages", contact?.id);
    });

    loadContacts();
    loadMessages();

    return () => {
      socket.disconnect();
    };
  }, [messages]);

  const loadContacts = () => {
    socket.emit("load customer contacts");
    socket.on("customer contacts", (data) => {
      let dataContacts = data.filter(
        (item) =>
          item.status !== "admin" &&
          (item.recipientMessage.length > 0 || item.senderMessage.length > 0)
      );

      dataContacts = dataContacts.map((item) => ({
        ...item,
        message:
          item.senderMessage.length > 0
            ? item.senderMessage[item.senderMessage.length - 1].message
            : "Click here to start message",
      }));
      setContacts(dataContacts);
    });
  };

  const onClickContact = (data) => {
    setContact(data);
    socket.emit("load messages", data.id);
  };

  const loadMessages = (value) => {
    socket.on("messages", (data) => {
      if (data.length > 0) {
        const dataMessages = data.map((item) => ({
          idSender: item.sender.id,
          message: item.message,
        }));
        setMessages(dataMessages);
      }
      loadContacts();
      const chatMessagesElm = document.getElementById("chat-messages");
      chatMessagesElm.scrollTop = chatMessagesElm?.scrollHeight;
    });
  };

  const onSendMessage = (e) => {
    if (e.key === "Enter") {
      const data = {
        idRecipient: contact.id,
        message: e.target.value,
      };

      socket.emit("send message", data);
      e.target.value = "";
    }
  };

  return (
    <>
      <NavbarAdmin title={title} />
      <Container fluid style={{ height: "89.5vh" }}>
        <Row>
          <Col
            md={3}
            style={{ height: "89.5vh" }}
            className="px-3 border-end border-dark overflow-auto rounded rounded-5"
          >
            <Contact
              dataContact={contacts}
              clickContact={onClickContact}
              contact={contact}
            />
          </Col>
          <Col md={9} style={{ maxHeight: "89.5vh" }} className="px-0">
            <Chat
              contact={contact}
              messages={messages}
              user={state.user}
              sendMessage={onSendMessage}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}
