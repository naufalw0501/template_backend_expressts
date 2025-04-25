import { dbPool } from '../config/initdbMysql';
import { FieldPacket, ResultSetHeader } from 'mysql2/promise';

export const getAllUsers = async () => {
  const connection = await dbPool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT u.id, u.username, r.role_name
          FROM users as u
          LEFT JOIN roles as r
          ON u.id_role = r.id;
      `);
    return rows;
  } finally {
    connection.release();
  }
};

export const getAllRoles = async () => {
  const connection = await dbPool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT id, role_name from roles`);
    return rows;
  } finally {
    connection.release();
  }
};

export const insertUser = async (username: string, id_role: number) => {
  const connection = await dbPool.getConnection();
  try {
    const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(
      'INSERT INTO users (username, id_role ) VALUES (:username, :id_role )',
      { username, id_role }
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

export const updateUser = async (id: number, username?: string, id_role?: number) => {
  const connection = await dbPool.getConnection();
  try {
    let query = 'UPDATE users SET ';
    const params: any = {};
    if (username !== undefined) {
      query += 'username = :username';
      params.username = username;
    }
    if (id_role !== undefined) {
      query += (params.username ? ', ' : '') + 'id_role = :id_role';
      params.id_role = id_role;
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

