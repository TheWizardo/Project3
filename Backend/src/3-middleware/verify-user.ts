import { NextFunction, Request, Response } from "express";
import auth from "../2-utils/auth";
import { ForbiddenError, UnauthorizedError } from "../4-models/client-errors";

async function isUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.header("authorization");
    const isValid = await auth.verifyToken(authHeader);
    if (!isValid) {
        next(new UnauthorizedError("You are not logged in"));
        return;
    }
}

async function verifyUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    isUser(req, res, next);
    next();
}

async function verifyAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.header("authorization");
    // first verify the user
    isUser(req, res, next);

    // check the user's role
    const role = auth.getUserRoleFromToken(authHeader);
    if (role !== "Admin") {
        next(new ForbiddenError("Forbidden"));
        return;
    }
    next();
}

export default { verifyUser, verifyAdmin };