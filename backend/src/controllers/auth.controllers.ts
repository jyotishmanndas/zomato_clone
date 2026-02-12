import { Request, Response } from "express";
import { oauth2Client } from "../config/googleApi";
import axios from "axios";
import { User } from "../models/user.models";
import { createAccessToken, createRefreshToken } from "../utils/authService";
import { googleLoginSchema } from "../validations/googleLogin.validation";

export const loginController = async (req: Request, res: Response) => {
    try {
        const parsed = googleLoginSchema.safeParse(req.body);
       if(!parsed.success){
        return res.status(400).json({msg: "Invalid request", error: parsed.error.issues})
       }

        const googleRes = await oauth2Client.getToken(parsed.data.code);
        oauth2Client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens}`);

        const { id: googleId, email, name, picture } = userRes.data;
        if (!googleId || !email) {
            return res.status(400).json({ msg: "Invalid Google response" });
        }

        let user = await User.findOne({ googleId });
        if (!user) {
            user = await User.create({
                name,
                email,
                profile: picture,
                googleId
            })
        };

        const accessToken = createAccessToken(user._id.toString());
        const refreshToken = createRefreshToken(user._id.toString());

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return res.status(200)
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                maxAge: 15 * 60 * 1000
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 3 * 24 * 60 * 60 * 1000
            })
            .json({ success: true, msg: "Login successfully", data: user })
    } catch (error) {
        console.error("error while login", error);
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

export const addRole = async (req: Request, res: Response) => {
    try {

    } catch (error) {

    }
}