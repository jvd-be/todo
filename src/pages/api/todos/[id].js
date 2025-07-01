import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const handler = async (req, res) => {
  const { id } = req.query

  switch (req.method) {
    case 'PUT': {
      try {
        const { status, title, description } = req.body

        const updatedTodo = await prisma.todo.update({
          where: { id: Number(id) },
          data: {
            ...(status && { status }),
            ...(title && { title }),
            ...(description && { description })
          }
        })

        return res.status(200).json({ message: 'updated', todo: updatedTodo })
      } catch (error) {
        console.error('PUT error:', error)
        return res.status(500).json({ message: 'Error updating todo' })
      }
    }

    case 'DELETE': {
      try {
        await prisma.todo.delete({
          where: { id: Number(id) }
        })

        return res.status(200).json({ message: 'Deleted todo successfully', id })
      } catch (error) {
        console.error('DELETE error:', error)
        return res.status(500).json({ message: 'Error deleting todo' })
      }
    }

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler