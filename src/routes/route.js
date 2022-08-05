const express = require('express');
const {updatedUser, userLogin,getProfile, register } = require('../controller/userController');
const {authentication,authorization}= require('../middleware/auth')
const {createProduct,newUpdate,getProduct, getProductById,deleteProduct}=require('../controller/productController')
const {createCart,updateCart,getCart,deleteCart}=require('../controller/cartController');
const {createOrder,updateOrder}=require('../controller/orderController')
const router = express.Router();

router.post('/register', register);

router.get('/user/:userId/profile', getProfile);

router.post('/login', userLogin);

router.put('/user/:userId/profile', updatedUser);

router.post('/products', createProduct);

router.get('/products',getProduct)

router.get('/products/:productId',getProductById);

router.put('/products/:productId', newUpdate);

router.delete('/products/:productId',deleteProduct);

router.post('/users/:userId/cart',createCart);

router.put('/users/:userId/cart',updateCart);

router.get('/users/:userId/cart',getCart);

router.delete('/users/:userId/cart',deleteCart);

router.post('/users/:userId/orders',createOrder);

router.put('/users/:userId/orders',updateOrder);









module.exports = router