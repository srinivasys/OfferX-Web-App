import React, { useCallback, useState } from 'react';
import DatePicker from 'react-datepicker';
import { range } from 'lodash';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import en from 'date-fns/locale/en-US';

export type DatePickerType = {
    startDate?: Date | null;
    endDate?: Date | null;
    onChange: (date: Date | [Date, Date | null] | null) => void;
    rangePicker?: boolean;
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
    headerSelects?: boolean;
    disabled?: boolean | false
};

const DatePickerComponent: React.FC<DatePickerType> = ({
    startDate,
    endDate,
    onChange,
    rangePicker,
    minDate,
    maxDate,
    placeholder,
    headerSelects,
    disabled
}) => {
    const [startDateState, setStartDate] = useState<Date | null>(startDate || null);
    const [endDateState, setEndDate] = useState<Date | null>(endDate || null);

    const handleChange = useCallback(
        (date: Date | [Date, Date | null] | null) => {
            if (Array.isArray(date)) {
                const [start, end] = date;
                setStartDate(start);
                setEndDate(end);
                if (start && end) {
                    onChange([start, end]);
                }
            } else if (date) {
                setStartDate(date);
                onChange(date);
            }
        },
        [onChange]
    );

    return (
        <DatePicker
            autoComplete="off"
            locale={en}
            minDate={minDate}
            maxDate={maxDate}
            selected={startDateState}
            startDate={startDateState}
            endDate={endDateState}
            onChange={handleChange}
            monthsShown={rangePicker ? 2 : 1}
            selectsRange={rangePicker}
            placeholderText={placeholder}
            disabled = {disabled}
            dateFormat="dd/MM/yyyy"
            id="DataRangeText"
            className='form-select'
            renderCustomHeader={({
                date,
                monthDate,
                changeYear,
                changeMonth,
                customHeaderCount,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
            }) => (
                <>
                    <div className={`react-datepicker-header ${rangePicker ? 'react-datepicker-header--range' : ''}`}>
                        {customHeaderCount === 0 && rangePicker && (
                            <div className="react-datepicker-header__range">
                                {startDateState && (
                                    <>
                                        {startDateState.toLocaleString('en-in', {
                                            day: 'numeric',
                                        })}{' '}
                                        {startDateState.toLocaleString('en-in', {
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                        {endDateState && (
                                            <>
                                                <div className="react-datepicker-header__arrow">
                                                    <i className="bi bi-arrow-right-short" />
                                                </div>
                                                {endDateState.toLocaleString('en-in', {
                                                    day: 'numeric',
                                                })}{' '}
                                                {endDateState.toLocaleString('en-in', {
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                        <button
                            type="button"
                            aria-label="Previous Month"
                            className="react-datepicker-header__btn react-datepicker-header__btn--previous"
                            disabled={customHeaderCount === 1 || prevMonthButtonDisabled}
                            style={customHeaderCount === 1 ? { opacity: 0 } : {}}
                            onClick={decreaseMonth}
                        >
                            <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous" />
                        </button>
                        {headerSelects ? (
                            <>
                                <select
                                    value={moment(date).toDate().getFullYear()}
                                    onChange={({ target: { value } }) => changeYear(+value)}
                                >
                                    {years.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={months[moment(date).toDate().getMonth()]}
                                    onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                                >
                                    {months.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <div className="react-datepicker-header__date">
                                {monthDate.toLocaleString('en-in', {
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </div>
                        )}
                        <button
                            type="button"
                            aria-label="Next Month"
                            className="react-datepicker-header__btn react-datepicker-header__btn--next"
                            disabled={(customHeaderCount === 0 && rangePicker) || nextMonthButtonDisabled}
                            style={customHeaderCount === 0 && rangePicker ? { visibility: 'hidden' } : {}}
                            onClick={increaseMonth}
                        >
                            <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--next" />
                        </button>
                    </div>
                </>
            )}
        />
    );
};

export default DatePickerComponent;

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const years = range(
    moment().subtract(65, 'years').toDate().getFullYear(),
    moment().subtract(17, 'years').toDate().getFullYear()
);
