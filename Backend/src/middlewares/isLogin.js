const jwt = require('jsonwebtoken');

const isLogin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized user, please login first"
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

module.exports = { isLogin }