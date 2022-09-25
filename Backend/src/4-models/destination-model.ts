import Joi from "joi";

class DestinationModel {
    public id: number;
    public name: string;
    public description: string;

    public constructor(vacation: DestinationModel) {
        this.id = vacation.id;
        this.name = vacation.name;
        this.description = vacation.description;
    }

    private static validationScheme = Joi.object({
        id: Joi.number().optional().positive().integer(),
        name: Joi.string().required().min(2).max(50),
        description: Joi.string().required().min(2).max(150),
    });

    public validate(): string {
        const result = DestinationModel.validationScheme.validate(this);
        return result.error?.message;
    }
}

export default DestinationModel;