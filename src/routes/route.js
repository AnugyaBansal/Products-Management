const express = require("express");
const router = express.Router();

// User Functions.
const {
  createUser,
  getUserById,
  updateUserById,
  login,
} = require("../controllers/userController");

<<<<<<< HEAD
//Product Functions.
const {
  createProducts,
  updateProductById,
  deleteProductById,
  getProductByFilter,
} = require("../controllers/productController");

//Cart Functions.
const { addToCart, getUsersCart } = require("../controllers/cartController");

//Middleware Functions.
const { authentication, authorization } = require("../middleware/auth");

// User APIs.
router.post("/register", createUser);

router.post("/login", login);
=======
// FEATURE I - User 
// User API
router.post("/register",userController.createUser)
router.post("/login",userController.login)
router.get("/user/:userId/profile", auth.userAuth, userController.getUserById);
router.put("/user/:userId/profile",auth.userAuth,userController.UpdateUser)

// FEATURE II - Product 
// Product API
router.post("/products",productController.createProducts)
router.get("/products", productController.getProductByFilter);
router.put("/products/:productId", productController.updateProductById);
router.delete("/products/:productId", productController.deleteProductById);
>>>>>>> e2760c1798b32bca92757feda7d3b37a192c9ef1

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
router.put("/products/:productId", updateProductById);
router.delete("/products/:productId", deleteProductById);

// Cart APIs.
router.post("/users/:userId/cart", authentication, authorization, addToCart);

router.get("/users/:userId/cart", authentication, authorization, getUsersCart);

//----------------If api is invalid OR wrong URL-------------------------
router.all("/**", function (req, res) {
  res
    .status(404)
    .send({ status: false, msg: "Requested API is not available" });
});

module.exports = router;
