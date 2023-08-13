import React from 'react';
import { getYearsList } from '../../containers/dashboard/utils/years';

type Props = {
    setDropdownYear: (value: number) => void;
};

const YearsDropdown: React.FC<Props> = ({ setDropdownYear }) => {
    const YearsItems = getYearsList();

    return (
        <div className="dropdown lt-dropdown-menu lt-dot-menu">
            <button className="dropdown-toggle p-0" id="MoreOption" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-three-dots-vertical me-0" />
            </button>
            <ul className="dropdown-menu lt-shadow-tin py-0" aria-labelledby="MoreOption" role="tablist">
                {YearsItems.reverse().map((list) => {
                    return (
                        <button key={list} className="dropdown-item fs-14" onClick={() => setDropdownYear(list)}>
                            Year of {list}
                        </button>
                    );
                })}
            </ul>
        </div>
    );
};

export default YearsDropdown;
