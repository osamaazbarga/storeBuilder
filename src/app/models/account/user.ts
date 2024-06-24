export interface User{



    firstName?: string;
    lastName?: string;
    joinDate?:Date;
    isDeleted?:boolean;
    phone?:string;
    address?:string;
    city?:string;
    region?:string;
    postalCode?:string;
    country?:string;
    plan?:number;
    jwt:string;
}