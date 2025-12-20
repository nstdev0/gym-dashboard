import jwt from 'jsonwebtoken';
import { config } from "dotenv";
import { NextFunction, Request, Response } from 'express';
import { User } from '../../domain/entities/user';

config();

const SECRET_KEY: string = process.env.SECRET_KEY || "";

if (!SECRET_KEY) {
    throw new Error("SECRET_KEY no está definido en las variables de entorno.");
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export function generateToken(payload: string | object | Buffer<ArrayBufferLike>) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

export function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            message: 'Acceso denegado. No se proporcionó el token o el formato es incorrecto.' 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded as User;
        next();
    } catch (error: any) {
        console.error('JWT Verification Error:', error.message);
        return res.status(401).json({ 
            message: 'Token inválido o expirado. Acceso no autorizado.' 
        });
    }
}