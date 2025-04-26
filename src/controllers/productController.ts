import { Request, Response } from 'express';
import * as ProductModel from '../models/productModel'; 
import { FormAddProductInterface, FormUpdateProductInterface } from '../inteface/productInterface';

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
    const { product_name, description, lowest_price, id_category,
        highest_price, size, notes, link_shopee, link_tokopedia, image_file
     } = req.body; 
    
    const product_detail : FormAddProductInterface = { product_name, description, lowest_price, id_category,
        highest_price, size, notes, link_shopee, link_tokopedia, 
        image_file
     }

    if (!product_detail.product_name || !product_detail.description || !product_detail.lowest_price || !product_detail.id_category ||
        !product_detail.highest_price || !product_detail.size || !product_detail.notes || !product_detail.link_shopee || !product_detail.link_tokopedia || 
        !product_detail.image_file || !product_detail) {
        res.status(400).json({ message: 'Username & Role Must Be Filled' });
        return
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
    const { id, product_name, description, lowest_price, id_category,
        highest_price, size, notes, link_shopee, link_tokopedia, image_file
     } = req.body; 

     const product_detail : FormUpdateProductInterface = { id, product_name, description, lowest_price, id_category,
        highest_price, size, notes, link_shopee, link_tokopedia, 
        image_file
     }

    if (!product_detail.id) {
        res.status(400).json({ message: 'ID Must Be Filled', status: 400, })
        return
    };

    try {
        const affectedRows = await ProductModel.updateProduct(product_detail);
        if (affectedRows === 0) {
            res.status(404).json({ message: 'Product To Update Not Found', status: 404, });
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
