 export function getYearsList():number[] {
    const currentYear = new Date().getFullYear();
    var  array = []; 
    for (let i = 2022; i <= currentYear; i++) {
        array.push(i); 
    } 
    return array
} 