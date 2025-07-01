import connectedToDB from '@/utils/DBC'
import User from '@/models/User'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import bcrypt from "bcrypt"

const handeler = async (req, res) => {
  switch (req.method) {
    case 'POST': {
      await connectedToDB()
      try {
        const { userName, password } = req.body
        if (!userName.trim() || !password.trim()) {
          return res.status(422).json({ message: 'Data is not valid !!' })
        }

        const user = await User.findOne({ userName })

        if (!user) {
          return res.status(422).json({ message: 'userName not valid' })
        }
       
        
        
        const imdatch =await bcrypt.compare(password,user.password)

        if (!imdatch) {
          return res.status(421).json({ message: 'password is not valid' })
        }

        const token = jwt.sign(
          { id: user._id, userName: user.userName },
          process.env.JWT_SECRET,
          {
            expiresIn: '2h'
          }
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

        return res
          .status(201)
          .json({ message: 'create new user successfully', user })
      } catch (error) {
        console.log('error:', error)
        return res.status(500).json({ message: 'server error' })
      }
    }


    default:
      break
  }
}

export default handeler
