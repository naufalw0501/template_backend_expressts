import { dbPool } from '../config/initdbMysql';
import { FieldPacket, ResultSetHeader } from 'mysql2/promise';

export const getAllUsers = async () => {
  const connection = await dbPool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM users');
    return rows;
  } finally {
    connection.release();
  }
};

export const insertUser = async (username: string, password: string) => {
  const connection = await dbPool.getConnection();
  try {
    const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(
      'INSERT INTO users (username, password) VALUES (:username, :password)',
      { username, password }
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

export const updateUser = async (id: number, username?: string, password?: string) => {
  const connection = await dbPool.getConnection();
  try {
    let query = 'UPDATE users SET ';
    const params: any = {};
    if (username !== undefined) {
      query += 'username = :username';
      params.username = username;
    }
    if (password !== undefined) {
      query += (params.username ? ', ' : '') + 'password = :password';
      params.password = password;
    }
    query += ' WHERE id = :id';
    params.id = id;

    const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(query, params);
    return result.affectedRows;
  } finally {
    connection.release();
  }
};

export const deleteUser = async (id: number) => {
  const connection = await dbPool.getConnection();
  try {
    const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(
      'DELETE FROM users WHERE id = :id',
      { id }
    );
    return result.affectedRows;
  } finally {
    connection.release();
  }
};
