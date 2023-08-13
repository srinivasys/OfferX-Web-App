 export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function totalMonths(year: number) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth()+1; 
    
    if (currentYear === year) {
         return currentMonth
    } else {
        return 12
    } 
};