import {User} from "../../model/user";
import {catchAsyncError} from "../../middleware/catchAsyncError";
import generator from "generate-password";
import nodemailer from "nodemailer";
import {validateEmail} from "../../model/validation/emailValidate";
import {NextFunction, Request, Response} from "express";

export const sendEmail = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const {error} = validateEmail(req.body);

    if (error)
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });

    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user)
        return res.status(404).json({
            success: false,
            message: "User account not found.",
        });

    const newPassword = generator.generate({length: 4, numbers: true, uppercase: false});

    const transport = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
    };

    const transporter = nodemailer.createTransport(transport);
    transporter.verify((error, success) => {
        if (error) {
            return res.status(400).json({
                success: false,
                message: (error.message),
            });
        }
    })

    const mail = {
        from: "social app",
        to: email,
        subject: 'Password Reset',
        text: `Reset Code: ${newPassword}`
    }

    transporter.sendMail(mail, (err, data) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: err.message,
            });
        } else {
            res.status(200).json({
                code: newPassword,
                success: true
            });
        }
    })
})
