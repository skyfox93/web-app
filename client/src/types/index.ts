export type Asset = {
    id: number,
    title: string,
    categories: string[],
    datePosted: string,
    location: string,
    imgs: string[],
    description: string,
    postedBy: User,
};

export type User = {
    id: number,
    firstName: string,
};

export type Transaction = {
    id: number,
    donater: User,
    requester: User,
    asset: Pick<Asset, 'id' | 'title'>,
};

export type Message = {
    id: number,
    text: string,
    transactionId: number,
    user: User,
};