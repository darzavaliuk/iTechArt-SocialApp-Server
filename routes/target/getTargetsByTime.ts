import {catchAsyncError} from "../../middleware/catchAsyncError";
import {NextFunction, Request, Response} from "express";
import {SubTarget} from "../../model/user";

export const getTargetsByTime = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const startDate = new Date(req.body.startTime);
    const endDate = new Date(req.body.endTime);
    console.log(startDate, endDate, userId)

    SubTarget.aggregate([
        {
            $match: {
                userId: userId,
                'timeOrNumbers.timestamp': {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $unwind: '$timeOrNumbers'
        },
        {
            $match: {
                'timeOrNumbers.timestamp': {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $project: {
                _id: 0,
                text: 1,
                way: 1,
                maxValue: 1,
                value: '$timeOrNumbers.value',
                timestamp: '$timeOrNumbers.timestamp'
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$timestamp'
                    }
                },
                events: {
                    $push: {
                        text: '$text',
                        way: '$way',
                        maxValue: '$maxValue',
                        value: '$value'
                    }
                }
            }
        },
        {
            $sort: {
                '_id': 1
            }
        }
    ])
        .then(subTargets => {
            console.log(subTargets)
            res.status(200).json({
                success: true,
                subTargets,
            });
        })
        .catch(error => {

        });
})
