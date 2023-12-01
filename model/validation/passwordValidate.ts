
// @ts-nocheck
import Joi, {Schema} from "joi";
import {IUser} from "../../types/User";

export function validatePassword(username: Pick<IUser, 'password'>) {
    const schema: Schema = Joi.object({
        password: Joi.string().required()
    })

    return schema.validate(username);
}
