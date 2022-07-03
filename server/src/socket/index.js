const { chat, user, profile } = require("../../models");

const jwt = require("jsonwebtoken");

const { Op } = require("sequelize");

const connectedUser = {};
const socketIo = (io) => {
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      next();
    } else {
      next(new Error("Not Authorized"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.id;

    connectedUser[userId] = socket.id;

    socket.on("load admin contact", async () => {
      try {
        const adminContact = await user.findOne({
          include: [
            {
              model: profile,
              as: "profile",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
          where: {
            status: "admin",
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        });

        socket.emit("admin contact", adminContact);
      } catch (err) {}
    });

    socket.on("load customer contacts", async () => {
      try {
        let customerContacts = await user.findAll({
          include: [
            {
              model: profile,
              as: "profile",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            {
              model: chat,
              as: "recipientMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
              },
            },
            {
              model: chat,
              as: "senderMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        });

        customerContacts = JSON.parse(JSON.stringify(customerContacts));
        customerContacts = customerContacts.map((item) => ({
          ...item,
          profile: {
            ...item.profile,
            image: item.profile?.image
              ? process.env.PATH_FILE + item.profile?.image
              : null,
          },
        }));

        socket.emit("customer contacts", customerContacts);
      } catch (err) {}
    });

    socket.on("load messages", async (payload) => {
      "load messages", payload;
      try {
        const token = socket.handshake.auth.token;

        const tokenKey = process.env.TOKEN_KEY;
        const verified = jwt.verify(token, tokenKey);

        const idRecipient = payload;
        const idSender = verified.id;

        const data = await chat.findAll({
          where: {
            idSender: {
              [Op.or]: [idRecipient, idSender],
            },
            idRecipient: {
              [Op.or]: [idRecipient, idSender],
            },
          },
          include: [
            {
              model: user,
              as: "recipient",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            },
            {
              model: user,
              as: "sender",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            },
          ],
          order: [["createdAt", "ASC"]],
          attributes: {
            exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
          },
        });

        socket.emit("messages", data);
      } catch (error) {}
    });

    socket.on("send message", async (payload) => {
      try {
        const token = socket.handshake.auth.token;

        const tokenKey = process.env.TOKEN_KEY;
        const verified = jwt.verify(token, tokenKey);

        const idSender = verified.id;
        const { message, idRecipient } = payload;

        await chat.create({
          message,
          idRecipient,
          idSender,
        });

        io.to(socket.id)
          .to(connectedUser[idRecipient])
          .emit("new message", idRecipient);
      } catch (error) {}
    });

    socket.on("disconnect", () => {
      delete connectedUser[userId];
    });
  });
};

module.exports = socketIo;
