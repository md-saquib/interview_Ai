const express = require("express");
const router = express.Router();
const { isLogin } = require('../middlewares/isLogin');

const { RegisterUser, LoginUser, logoutUser, getCurrentUser } = require('../controllers/userAuthController')


router.post('/RegisterUser', RegisterUser);
router.post('/LoginUser', LoginUser);
router.post('/logoutUser', logoutUser);
router.get('/getCurrentUser',isLogin, getCurrentUser);

module.exports = router;