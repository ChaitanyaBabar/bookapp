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


export interface IBook{
    _id?: string;
    name?: string;
    price?: number;
    userImage?: any;
    imagePath?: string;
    bookCondition?: string;
    publication?: string;
    standard?: string;
    category?: string;
    author?: string;
    subject?: string;
    addedBy?: RegisteredUser;
}


export interface BookResolved{
    book: Book;
    error?: any;
}

// tslint:disable-next-line: class-name
export class createBook implements IBook{
    _id?: string;
    name?: string;
    price?: number;
    userImage?: any;
    imagePath?: string;
    bookCondition?: string;
    publication?: string;
    standard?: string;
    category?: string;
    author?: string;
    subject?: string;
    addedBy?: RegisteredUser;

    constructor(){
        this.name = '';
        this.userImage = '';
        this.bookCondition = '';
        this.publication = '';
        this.standard = '';
        this.category = '';
        this.author = '';
        this.subject = '';
    }
}



export interface BookDialogData{
    title: string;
    content: string;
    primaryButtonLabel: string;
    secondaryButtonLabel: string;
}
