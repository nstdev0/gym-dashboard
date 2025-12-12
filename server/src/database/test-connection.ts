// import { db } from "./db";

// export const testConnection = async () => {
//   try {
//     const connection = await db.getConnection();
//     console.log('✅ Conexión exitosa a la base de datos')

//     // Prueba real: Ejecutar consulta simple
//     await connection.query('SELECT 1')
//     connection.release();

//     return "Conexión exitosa a la base de datos"

//   } catch (error) {
//     console.error('❌ Error de conexión:', error)
//     if (error instanceof Error) {
//         throw new Error(error.message);
//     }
//     throw error;
//   }
// }
