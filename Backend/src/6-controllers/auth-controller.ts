import express, { NextFunction, Request, Response } from "express";
import CredentialsModel from "../4-models/credentials-model";
import UserModel from "../4-models/user-model";
import authLogic from "../5-logic/auth-logic";

const router = express.Router();

router.get("/api/auth/:username", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const exists = await authLogic.usernameExists(req.params.username);
        res.json(exists);
    }
    catch (err: any) {
        next(err);
    }
});

router.post("/api/auth/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = new UserModel(req.body);
        const token = await authLogic.register(user);
        res.status(201).json(token);
    }
    catch (err: any) {
        next(err);
    }
});

router.post("/api/auth/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cred = new CredentialsModel(req.body);
        const token = await authLogic.login(cred);
        res.json(token);
    }
    catch (err: any) {
        next(err);
    }
});


export default router;