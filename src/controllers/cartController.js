const userModel = require("../models/userModel");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

const {
  isValid,
  isValidRequestBody,
  isValidObjectId,
} = require("../util/validator"); // isValidObjectId,

//-------------------------------------------------------------------------
//              1. API - POST /users/:userId/cart (Add to cart)
//-------------------------------------------------------------------------

const addToCart = async (req, res) => {
  //Authentication Required.  !!!!
  // 302. Make sure the userId in params and in JWT token match.
  try {
    console.log("Add To Cart");

    const userIdParams = req.params.userId.trim();

    if (!isValidObjectId(userIdParams)) {
      return res.status(400).send({
        status: false,
        message: `userId in Params: <${userIdParams}> NOT a Valid Mongoose Object ID.`,
      });
    }

    // !!!!!!!!!!- Make sure the userId in params and in JWT token match.

    //- Make sure the user exist.
    const findUser = await userModel.findById(userIdParams);

    console.log("User: " + findUser); //------

    if (!findUser) {
      return res.status(404).send({
        status: false,
        message: `USER with ID: <${userIdParams}> NOT Found in Database.`,
      });
    }

    if (!isValidRequestBody(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Request Body Empty." });
    }

    //- Get cart id in request body.
    //- Get productId in request body.
    let { cartId, productId } = req.body;

    // Cart ID. -> NOT MAndatory????????????
    let findCart;

    if (cartId) {
      if (!isValid(cartId)) {
        return res
          .status(400)
          .send({ status: false, message: "<cartId> is required." });
      }

      if (!isValidObjectId(cartId)) {
        return res.status(400).send({
          status: false,
          message: `cartId: <${cartId}> NOT a Valid Mongoose Object ID.`,
        });
      }
      //- Make sure that cart exist.
      //   findCart = await cartModel.findOne({ _id: cartId, userId: userIdParams });
      findCart = await cartModel.findOne({ _id: cartId });
      if (!findCart) {
        return res.status(404).send({
          status: false,
          message: `CART with ID: <${cartId}> NOT Found in Database.`,
        });
      }
    }
    // IF cartId NOT in REquest-Body.
    else {
      findCart = await cartModel.findOne({ userId: userIdParams });
      if (findCart) {
        cartId = findCart._id;
      }
      if (!findCart) {
        console.log("LINE - 98");
        // return res.status(404).send({
        //   status: false,
        //   message: `CART having userId: <${userIdParams}> NOT Found in Database.`,
        // });
      }
    }

    console.log("CART: " + findCart); //------

    // Product ID.
    if (!isValid(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "<productId> is required." });
    }
    if (!isValidObjectId(productId)) {
      // postman- Number -> ERROR!!!!!!!!!
      return res.status(400).send({
        status: false,
        message: `productId: <${productId}> NOT a Valid Mongoose Object ID.`,
      });
    }
    //- Make sure the product(s) are valid and not deleted.??????
    const findProduct = await productModel.findById(productId);
    if (!findProduct) {
      return res.status(404).send({
        status: false,
        message: `PRODUCT with ID: <${productId}> NOT Found in Database.`,
      });
    }

    //- Add a product(s) for a user in the cart.
    if (findCart) {
      // IF <productId> already in Cart.
      const isProductAlready = findCart.items.filter(
        (x) => x.productId.toString() === productId
      );

      console.log(isProductAlready);
      console.log(typeof isProductAlready);

      if (isProductAlready.length > 0) {
        // Update Product in Cart.
        const addProduct = await cartModel.findOneAndUpdate(
          {
            "items.productId": productId,
          },
          {
            $inc: {
              "items.$.quantity": 1,
              totalPrice: findProduct.price,
              totalItems: 1,
            },
          },
          { new: true }
        );

        return res.status(200).send({
          status: true,
          message: "Added product in cart successfully.",
          data: addProduct,
        });
      }

      // ELSE. -> Create Product in Cart.
      console.log(cartId);
      console.log(typeof cartId);

      const createProduct = await cartModel.findOneAndUpdate(
        { _id: cartId },
        {
          $push: { items: { productId: productId, quantity: 1 } },
          $inc: { totalItems: 1, totalPrice: findProduct.price },
        },
        { new: true }
      );

      return res.status(200).send({
        // 201 ???????????
        status: true,
        message: "Created product in cart successfully.",
        data: createProduct,
      });
    }

    //- Create a cart for the user if it does not exist. Else add product<(s)> in cart.

    console.log("create Cart");
    const cart = {
      userId: userIdParams,
      items: [{ productId: productId, quantity: 1 }],
      totalItems: 1,
      totalPrice: findProduct.price,
    };

    const createCart = await cartModel.create(cart);

    //- Get product(s) details in response body. !!!!!!!!!!!
    return res.status(201).send({
      status: true,
      message: "User Cart Created Successfully.",
      data: createCart,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//-------------------------------------------------------------------------
//              3. API - GET /users/:userId/cart
//-------------------------------------------------------------------------

const getUsersCart = async (req, res) => {
  // Returns cart summary of the user.
  try {
    console.log("Get User's Cart");

    const userIdParams = req.params.userId.trim();

    if (!isValidObjectId(userIdParams)) {
      return res.status(400).send({
        status: false,
        message: `userId in Params: <${userIdParams}> NOT a Valid Mongoose Object ID.`,
      });
    }

    // - Make sure the userId in params and in JWT token match.

    // - Make sure the user exist.
    const findUser = await userModel.findById(userIdParams); // isDeleted: false -> Check ????

    if (!findUser) {
      return res.status(404).send({
        status: false,
        message: `USER with ID: <${userIdParams}> NOT Found in Database.`,
      });
    }

    // Make sure that cart exist.
    findCart = await cartModel
      .findOne({
        userId: userIdParams,
      })
      .populate("items.productId"); //Populate or Not???

    if (!findCart) {
      return res.status(404).send({
        status: false,
        message: `CART with userID: <${userIdParams}> NOT Found in Database.`,
      });
    }

    // - Get product(s) details in response body.   !!!!!!!!!!
    return res.status(200).send({
      status: true,
      message: "User's Cart details.",
      data: findCart,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  addToCart,
  getUsersCart,
};
