import { dbPool } from '../config/initdbMysql';
import { FieldPacket, ResultSetHeader } from 'mysql2/promise';

export const getUserByUsername = async (username: string) => {
  const connection = await dbPool.getConnection();
  try {
    const [rows] : any = await connection.query(
      `SELECT u.id, u.username, r.role_name
          FROM users as u
          LEFT JOIN roles as r
          ON u.id_role = r.id
       WHERE username = ?`,
      [username]
    );
    return rows[0]; // username must unique
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
    const [rows] = await connection.query(`
      SELECT u.id, u.username, r.role_name
          FROM users as u
          LEFT JOIN roles as r
          ON u.id_role = r.id  WHERE u.id = :id; `,
      { id });
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