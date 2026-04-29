
const userAuthModel = require('../models/userAuthModel');
const bcrypt = require('bcrypt');
const { tokenGenrator } = require('../utils/tokenGenrator')
const jwt = require('jsonwebtoken');




const RegisterUser = async (req, res) => {


    try {
        const { name, email, password, age, gender } = req.body;

        // if any thing missing please provide all the fields
        if (!name || !email || !password || !age || !gender) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        // check if user already exists
        const user = await userAuthModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Error in hashing password"
                    })
                }

                const user = await userAuthModel.create({
                    name,
                    email,
                    password: hash,
                    age,
                    gender
                })

                // token genrator
                res.cookie("token", tokenGenrator(user._id), {
                    httpOnly: true,
                    secure: false,       // Local pe HTTP hai, HTTPS nahi — isliye false
                    sameSite: 'lax',     // Cross-origin cookie allow karta hai
                    maxAge: 1000 * 60 * 60 * 24 * 7
                })

                return res.status(200).json({
                    message: "User registered successfully",
                    success: true,

                })
            })
        })

    } catch (error) {
        // console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })

    }
}




const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // if any thing missing please provide all the fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the fields"
            })
        }

        const user = await userAuthModel.findOne({ email }).select(" -createdAt -updatedAt -__v");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password or email"
            })
        }

        const token = tokenGenrator(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,       // Local pe HTTP hai — secure:true sirf HTTPS pe kaam karta hai
            sameSite: 'lax',     // 'strict' cross-origin block karta tha (5173 → 3000)
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        res.status(200).json({
            message: "Login successful sir",
            success: true,
            data: user.data
        })


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            message: "Logout successful",
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

const getCurrentUser = async (req, res) => {
    try {
        // 1. Check if the middleware actually provided a user
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token or jwt expired"
            });
        }

        const user = await userAuthModel.findById(req.user.id)
            .select("-password -createdAt -updatedAt -email -__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User fetched successfully",
            success: true,
            user
        });

    } catch (error) {
        // 2. Log the actual error to your terminal for debugging
        console.error("Get Current User Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = { LoginUser, RegisterUser, logoutUser, getCurrentUser }