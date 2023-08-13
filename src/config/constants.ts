const REACT_APP_API_URL = '#{{Api_Url}}#';
const ENVIRONMENT = '#{{Environment}}#';
const BUILD_VERSION = '#{{Build.BuildNumber}}#';
const REACT_APP_DIGIO_ACK_EMAIL = '#{{Digio_Ack_Email}}#';

export const devMode = process.env.NODE_ENV === 'development';

export const appVersion = `${process.env.REACT_APP_VERSION}${
    BUILD_VERSION.indexOf('Build.BuildNumber') > 0 ? '' : `-${BUILD_VERSION}`
}`;

export const serverUrl = devMode ? process.env.REACT_APP_API_URL : REACT_APP_API_URL;
export const apiUrl = `${serverUrl}api/`;
export const profanityurl = process.env.REACT_APP_PROFANITY_FILTER || '';

export const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
export const microsoftClientId = process.env.REACT_APP_MICROSOFT_CLIENT_ID || '';
export const linkedInClientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID || '';

export const digioUrl = process.env.REACT_APP_DIGIO_URL || '';
export const digioEnv = ENVIRONMENT.indexOf('Environment') > 0 ? 'sandbox' : ENVIRONMENT;
export const digioAckEmail = devMode ? '' : REACT_APP_DIGIO_ACK_EMAIL;

export const tinyApiKey = process.env.REACT_APP_TINY_APIKEY || '';
