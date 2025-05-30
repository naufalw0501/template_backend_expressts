import { Request, Response } from 'express';
import * as ProductModel from '../models/productModel';
import { FormAddProductInterface, FormUpdateProductInterface } from '../interface/productInterface';
import { dbPool } from '../config/initdbMysql';
import path from 'path';
import fs from 'fs';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await ProductModel.getAllProducts();
        res.json({ message: "Get Data Success", status: 200, data: products });
    } catch (err) {
        console.error('Error When Get Products:', err);
        res.status(500).json({ message: 'Error When Get Products', status: 500, error: err });
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const products = await ProductModel.getAllCategories();
        res.json({ message: "Get Data Success", status: 200, data: products });
    } catch (err) {
        console.error('Error When Get Categories:', err);
        res.status(500).json({ message: 'Error When Get Categories', status: 500, error: err });
    }
};

export const addProduct = async (req: Request, res: Response) => {
    const {
        product_name, description, lowest_price, id_category,
        highest_price, size, notes, link_shopee, link_tokopedia
    } = req.body;

    if (req.file == null) {
        console.error('File Must Be Uploaded:');
        res.status(500).json({ message: 'File Must Be Uploaded', status: 500 });
        return
    }

    const image_file = req.file.filename;

    const product_detail: FormAddProductInterface = {
        product_name, description, lowest_price: Number(lowest_price), id_category: Number(id_category),
        highest_price: Number(highest_price), size, notes, link_shopee, link_tokopedia, image_file
    };

    if (!product_name || !description || !lowest_price || !id_category ||
        !highest_price || !size || !notes || !link_shopee || !link_tokopedia || !image_file) {
        res.status(400).json({ message: 'All Form Must Be Filled' });
        return;
    }

    try {
        const productId = await ProductModel.insertProduct(product_detail);
        res.status(201).json({ message: 'Product Success Added', status: 201, productId });
    } catch (err) {
        console.error('Error When Add Product:', err);
        res.status(500).json({ message: 'Error When Add Product', status: 500, error: err });
    }
};


export const updateProduct = async (req: Request, res: Response) => {
    const {
        id, product_name, description, lowest_price, id_category,
        highest_price, size, notes, link_shopee, link_tokopedia
    } = req.body;

    const image_file = req.file ? req.file.filename : undefined;

    const product_detail: FormUpdateProductInterface = {
        id: Number(id),
        product_name, description, lowest_price: Number(lowest_price), id_category: Number(id_category),
        highest_price: Number(highest_price), size, notes, link_shopee, link_tokopedia,
        image_file
    };

    if (!product_detail.id) {
        res.status(400).json({ message: 'ID Must Be Filled', status: 400 });
        return;
    }

    try {
        const connection = await dbPool.getConnection();
        const [rows]: any = await connection.query('SELECT image_file FROM products WHERE id = ?', [product_detail.id]);
        connection.release();

        const oldImageFile = rows?.[0]?.image_file;

        if (req.file && oldImageFile) {
            const oldImagePath = path.join(__dirname, '../uploads/products', oldImageFile);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const affectedRows = await ProductModel.updateProduct(product_detail);
        if (affectedRows === 0) {
            res.status(404).json({ message: 'Product To Update Not Found', status: 404 });
            return;
        }

        res.status(200).json({ message: 'Product Success Updated', status: 200, affectedRows });
    } catch (err) {
        console.error('Error When Update Product:', err);
        res.status(500).json({ message: 'Error When Update Product', status: 500, error: err });
    }
};


export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.body;
    if (!id) {
        res.status(400).json({ message: 'ID Must Be Filled', status: 400 })
        return
    };

    try {
        const affectedRows = await ProductModel.deleteProduct(id);
        if (affectedRows === 0) {
            res.status(404).json({ message: 'Product To Delete Not Found', status: 404 });
            return;
        }
        res.status(200).json({ message: 'Product Success Deleted', status: 200, affectedRows });
    } catch (err) {
        console.error('Error When Delete Product:', err);
        res.status(500).json({ message: 'Error When Delete Product', status: 500, error: err });
    }
};
