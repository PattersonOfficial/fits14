import {User} from './user.model';

export class Friends {
    public id!: string;
    public name!: string;
    public email!: string;
    public phone!: string;
    public image!: string;
    public status!: number;
    public canAdd!: boolean;
    public chat: any;
}


export class Contacts {
    public friends!: Friends[];
    public user!: User;
}

export class Message {
    public uid!: string;
    public created_at!: string;
    public content!: string;
    public type!: string;
    public file!: string;
    public chat_id!: number;
    public name!: string;
}
