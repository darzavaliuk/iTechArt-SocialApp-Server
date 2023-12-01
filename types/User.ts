export interface IUser {
    _id: string,
    name: string
    email: string,
    password: string,
    avatar: string,
    following: [
        {
            userId: {
                type: String,
            },
        },
    ],
}
