import express, { Request, Response, NextFunction } from 'express';
import auth from '../2-utils/auth';
import verify from '../3-middleware/verify-user';
import FollowAction from '../4-models/follow-action';
import VacationModel from '../4-models/vacation-model';
import vacationsLogic from '../5-logic/vacations-logic';

const router = express.Router();

router.get("/api/vacations", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.header("authorization");
        const allVacations = await vacationsLogic.getAllVacations(authHeader);
        res.json(allVacations);
    }
    catch (err: any) {
        next(err);
    }
});

// router.get("/api/vacations/my-vacations", verify.verifyUser, async (req: Request, res: Response, next: NextFunction) => {
    //     try {
//         const authHeader = req.header("authorization");
//         const allVacations = await vacationsLogic.getVacationsByUser(authHeader);
//         res.json(allVacations);
//     }
//     catch (err: any) {
    //         next(err);
//     }
// });

router.post("/api/vacations", verify.verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.image = req.files?.image;
        const vacation = new VacationModel(req.body);
        const addedVacation = await vacationsLogic.addVacation(vacation);
        res.status(201).json(addedVacation);
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/api/vacations/:id", verify.verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = +req.params.id;
        const authHeader = req.header("authorization");
        const vacation = await vacationsLogic.getVacationById(authHeader, id);
        res.json(vacation);
    }
    catch (err: any) {
        next(err);
    }
});

router.delete("/api/vacations/:id", verify.verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = +req.params.id;
        await vacationsLogic.deleteVacation(id);
        res.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

router.put("/api/vacations/:id", verify.verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.image = req.files?.image;
        req.body.id = +req.params.id;
        req.body.following = +req.body.following;
        req.body.price = +req.body.price;
        req.body.dstId = +req.body.dstId;
        const vacation = new VacationModel(req.body);
        const updatedVacation = await vacationsLogic.updateVacation(vacation);
        res.json(updatedVacation);
    }
    catch (err: any) {
        next(err);
    }
});

router.post("/api/vacations/:id/follow", verify.verifyUser, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.header("authorization");
        const uId = await auth.getUserIDFromToken(authHeader);
        const vId = +req.params.id;
        const action = new FollowAction(vId, uId);
        const addedFollow = await vacationsLogic.followVacation(action);
        res.status(201).json(addedFollow);
    }
    catch (err: any) {
        next(err);
    }
});

router.delete("/api/vacations/:id/unfollow", verify.verifyUser, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.header("authorization");
        const uId = await auth.getUserIDFromToken(authHeader);
        const vId = +req.params.id;
        const action = new FollowAction(vId, uId);
        await vacationsLogic.unfollowVacation(action);
        res.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;