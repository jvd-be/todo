import prisma from '@/utils/prismaClient'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import bcrypt from 'bcrypt'

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const { userName, password } = req.body

    if (!userName?.trim() || !password?.trim()) {
      return res.status(422).json({ message: 'Data is not valid !!' })
    }

    const user = await prisma.user.findUnique({
      where: { userName }
    })

    if (!user) {
      return res.status(422).json({ message: 'Username not valid' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(422).json({ message: 'Password is not valid' })
    }

    const token = jwt.sign(
      { id: user.id, userName: user.userName },
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

    return res.status(200).json({ message: 'Login successful', user })
  } catch (error) {
    console.error('error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export default handler