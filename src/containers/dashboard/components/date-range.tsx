import React from 'react';
import { getYearsList } from '../utils/years';

type Props = {
    setSelectedYear: (key: number) => void;
};

const DateRange: React.FC<Props> = ({ setSelectedYear }) => {
    const YearsItems = getYearsList();

    return (
        <div className="row">
            <div className="col-lg-12 col-xl-12 d-flex align-items-center">
                <label className="date-range fs-14 fw-700 text-nowrap pe-2">Year:</label>
                <select
                    onChange={(Event) => setSelectedYear(Number(Event.target.value))}
                    className="form-select input-border-default cursor-pointer"
                >
                    {YearsItems.reverse().map((list) => {
                        return (
                            <option key={list} value={list}>
                                {list}
                            </option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
};

export default DateRange;
