export interface IBook{
    id: string,
    name : string,
    price: number,
    author: string,
    subject: string,
    owner: IUser
    bookCondition: string,
    publication?: string,
    standard?: string,
    category?: ICategory,
}

export interface IUser{
    id: string,
    name: string,
    email: string,
    phone: number,
    type: IUserType
}

export interface ICategory{
    category: string
}

export interface IUserType{
    type: string
}