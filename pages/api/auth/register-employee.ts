import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export default async function registerEmployee(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const { employee_id, password, name, phone, role } = req.body;

    if (!employee_id || !password || !name || !phone || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingEmployee = await prisma.employee.findUnique({ where: { employee_id } });

        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = await prisma.employee.create({
            data: {
                employee_id,
                password: hashedPassword,
                name,
                phone_no: parseInt(phone, 10),
                role,
            },
        });

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT secret is not defined' });
        }

        const token = jwt.sign(
            { employeeId: employee.employee_id, name: employee.name, role: employee.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({ message: 'Employee registered successfully', token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error });
    } finally {
        await prisma.$disconnect();
    }
}
