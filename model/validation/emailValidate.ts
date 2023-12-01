import {IUser} from "../../types/User";
import Joi, {Schema, ValidationResult} from "joi";

export function validateEmail(email: Pick<IUser, 'email'>): ValidationResult {
    const schema: Schema = Joi.object({
        email: Joi.string().required().email()
    })

    return schema.validate(email);
}
