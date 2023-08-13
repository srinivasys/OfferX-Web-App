import { HubConnectionBuilder } from "@microsoft/signalr";
import { serverUrl } from "../../config/constants";
import { tokenManager } from "../token-manager";

export const signalrConnect= () => { 
    const token = tokenManager.getToken() as string;
    const newConnection = new HubConnectionBuilder()
        .withUrl(`${serverUrl}NotifyUser`, { accessTokenFactory: () => token })
        .withAutomaticReconnect()
        .build();

        return newConnection
};