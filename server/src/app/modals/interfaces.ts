export interface IBook {
  _id: string,
  name: string,
  imagePath: string,
  price: number,
  author: string,
  subject?: string,
  bookCondition: string,
  publication?: string,
  standard?: string,
  category?: string,
  registered: IUser
}

export interface IUser{
  _id: string,
  firstName: string,
  email: string,
  userType: string
}

export interface IUserType{
  type: string
}
