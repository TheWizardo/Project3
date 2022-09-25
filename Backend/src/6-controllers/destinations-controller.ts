import express, { Request, Response, NextFunction } from 'express';
import verify from '../3-middleware/verify-user';
import DestinationModel from '../4-models/destination-model';
import destinationLogic from '../5-logic/destination-logic';

const router = express.Router();

router.get("/api/destinations", verify.verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const getAllDestinations = await destinationLogic.getAllDestinations();
        res.json(getAllDestinations);
    }
    catch (err: any) {
        next(err);
    }
});

router.post("/api/destinations", verify.verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const destination = new DestinationModel(req.body);
        const addedDestination = await destinationLogic.addDestination(destination);
        res.status(201).json(addedDestination);
    }
    catch (err: any) {
        next(err);
    }
});

router.put("/api/destinations/:id", verify.verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.id = +req.params.id;

        const destination = new DestinationModel(req.body);
        const updatedDestination = await destinationLogic.updateDestination(destination);
        res.json(updatedDestination);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;