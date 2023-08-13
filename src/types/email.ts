export type EmailRequestType = {
    name: string;
    email: string;
    message: string;
};

export type EmailFormType = EmailRequestType & {
    agreement: boolean;
};
