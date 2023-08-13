export const reducer = (previousValue: number, currentValue: number, index: number) => {
    return previousValue + currentValue;
};

export const getAvgReviewValue = (reviewList: any[], EnumType: number) => {
    if (reviewList?.length > 0) {        
        const filterList = reviewList?.filter((x: any) => x.reviewType === EnumType)
        const reduceValue = filterList?.map((x: any) => x.rating).reduce(reducer, 0)
        const avgValue = reduceValue / filterList?.length

        return avgValue
    }

};

export const getAvgProgressValue = (reviewList: any) => {
    if (reviewList?.length > 0) {        
        const filterList = reviewList?.filter((x: any) => x.reviewType)
        const reduceValue = filterList?.map((x: any) => x.rating).reduce(reducer, 0)
        const avgValue = reduceValue / filterList?.length

        return avgValue
    }

};


export const getAvgcardValue = (onboard: any, progress: any, exit: any) => {
    const reviewList = [...onboard, ...progress, ...exit]    
    if (reviewList?.length > 0) {        
        const filterList = reviewList?.filter((x: any) => x.reviewType || x.reviewType === 0)
        const reduceValue = reviewList?.map((x: any) => x.rating).reduce(reducer, 0)
        const avgValue = reduceValue / filterList?.length

        return avgValue
    }

};