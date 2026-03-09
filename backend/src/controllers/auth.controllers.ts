import { Request, Response } from "express";
import { oauth2Client } from "../config/googleApi";
import axios from "axios";
import { User } from "../models/user.models";
import { createAccessToken, createRefreshToken } from "../utils/authService";
import { googleLoginSchema, roleSchema } from "../validations/googleLogin.validation";

export const loginController = async (req: Request, res: Response) => {
    try {
        const parsed = googleLoginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ msg: "Invalid request", error: parsed.error.issues })
        }

        const googleRes = await oauth2Client.getToken(parsed.data.code);
        oauth2Client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);

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
            .json({
                success: true, msg: "Login successfully", data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profile: user.profile,
                    role: user.role
                }
            })
    } catch (error) {
        console.error("error while login", error);
        return res.status(500).json({ msg: "Something went wrong" });
    }
};

export const addRole = async (req: Request, res: Response) => {
    try {
        const parsed = roleSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ msg: "Invalid inputs", error: parsed.error.issues })
        };

        const user = await User.findByIdAndUpdate(req.user?._id, {
            $set: {
                role: parsed.data.role
            }
        }, {
            new: true
        });

        if (!user || !user.role) {
            return res.status(404).json({ msg: "User not found or missing fields" });
        };

        const accessToken = createAccessToken(user._id.toString(), user.role);
        const refreshToken = createRefreshToken(user._id.toString(), user.role);

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
            }).json({
                success: true, msg: "role updated successfully", data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profile: user.profile,
                    role: user.role
                }
            })
    } catch (error) {
        return res.status(500).json({ msg: "Internal server error" })
    }
}

export const userprofileController = async (req: Request, res: Response) => {
    try {
        if (req.user?._id) {
            return res.status(200)
                .json({
                    success: true, msg: "Profile fetched successfully", data: {
                        id: req.user._id,
                        name: req.user.name,
                        email: req.user.email,
                        profile: req.user.profile,
                        role: req.user.role
                    }
                })
        }
    } catch (error) {
        console.log("Error while fetching user profile", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const logoutController = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.user?._id, {
            $set: {
                refreshToken: null
            }
        });

        if (!user) {
            return res.status(400).json({ msg: "User not found" })
        };

        return res.status(200)
            .clearCookie("accessToken", {
                httpOnly: true,
                secure: true
            })
            .clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
            })
            .json({ success: true, msg: "user logged out successfully" })
    } catch (error) {
        console.log("Error while logged out", error);
        return res.status(500).json({ msg: "Internal server error" })
    };
}