import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateToken } from './authentication';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const user = (req as any).user;
    res.status(200).json({ authenticated: true, userId: user.userId, name: user.name });
};

export default authenticateToken(handler);
