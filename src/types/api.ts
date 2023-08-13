export type ApiResponseType = {
    isSuccessful: boolean;
    error: {
        type: string;
        message: string;
    } | null;
    resultObject: any;
};
