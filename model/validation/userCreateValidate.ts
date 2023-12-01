import {IUser} from "../../types/User";
import Joi, {Schema, ValidationResult} from "joi";

export function validateCreateUser(user: IUser): ValidationResult {
    const schema: Schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        avatar: Joi.string().required(),
    });

    return schema.validate(user);
}
