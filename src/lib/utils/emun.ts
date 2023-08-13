export function arrayFromEnum(arrEnum: any) {
    return Array.from(Array(Object.values(arrEnum).filter((element) => !isNaN(Number(element))).length), (e, i) => i);
}
