// @ts-nocheck
import {IUser} from "../../types/User";
import Joi, {Schema, ValidationResult} from "joi";

export function validateUser(user: IUser): ValidationResult {
    const schema: Schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    });

    return schema.validate(user);
}
