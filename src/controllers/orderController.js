const userModel = require("../models/userModel");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

const {
  isValid,
  isValidRequestBody,
  isValidObjectId,
} = require("../util/validator"); // isValidObjectId,

//-------------------------------------------------------------------------
//              1. API - POST /users/:userId/orders
//-------------------------------------------------------------------------

const createOrder = async (req, res) => {
  //- Create an order for the user
  //- Make sure the userId in params and in JWT token match.
  //- Make sure the user exist
  //- Get cart details in the request body
  //- **On success** - Return HTTP status 200. Also return the order document.
  //- **On error** - Return a suitable error message with a valid HTTP status code.
  try {
    console.log("Create Order");

    const userIdParams = req.params.userId.trim();

    if (!isValidObjectId(userIdParams)) {
      return res.status(400).send({
        status: false,
        message: `userId in Params: <${userIdParams}> NOT a Valid Mongoose Object ID.`,
      });
    }

    if (!isValidRequestBody(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Request Body Empty." });
    }

    //- Make sure the user exist.
    const findUser = await userModel.findById(userIdParams);
    if (!findUser) {
      return res.status(404).send({
        status: false,
        message: `USER with ID: <${userIdParams}> NOT Found in Database.`,
      });
    }

  //- **On success** - Return HTTP status 200. Also return the order document.
    return res.status(200).send({
      status: true,
      message: "Order Placed Successfully.",
      data: "placeOrder",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//-------------------------------------------------------------------------
//              2. API - PUT /users/:userId/orders
//-------------------------------------------------------------------------

const updateOrder = async (req, res) => {
  try {
    console.log("Update Order");

    return res.status(201).send({
      status: true,
      message: "Order Updated Successfully.",
      data: "updatedOrder",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  updateOrder,
};
