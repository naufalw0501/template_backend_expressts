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

export const insertUser = async (username: string) => {
  const connection = await dbPool.getConnection();
  try {
    const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(
      'INSERT INTO users (username ) VALUES (:username )',
      { username }
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

interface UserInterface {
  id: number;
  username: string;
  password: string;
}
export const getUserById = async (id: number): Promise<UserInterface | null> => {
  const connection = await dbPool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM users WHERE id = :id', { id });
    const userRows = rows as UserInterface[];
    return userRows.length > 0 ? userRows[0] : null;
  } finally {
    connection.release();
  }
};

export const updateUserPassword = async (id: number, newPassword: string) => {
  const connection = await dbPool.getConnection();
  try {
    const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(
      'UPDATE users SET password = :password WHERE id = :id',
      { password: newPassword, id }
    );
    return result.affectedRows;
  } finally {
    connection.release();
  }
};