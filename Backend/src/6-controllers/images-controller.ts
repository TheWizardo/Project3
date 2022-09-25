import express, { NextFunction, Request, Response } from "express";
import config from "../2-utils/config";
import imagesLogic from "../5-logic/images-logic";

const router = express.Router();

router.get("/api/images/:name", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fileName = req.params.name;

        const requestedFilePath = `${config.imagesFolder}/${fileName}`;
        const filePath = await imagesLogic.getFilePath(requestedFilePath);
        res.sendFile(filePath);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;