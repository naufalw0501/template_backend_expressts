import { dbPool } from '../config/initdbMysql';

export const getUserByUsername = async (username: string) => {
  const connection = await dbPool.getConnection();
  try {
    const [rows]: any = await connection.query(
      'SELECT * FROM users WHERE username = :username',
      { username }
    );
    return rows[0]; // asumsi username unique
  } finally {
    connection.release();
  }
};
