export interface User{
    id?:string
    firstName?: string;
    lastName?: string;
    email?: string;
    avatarUrl?: string;
    joinDate?:Date;
    isDeleted?:boolean;
    phone?:string;
    address?:string;
    city?:string;
    region?:string;
    postalCode?:string;
    country?:string;
    plan?:number;
    token:string; 
}