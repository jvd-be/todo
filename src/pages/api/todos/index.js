import prisma from '@/utils/prismaClient'
import VerifyUserToken from '../../../../lib/VerifyUserToken'

const handler = async (req, res) => {
  switch (req.method) {
    case 'POST': {
      try {
        const { title, status, description, user } = req.body

        if (!title || !status || !user) {
          return res.status(422).json({ message: 'Missing required fields' })
        }

        // ایجاد تسک جدید
        const todo = await prisma.todo.create({
          data: {
            title,
            status,
            description: description || '',
            user: { connect: { id: user } }  // رفرنس به یوزر
          }
        })

        return res.status(201).json({ message: 'Todo created', todo })
      } catch (error) {
        console.error('POST error:', error)
        return res.status(500).json({ message: 'Error creating todo', error: error.message })
      }
    }

    case 'GET': {
      try {
        const userData = VerifyUserToken(req)

        if (!userData) {
          return res.status(401).json({ message: 'Unauthorized' })
        }

        // گرفتن همه تو‌دوهای اون یوزر
        const todos = await prisma.todo.findMany({
          where: { userId: userData.id }
        })

        return res.status(200).json({ message: 'Todos fetched', todos })
      } catch (error) {
        console.error('GET error:', error)
        return res.status(500).json({ message: 'Error fetching todos', error: error.message })
      }
    }

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).json({ message:` Method ${req.method} Not Allowed` })
  }
}

export default handler