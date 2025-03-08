import { User } from "../account/user";

export class StoreAddEdit{
   id?:Number;
   name? :string;
   link ?:string;
   kind? :string;
   category? :string;
   logo? :string;
   description? :string;
   userId? :string;
   user? :User
}