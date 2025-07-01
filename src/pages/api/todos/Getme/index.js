import { PrismaClient } from '@prisma/client'
import VerifyUserToken from '@/lib/VerifyUserToken'

const prisma = new PrismaClient()

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const userData = VerifyUserToken(req)

  if (!userData) {
    return res.status(401).json({ message: 'You are not logged in' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userData.id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userName: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({ message: 'User found successfully', user })
  } catch (error) {
    console.error('Error in /api/auth/me:', error)
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export default handler