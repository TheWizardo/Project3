import Joi from "joi";

class UserModel {
    public id: number;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;
    public role: string;

    public constructor(user: UserModel) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
        this.role = user.role;
    }

    private static validationScheme = Joi.object({
        id: Joi.number().optional().positive().integer(),
        firstName: Joi.string().required().min(2).max(100),
        lastName: Joi.string().required().min(2).max(100),
        username: Joi.string().required().min(4).max(100),
        password: Joi.string().required().min(4).max(100),
        role: Joi.string().optional()
    });

    public validate(): string {
        const result = UserModel.validationScheme.validate(this);
        return result.error?.message;
    }
}

export default UserModel;