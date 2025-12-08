import { prisma } from "./db";

export const testConnection = async () => {
  try {
    // Intentamos conectar explícitamente (opcional, pero útil para debug)
    await prisma.$connect()
    console.log('✅ Conexión exitosa a la base de datos')

    // Prueba real: Ejecutar consulta simple
    await prisma.$queryRaw`SELECT 1`
    
    return "Conexión exitosa a la base de datos"

  } catch (error) {
    console.error('❌ Error de conexión:', error)
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw error;
  }
}
