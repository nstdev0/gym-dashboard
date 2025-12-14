// import { NextFunction, Request, Response } from "express";

// import { NextFunction, Request, Response } from "express";

// export function middleWare(req: Request, res: Response, next: NextFunction) {
//     console.log("[MiddleWare]: Middleware called", `${req.method} | ${req.baseUrl} | ${req.params.length > 0 ? req.params :  "No params"}`)
//     next()
// }

// MOCK AUTHENTICATION
// export function auth(req: Request, res: Response, next: NextFunction) {
//     const user = req.headers.user === "nst";
//     const password = req.headers.password === "123";

//     if (!user || !password) {
//         return res.status(401).json({
//             success: false,
//             message: "Unauthorized",
//         })
//     }
    
//     next()
// }


import jwt from 'jsonwebtoken';
import { config } from "dotenv"; // Asegura cargar las variables de entorno
import { NextFunction, Request, Response } from 'express';

config();

// Obtener la clave secreta
const SECRET_KEY: string = process.env.SECRET_KEY || "";

if (!SECRET_KEY) {
    throw new Error("SECRET_KEY no está definido en las variables de entorno.");
}

/**
 * Genera un JWT para un usuario.
 * @param {object} payload - Los datos a incluir en el token (ej. { id: 1, email: 'user@ejemplo.com' })
 * @returns {string} El token JWT generado.
 */
export function generateToken(payload: string | object | Buffer<ArrayBufferLike>) {
    // Opciones:
    // 1. Payload: El objeto con los datos del usuario.
    // 2. Secret: La clave secreta.
    // 3. Options: Opciones de expiración (exp: '1h'), algoritmo, etc.
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

/**
 * Middleware para verificar la validez de un JWT en el header de la solicitud.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
export function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    // 1. Obtener el token del header (Bearer Token)
    const authHeader = req.headers.authorization;
    
    // El formato esperado es: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            message: 'Acceso denegado. No se proporcionó el token o el formato es incorrecto.' 
        });
    }

    const token = authHeader.split(' ')[1]; // Obtener solo la parte del token

    try {
        // 2. Verificar el token usando la clave secreta
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // 3. Adjuntar el payload decodificado al objeto de solicitud (req.user)
        // Esto hace que la información del usuario esté disponible en las rutas protegidas.
        req.user = decoded; 
        
        // 4. Continuar al siguiente middleware o ruta
        next();
    } catch (error) {
        // Si la verificación falla (token inválido o expirado)
        console.error('JWT Verification Error:', error.message);
        return res.status(401).json({ 
            message: 'Token inválido o expirado. Acceso no autorizado.' 
        });
    }
}