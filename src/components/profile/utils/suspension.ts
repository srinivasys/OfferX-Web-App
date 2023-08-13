import {SuspensionType} from "../../../types/suspension";
import {uniqBy} from "lodash";

export type CategoryType = {
    id: string
    label: string
    reasons: ReasonType[]
}

export type ReasonType = {
    id: string
    label: string
    text: string
}

export function mapSuspension(items: SuspensionType[]): CategoryType[] {
    const uniqCategory = uniqBy(items, 'suspendReasonCategoryId')
    const sortedCategory = uniqCategory.sort((a,b) => a.suspendReasonCategoryOrder - b.suspendReasonCategoryOrder)
    const categoryArr = sortedCategory.map(entry => {
        const currentReasons = items.filter(item => item.suspendReasonCategoryId === entry.suspendReasonCategoryId)
        const sortedCurrentReasons = currentReasons.sort((a,b) => a.suspendReasonOrder - b.suspendReasonOrder)
        const reasons = sortedCurrentReasons.map(reason => ({id: reason.suspendReasonId, label: reason.suspendReasonName, text: reason.suspendReasonText}))
        return ({id: entry.suspendReasonCategoryId, label: entry.suspendReasonCategoryName, reasons})
    })
    return categoryArr
}