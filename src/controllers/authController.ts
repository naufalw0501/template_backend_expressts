import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByUsername } from '../models/authModel';
import { getUserById, updateUserPassword } from '../models/userModel'

const JWT_SECRET = process.env.JWT_SECRET || 'wesfedsrgh4e5ywerfs';

export const loginController = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ message: 'Username and Password Required' })
        return
    };

    try {
        const user = await getUserByUsername(username);
        if (!user) {
            res.status(401).json({ message: 'Invalid Credentials : Wrong Username' })
            return
        };

        if (user.password == null) {
            if (password != '1234') {
                res.status(401).json({ message: 'Invalid Credentials : Wrong Password' })
                return
            }
        } else {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                res.status(401).json({ message: 'Invalid Credentials : Wrong Password' })
                return
            };
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: Number(process.env.JWT_EXP_LOGIN) || 3600 }
        );

        res.json({ token, user: user.username });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const refreshToken = (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token Required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as JwtPayload;

        const currentTime = Math.floor(Date.now() / 1000); // in seconds
        if (decoded.exp && decoded.exp > currentTime) {
            const newToken = jwt.sign(
                { id: decoded.id, username: decoded.username },
                JWT_SECRET,
                { expiresIn: Number(process.env.JWT_EXP_REFRESH) || 3600 }
            );

            res.json({
                message: 'Token Refreshed',
                token: newToken,
                username: decoded.username,
                userId: decoded.id
            });
        } else {
            res.status(401).json({ message: 'Token Expired, please login again' });
        }
    } catch (err) {
        console.error('Refresh Token Error:', err);
        res.status(403).json({ message: 'Invalid Token' });
    }
};


export const changePassword = async (req: Request, res: Response) => {
    const userId = (req as any).user.id; // user.id dari token JWT
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
        res.status(400).json({ message: 'Old and new password are required' });
        return
    }

    try {
        const user = await getUserById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        };

        if (user.password == null) {
            if (old_password != '1234') {
                res.status(401).json({ message: 'Invalid Credentials : Wrong Password' })
                return
            }
        } else {
            const passwordMatch = await bcrypt.compare(old_password, user.password);
            if (!passwordMatch) {
                res.status(401).json({ message: 'Invalid Credentials : Wrong Password' })
                return
            };
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);
        await updateUserPassword(userId, hashedPassword);

        res.status(200).json({ message: 'Password successfully updated' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ message: 'Error changing password', error: err });
    }
};
