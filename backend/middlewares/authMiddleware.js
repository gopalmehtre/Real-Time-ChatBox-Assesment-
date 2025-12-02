import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';
import dotenv from "dotenv";
dotenv.config();

const protect = (req, res, next) => {
    const token = req.cookies.token
    if(!token) {
        return res.status(401).json({status: false, message: "Unauthorized"});
    }

    jwt.verify(token, process.env.JWT_SECRET, async(err, data) => {
        if(err) {
            return res.status(401).json({status: false, message: "Invalid token"});
        }
        const user = await UserModel.findById(data.id);
        if(user) {
            req.user = user;
            next();

        } else {
             return res.status(401).json({status: false, message: "User not found"});
        }
    })
}

const checkAuthStatus = (req, res) => {
    const token = req.cookies.token;
    
    if(!token) {
        return res.json({status: false});
    }
    
    jwt.verify(token, process.env.JWT_SECRET, async(err, data) => {
        if(err) {
            console.log('Token verification error:', err);
            return res.json({status: false});
        }
        
        const user = await UserModel.findById(data.id).select('-password');
        
        if(user) {
            console.log('checkAuthStatus - Found user:', user._id);
            return res.json({
                status: true, 
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    onlineStatus: user.onlineStatus
                }
            });
        } else {
            return res.json({status: false});
        }
    });
}

export { protect, checkAuthStatus };