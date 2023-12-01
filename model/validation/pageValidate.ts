// @ts-nocheck
import Joi, {Schema, ValidationResult} from "joi";
import {IUser} from "../../types/User";

export function validatePage(page: number) {
    const schema: Schema = Joi.object({
        page: Joi.number().required()
    })

    return schema.validate(page);
}
