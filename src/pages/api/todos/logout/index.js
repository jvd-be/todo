import { serialize } from 'cookie'

const handler = async (req, res) => {
  switch (req.method) {
    case 'POST': {
      try {
        // پاک کردن کوکی
        res.setHeader(
          'Set-Cookie',
          serialize('token', '', {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            path: '/'
          })
        )

        return res.status(201).json({ message: 'Logged out successfully' })
      } catch (error) {
        console.error('Logout error:', error)
        return res.status(500).json({ message: 'Server error' })
      }
    }

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler