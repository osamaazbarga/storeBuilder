import { User } from "../account/user";

export interface StoreDetails{
    id:Number;
    name :string;
    link :string;
    kind :string;
    category :string;
    logo :string;
    description :string;
    user:User;
    createDate :Date;
    

}