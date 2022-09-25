import Joi from "joi";
import { UploadedFile } from 'express-fileupload';

class VacationModel {
    public id: number;
    public dstId: number;
    public dstName: string;
    public dstDescription: string;
    public price: number;
    public startDate: Date;
    public endDate: Date;
    public image: UploadedFile;
    public imageName: string;
    public following: number;

    public constructor(vacation: VacationModel) {
        this.id = vacation.id;
        this.dstId = vacation.dstId;
        this.dstName = vacation.dstName;
        this.dstDescription = vacation.dstDescription;
        this.price = vacation.price;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.image = vacation.image;
        this.imageName = vacation.imageName;
        this.following = vacation.following;
    }

    private static validationScheme = Joi.object({
        id: Joi.number().optional().positive().integer(),
        dstId: Joi.number().optional().positive().integer(),
        dstName: Joi.string().required().min(2).max(50),
        dstDescription: Joi.string().required().min(2).max(150),
        price: Joi.number().required().positive().min(0).max(10000),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        image: Joi.object().optional(),
        imageName: Joi.string().optional(),
        following: Joi.number().optional().integer().min(0)
    });

    public validate(): string {
        const result = VacationModel.validationScheme.validate(this);
        return result.error?.message;
    }
}

export default VacationModel;