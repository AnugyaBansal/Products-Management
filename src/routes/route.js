const express = require("express");
const router = express.Router();

//Middleware Functions.
const { authentication, authorization } = require("../middleware/auth");

// User Functions.
const {
  createUser,
  getUserById,
  updateUserById,
  login,
} = require("../controllers/userController");

//Product Functions.
const {
  createProducts,
  updateProductById,
  deleteProductById,
  getProductByFilter,
  getProductbyId
} = require("../controllers/productController");

//Cart Functions.
const {
  addToCart,
  updateCart,
  getUsersCart,
  deleteUsersCart,
} = require("../controllers/cartController");

//Order Functions.
const { createOrder, updateOrder } = require("../controllers/orderController");

// User APIs.
router.post("/register", createUser);

router.post("/login", login);

router.get("/user/:userId/profile", authentication, getUserById);

router.put(
  "/user/:userId/profile",
  authentication,
  authorization,
  updateUserById
);

// Product APIs.
router.post("/products", createProducts);
router.get("/products", getProductByFilter);
router.get("/products", getProductbyId);
router.put("/products/:productId", updateProductById);
router.delete("/products/:productId", deleteProductById);

// Cart APIs.
router.post("/users/:userId/cart", authentication, authorization, addToCart);

router.put("/users/:userId/cart", authentication, authorization, updateCart);

router.get("/users/:userId/cart", authentication, authorization, getUsersCart);

router.delete(
  "/users/:userId/cart",
  authentication,
  authorization,
  deleteUsersCart
);

// Product APIs.
router.post(
  "/users/:userId/orders",
  authentication,
  authorization,
  createOrder
);

router.put("/users/:userId/orders", authentication, authorization, updateOrder);

//----------------If api is invalid OR wrong URL-------------------------
router.all("/**", function (req, res) {
  res
    .status(404)
    .send({ status: false, msg: "Requested API is not available" });
});

module.exports = router;
