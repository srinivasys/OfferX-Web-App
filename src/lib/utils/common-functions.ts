export const convertUTCtoLocal = (date: Date): string => {
    return new Date(date.toString()).toLocaleString('en-in', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};
