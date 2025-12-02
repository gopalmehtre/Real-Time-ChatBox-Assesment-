import UserModel from "../models/userModel.js";
import  createSecretToken  from "../utils/SecretToken.js";
import bcrypt from 'bcryptjs';

const Signup = async (req, res, next) => {
    const {email, password, username, createdAt} = req.body;

    if(!username || !password || !email) {
        return res.status(400).json({message: "Please provide the following information!"});
    }
    try {
        const existingUser = await UserModel.findOne({email});

        if(existingUser) {
            return res.json({message: "User already exists!"});
        }

        const user = await UserModel.create({email, password, username, createdAt});
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly : false,
        });
        res.status(201).json({
            message: "User signed in successfully", 
            success: true, 
            _id: user._id,        
            username: user.username,  
            email: user.email 
        });
        next();
    } catch (e) {
        res.json({message: `Something went wrong ${e}`});
    }
}

const Login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.json({message: "All fields are required"})
        }

        const user = await UserModel.findOne({email});
        if(!user) {
            return res.json({message: 'Incorrect password or email'});
        }

        const auth = await bcrypt.compare(password, user.password)
        if(!auth) {
            return res.json({message: 'Incorrect password or email'})
        }

        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({
            message: 'User logged in successfully', 
            success: true,
            _id: user._id,        
            username: user.username,  
            email: user.email 
        });
        next()

    } catch(err) {
        console.error(err);
    }
} 

export {Signup, Login};