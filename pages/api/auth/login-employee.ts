import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export default async function loginStaff(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { employee_id } = req.body;

    if (!employee_id) {
        return res.status(400).json({ message: 'Employee ID and password are required' });
    }

    try {
        const staff = await prisma.employee.findUnique({
            where: { employee_id },
        });

        if (!staff) {
            return res.status(401).json({ message: 'Invalid employee ID or password' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT secret is not defined' });
        }

        const token = jwt.sign(
            { staffId: staff.employee_id, staffName: staff.name, role: staff.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    }
}
