const { cart, user, product, profile } = require("../../models");

exports.getCarts = async (req, res) => {
  try {
    let data = await cart.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: product,
          as: "product",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "idUser",
              "qty",
              "price",
              "desc",
            ],
          },
        },
        {
          model: user,
          as: "cartBuyer",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "status"],
          },
        },
        {
          model: user,
          as: "cartSeller",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "status"],
          },
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        product: {
          ...item.product,
          image: process.env.PATH_FILE + item.product.image,
        },
      };
    });

    res.send({
      status: "success...",
      data,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await cart.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success...",
      data,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.addCart = async (req, res) => {
  try {
    // Insert data to transaction table
    const newCart = await cart.create(req.body)({
      include: {
        model: user,
        as: "buyerCarts",
        attributes: {
          exclude: ["createdAt", "updatedAt", "idUser"],
        },
      },
      where: {
        id: newCart.idBuyer,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    res.send({
      status: "sucess",
      product: {
        id: newCart.idProduct,
      },
    });
  } catch (error) {
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const newCart = await cart.update(req.body, {
      where: {
        id,
      },
    });

    res.send({
      status: "success...",
      data: {
        id: newCart.id,
        name: newCart.name,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { id } = req.params;

    await cart.destroy({
      where: {
        id,
      },
    });

    await productCart.destroy({
      where: {
        idCart: id,
      },
    });

    res.send({
      status: "success",
      message: `Delete cart id: ${id} finished`,
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
