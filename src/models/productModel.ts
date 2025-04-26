import { dbPool } from '../config/initdbMysql';
import { FieldPacket, ResultSetHeader } from 'mysql2/promise';
import { FormAddProductInterface, FormUpdateProductInterface } from '../inteface/productInterface';


export const getAllProducts = async () => {
  const connection = await dbPool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT p.id, p.product_name, p.description, p.lowest_price, p.highest_price , p.size, p.notes,
          p.link_shopee, p.link_tokopedia, p.created_at, p.updated_at, p.image_file, c.category_name
      FROM products as p
      LEFT JOIN product_categories as c
      ON p.id_category = c.id;
      `);
    return rows;
  } finally {
    connection.release();
  }
};

export const getAllCategories = async () => {
  const connection = await dbPool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT id, category_name from product_categories`);
    return rows;
  } finally {
    connection.release();
  }
};

export const insertProduct = async (product_detail: FormAddProductInterface) => {
  const connection = await dbPool.getConnection();
  try {
    const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(
      `INSERT INTO products (product_name, description, lowest_price, id_category,
        highest_price, size, notes, link_shopee, link_tokopedia, image_file  ) 
       VALUES (:product_name, :description, :lowest_price, :id_category,
        :highest_price, :size, :notes, :link_shopee, :link_tokopedia, :image_file  )`,
      product_detail
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

export const updateProduct = async (product_detail: FormUpdateProductInterface) => {
  const connection = await dbPool.getConnection();
  try {
    let query = 'UPDATE products SET ';
    const params: any = {};
    let setClauses: string[] = []; 
    const updatableFields = [
      'product_name', 'description', 'id_category', 'lowest_price',
      'highest_price', 'size', 'notes', 'link_shopee', 'link_tokopedia', 'image_file'
    ]; 
    for (const field of updatableFields) {
      const value = (product_detail as any)[field];
      if (value !== undefined) {
        setClauses.push(`${field} = :${field}`);
        params[field] = value;
      }
    } 
    if (setClauses.length === 0) {
      throw new Error('No fields provided to update');
    } 
    query += setClauses.join(', ');
    query += ' WHERE id = :id';
    params.id = product_detail.id; 
    const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(query, params);
    return result.affectedRows;
  } finally {
    connection.release();
  }
};


export const deleteProduct = async (id: number) => {
  const connection = await dbPool.getConnection();
  try {
    const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(
      'DELETE FROM products WHERE id = :id',
      { id }
    );
    return result.affectedRows;
  } finally {
    connection.release();
  }
};

