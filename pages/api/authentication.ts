import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    userId: string;
    iat: number;
    exp: number;
}

export function authenticateToken(handler: NextApiHandler) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access denied: No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
            (req as any).user = decoded;
            return handler(req, res);
        } catch (error) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
    };
}
