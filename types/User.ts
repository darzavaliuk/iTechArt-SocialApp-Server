export interface IUser {
    _id: string,
    name: string
    email: string,
    password: string,
    userName: string,
    avatar: {
        public_id: string,
        url: string
    },
    following: [
        {
            userId: {
                type: String,
            },
        },
    ],
}
