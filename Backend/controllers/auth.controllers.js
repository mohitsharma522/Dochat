import genToken from "../config/token.js";
import User from "../models/User.model.js"
import bcrypt from "bcryptjs";


export const signUp = async (req, res) => {
    try {
        const { userName, email, password } = req.body

        let checkUserByUserName = await User.findOne({ userName })
        if (checkUserByUserName) {
            return res.status(400).json({ message: "userName already exist" })
        }

        let checkUserByEmail = await User.findOne({ email })
        if (checkUserByEmail) {
            return res.status(400).json({ message: "email already exist" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least 6 characters" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            userName,
            email,
            password: hashedPassword

        })

        let token = await genToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true
        })

        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({ message: `signup error ${error}` })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "user does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" })
        }

        let token = await genToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true
        })

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({ message: `login error ${error}` })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        res.status(200).json({ message: "Logout successfully" })

    } catch (error) {
        return res.status(500).json({ message: `Logout error ${error}` })
    }
}

