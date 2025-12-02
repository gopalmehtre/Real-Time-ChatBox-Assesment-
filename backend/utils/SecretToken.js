import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const createSecretToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

export default createSecretToken;