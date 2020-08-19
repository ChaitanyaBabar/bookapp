export interface RegisteredUser{
    _id: string;
    firstName: string;
    email: string;
   userRole: string;
}

export interface Book{
    _id: string;
    name: string;
    price: number;
    imagePath: string;
    bookCondition: string;
    publication?: string;
    standard?: string;
    category?: string;
    author?: string;
    subject?: string;
    addedBy: RegisteredUser;
}

