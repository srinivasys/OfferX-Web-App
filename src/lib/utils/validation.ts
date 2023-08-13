// eslint-disable-next-line no-useless-escape
export const emailRegexp = /^[a-zA-Z0-9\_*\-*\.*]+@[a-zA-Z0-9\-*]+\.*[A-Za-z\.*\-*]*\.[A-Za-z]+$/;

export const siteRegexp = /.+\..+/;

export const mobileMask = [ /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

export const yearMask = [/[1-2]/, /\d/, /\d/, /\d/];

export const aadharMask = [
    'X',
    'X',
    'X',
    'X',
    ' ',
    'X',
    'X',
    'X',
    'X',
    ' ',
    'X',
    'X',
    'X',
    'X',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
];

export const gstRegexp = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const spaceRegexp = /^[A-Z\d\s\(\-']{1,5}$/;