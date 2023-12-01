import Joi, {Schema, ValidationResult} from "joi";
import {IUser} from "../../types/User";
export function validateUsername(username: Pick<IUser, 'name'>): ValidationResult {
    const schema: Schema = Joi.object({
        name: Joi.string().required()
    })

    return schema.validate(username);
}
