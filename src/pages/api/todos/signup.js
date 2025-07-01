import prisma from '@/utils/prismaClient'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import bcrypt from 'bcrypt'

const handler = async (req, res) => {
  switch (req.method) {
    case 'POST': {
      try {
        const { firstName, lastName, userName, email, password } = req.body

        if (
          !firstName?.trim() ||
          !lastName?.trim() ||
          !userName?.trim() ||
          !email?.trim() ||
          !password?.trim()
        ) {
          return res.status(422).json({ message: 'Data is not valid !!' })
        }

        // چک کردن وجود کاربر
        const existUser = await prisma.user.findFirst({
          where: {
            OR: [
              { userName: userName },
              { email: email }
            ]
          }
        })

        if (existUser) {
          return res.status(422).json({ message: 'User already exists' })
        }

        const hashPassword = await bcrypt.hash(password, 12)

        // ایجاد کاربر جدید
        const newUser = await prisma.user.create({
          data: {
            firstName,
            lastName,
            userName,
            email,
            password: hashPassword
          }
        })

        const token = jwt.sign(
          { id: newUser.id, userName: newUser.userName },
          process.env.JWT_SECRET,
          { expiresIn: '2h' }
        )

        res.setHeader(
          'Set-Cookie',
          serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 2 * 60 * 60,
            path: '/'
          })
        )

        return res.status(201).json({ message: 'User created successfully', user: newUser })
      } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({ message: 'Server error' })
      }
    }

    case 'GET': {
      try {
        const users = await prisma.user.findMany()
        return res.status(200).json({ users })
      } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({ message: 'Server error' })
      }
    }

    default:
      res.setHeader('Allow', ['POST', 'GET'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

export default handler