import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_if_not_defined';

export const verifyToken:RequestHandler = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return ;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
        req.headers.email = decoded.email;
        return next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
        return;
    }
};
