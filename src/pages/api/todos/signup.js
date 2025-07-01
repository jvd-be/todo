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
        const { firstName, lastName, userName, email, password } = req.body
        if (
          !firstName.trim() ||
          !lastName.trim() ||
          !userName.trim() ||
          !email.trim() ||
          !password.trim()
        ) {
          return res.status(422).json({ message: 'Data is not valid !!' })
        }

        const exsitUser = await User.findOne({ $or: [{ userName }, { email }] })

        if (exsitUser) {
          return res.status(422).json({ message: 'user alredy exist' })
        }

        const hashPassword=await bcrypt.hash(password,12)

        const newUser = await User.create({
          firstName,
          lastName,
          userName,
          email,
          password:hashPassword
        })

        const token = jwt.sign(
          { id: newUser._id, userName: newUser.userName },
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
          .json({ message: 'create new user successfully', newUser })
      } catch (error) {
        console.log('error:', error)
        return res.status(500).json({ message: 'server error' })
      }
    }

    case 'GET': {
      await connectedToDB()
      return res.status(200).json({ message: 'get user' })
    }

    default:
      break
  }
}

export default handeler
