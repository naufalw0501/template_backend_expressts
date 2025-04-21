import { Request, Response } from 'express';
import * as UserModel from '../models/userModel';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error('Error When Get Users:', err);
        res.status(500).json({ message: 'Error When Get Users', error: err });
    }
};

export const addUser = async (req: Request, res: Response) => {
    const { username } = req.body;
    if (!username) {
        res.status(400).json({ message: 'Username and Password Must Be Filled' });
        return
    }

    try {
        const userId = await UserModel.insertUser(username);
        res.status(201).json({ message: 'User Success Added', userId });
    } catch (err) {
        console.error('Error When Add User:', err);
        res.status(500).json({ message: 'Error When Add User', error: err });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id, username, password } = req.body;
    if (!id) {
        res.status(400).json({ message: 'ID Must Be Filled' })
        return
    };

    try {
        const affectedRows = await UserModel.updateUser(id, username, password);
        if (affectedRows === 0) {
            res.status(404).json({ message: 'User To Update Not Found' });
            return;
        }
        res.status(200).json({ message: 'User Success Updated', affectedRows });
    } catch (err) {
        console.error('Error When Update User:', err);
        res.status(500).json({ message: 'Error When Update User', error: err });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.body;
    if (!id) {
        res.status(400).json({ message: 'ID Must Be Filled' })
        return
    };

    try {
        const affectedRows = await UserModel.deleteUser(id);
        if (affectedRows === 0) {
            res.status(404).json({ message: 'User To Delete Not Found' });
            return;
        }
        res.status(200).json({ message: 'User Success Deleted', affectedRows });
    } catch (err) {
        console.error('Error When Delete User:', err);
        res.status(500).json({ message: 'Error When Delete User', error: err });
    }
};
