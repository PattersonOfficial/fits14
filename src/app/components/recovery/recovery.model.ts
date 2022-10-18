export class RecoveryMail {
    constructor(
        public email: string,
    ) { }
}

export class RecoveryNewPassword {
    constructor(
       public token: string,
       public password: string,
       public password2: string
    ) {}
}
