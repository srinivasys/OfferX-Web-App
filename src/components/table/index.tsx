import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import imgNoResult from '../../assets/icons/offer-no-result.svg';
import { GridConstants } from '../../lib/constants/constants';

export type TableType = {
    data: TableDataType[];
    columns: TableColumnType[];
    fixedCols?: number;
    height?: number;
    reverseHead?: boolean;
    filteredKey?: string;
    reverse?: boolean;
    isInputFilterVisible?: boolean;
    filterdSearch?: string;
};

type TableObjectType = {
    columns: TableColumnType[];
    hideSort?: boolean;
    fixedHeader?: boolean;
    fixedCols: number;
    filteredKey: string | null;
    reverse: boolean;
    paginationCurrent: number;
    paginationArray: TableDataType[][];
    setReverse: (value: boolean) => void;
    setFilteredKey: (value: string) => void;
    border?: boolean;
    reverseHead?: boolean;
    overflow?: boolean;
    inputFilter: { value: string; dataIndex: string } | null;
    setInputFilter: (value: { value: string; dataIndex: string }) => void;
    isInputFilterVisible: boolean;
};

type TableColumnType = {
    dataIndex?: string;
    title: string;
    hideSort?: boolean;
    inputFilter?: (value: any) => string;
    render?: (item: TableDataType) => ReactNode | string | number;
    width?: string;
    children?: TableColumnType[];
};

type TableHeadColumnType = TableColumnType & {
    colSpan?: number;
    rowSpan?: number;
    fixed?: boolean;
};

type TableDataType = {
    [key: string]: any;
};

const Table: React.FC<TableType> = ({
    data,
    columns,
    reverseHead,
    fixedCols,
    height,
    filteredKey: filteredKeyProps = null,
    reverse: reverseProps = false,
    isInputFilterVisible = true,
    filterdSearch,
}) => {
    const [pageSize, setPageSize] = useState(10);
    const [paginationCurrent, setPaginationCurrent] = useState(0);
    const [filteredKey, setFilteredKey] = useState<string | null>(filteredKeyProps);
    const [reverse, setReverse] = useState(reverseProps);
    const [inputFilter, setInputFilter] = useState<{ value: string; dataIndex: string } | null>(null);

    let filteredData: TableDataType[];

    if (filteredKey) {
        data.sort((a, b) => {
            const arg1 = typeof a[filteredKey] === 'string' ? a[filteredKey].toLowerCase() : a[filteredKey];
            const arg2 = typeof b[filteredKey] === 'string' ? b[filteredKey].toLowerCase() : b[filteredKey];
            if (arg1 === undefined) return 1;
            if (arg2 === undefined) return -1;
            if (arg1 === arg2) return 0;
            if (arg1 > arg2) return reverse ? -1 : 1;
            return reverse ? 1 : -1;
        });
    }
    filteredData = [...data];

    if (inputFilter) {
        const matchColumn = columns.find((col) => col.dataIndex === inputFilter.dataIndex);
        if (matchColumn) {
            filteredData = data.filter((item) => {
                const itemValue = matchColumn.inputFilter
                    ? matchColumn.inputFilter(item[inputFilter.dataIndex])
                    : item[inputFilter.dataIndex];
                return String(itemValue).toLowerCase().indexOf(inputFilter.value.toLowerCase()) >= 0;
            });
        }
    }

    let paginationArray = [];
    let filteredArray = [...filteredData];
    while (filteredArray.length > 0) {
        paginationArray.push(filteredArray.splice(0, pageSize));
    }

    const resetPagination = useMemo(() => {
        setPaginationCurrent(0);
    }, [inputFilter, pageSize, filterdSearch, data]);

    const objectProps = {
        columns,
        paginationArray,
        paginationCurrent,
        filteredKey,
        reverse,
        fixedCols: fixedCols || 0,
        setFilteredKey,
        setReverse,
        reverseHead,
        inputFilter,
        setInputFilter,
        isInputFilterVisible,
    };

    useEffect(() => {
        if (sessionStorage.getItem(GridConstants.AreFiltersApplicable)) {
            let pageSize = sessionStorage.getItem(GridConstants.PageSize);
            if (pageSize) setPageSize(Number(pageSize));
            setTimeout(function () {
                let currentPage = sessionStorage.getItem(GridConstants.CurrentPage);
                if (currentPage) setPaginationCurrent(Number(currentPage));
            }, 200);
            sessionStorage.removeItem(GridConstants.AreFiltersApplicable);
        }
    }, []);

    return (
        <>
            <div className="offer-table-container">
                <div className="offer-table-scroll table-responsive w-100">
                    <TableObject {...objectProps} />
                </div>
            </div>
            {data.length > 0 && (
                <div className="d-flex align-items-center mt-3">
                    <div className="col-8">
                        {/* <label className="fs-14 me-2">Items per page:</label> */}
                        <select
                            value={String(pageSize)}
                            onChange={(ev) => {
                                setPageSize(Number(ev.target.value));
                                sessionStorage.setItem(GridConstants.PageSize, ev.target.value);
                                sessionStorage.removeItem(GridConstants.CurrentPage);
                            }}
                            className="items-selecter fs-14"
                        >
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="25">25</option>
                        </select>
                    </div>
                    <div className="col-4 text-end">
                        <label className="fs-14 me-2" htmlFor="">
                            Page {paginationCurrent + 1} of {paginationArray.length}
                        </label>

                        {!!paginationArray[paginationCurrent - 1] && (
                            <button
                                type="button"
                                onClick={() => {
                                    sessionStorage.setItem(
                                        GridConstants.CurrentPage,
                                        (paginationCurrent - 1).toString()
                                    );
                                    setPaginationCurrent(paginationCurrent - 1);
                                }}
                                className="lt-action-btn"
                                title="Previous Page"
                            >
                                <i className="bi bi-chevron-left" />
                            </button>
                        )}
                        {!!paginationArray[paginationCurrent + 1] && (
                            <button
                                type="button"
                                onClick={() => {
                                    sessionStorage.setItem(
                                        GridConstants.CurrentPage,
                                        (paginationCurrent + 1).toString()
                                    );
                                    setPaginationCurrent(paginationCurrent + 1);
                                }}
                                className="lt-action-btn"
                                title="Next Page"
                            >
                                <i className="bi bi-chevron-right" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

const TableObject: React.FC<TableObjectType> = ({
    columns,
    fixedCols,
    filteredKey,
    reverse,
    paginationCurrent,
    paginationArray,
    setReverse,
    setFilteredKey,
    reverseHead,
    inputFilter,
    setInputFilter,
    isInputFilterVisible,
}) => {
    const sort = useCallback(
        (key: string) => {
            if (filteredKey !== key) {
                setFilteredKey(key);
                sessionStorage.setItem(GridConstants.SortColumn, key);
                if (reverse) {
                    setReverse(false);
                }
            } else {
                setReverse(!reverse);
                sessionStorage.removeItem(GridConstants.SortColumn);
            }
        },
        [filteredKey, reverse, setFilteredKey, setReverse]
    );

    const childrenNumLevels = useCallback((cols: TableColumnType[], i: number) => {
        let count = i;
        cols.forEach((col) => {
            if (col.children) {
                const childCount = childrenNumLevels(col.children, i + 1);
                count = count < childCount ? childCount : count;
            }
        });
        return count;
    }, []);

    const headRowsCount = useMemo(() => childrenNumLevels(columns, 1), [columns, childrenNumLevels]);

    const fixedBodyCols = useMemo(() => {
        const fixedColumns = columns.slice(0, fixedCols);
        let count = 0;

        function calcCount(cols: TableColumnType[]) {
            cols.forEach((col) => {
                if (!col.children) {
                    count++;
                } else {
                    calcCount(col.children);
                }
            });
        }

        calcCount(fixedColumns);
        return count;
    }, [columns, fixedCols]);

    const mapFixedHeadColumns = useMemo(() => {
        function setFixedChildren(children: TableColumnType[]): TableHeadColumnType[] {
            return children.map((col) => ({
                ...col,
                fixed: true,
                ...(col.children && { children: setFixedChildren(col.children) }),
            }));
        }

        return columns.map((col, i) => {
            if (i < fixedCols) {
                return {
                    ...col,
                    fixed: true,
                    ...(col.children && { children: setFixedChildren(col.children) }),
                };
            } else {
                return col;
            }
        });
    }, [columns, fixedCols]);

    const mapHeadColumns = useMemo(() => {
        let headCols: TableHeadColumnType[][] = [mapFixedHeadColumns];
        let reverseRows: TableHeadColumnType[][] = [];

        function createRow(headCols: TableHeadColumnType[][], i: number) {
            let refactorRow: TableHeadColumnType[] = [];
            headCols[reverseHead ? 0 : i].forEach((col) => {
                if (col.children) {
                    const colSpan = childrenNumLevels(col.children, col.children.length);
                    const refactorCol = {
                        title: col.title,
                        ...(col.fixed && { fixed: col.fixed }),
                        ...(col.width && { width: col.width }),
                        colSpan,
                    };
                    if (reverseHead) {
                        refactorRow = [...refactorRow, ...col.children];
                        if (reverseRows[i]) {
                            reverseRows[i] = [...reverseRows[i], refactorCol];
                        } else {
                            reverseRows.push([refactorCol]);
                        }
                    } else {
                        refactorRow = [...refactorRow, refactorCol];
                        if (headCols[i + 1]) {
                            headCols[i + 1] = [...headCols[i + 1], ...col.children];
                        } else {
                            headCols.push(col.children);
                        }
                    }
                } else {
                    const rowSpan = headRowsCount - i;
                    refactorRow.push({
                        ...col,
                        ...(rowSpan > 1 && !col.rowSpan && { rowSpan }),
                    });
                }
            });
            headCols[reverseHead ? 0 : i] = refactorRow;
        }

        for (let i = 0; i < headRowsCount; i++) {
            createRow(headCols, i);
        }

        return reverseHead ? [headCols[0], ...reverseRows.reverse()] : headCols; // Преобразован в headRows
    }, [headRowsCount, mapFixedHeadColumns, childrenNumLevels, reverseHead]);

    const mapBodyColumns = useMemo(() => {
        function map(cols: TableColumnType[]) {
            cols.forEach((item) => {
                if (item.children) {
                    map(item.children);
                } else {
                    mapBodyColumns.push(item);
                }
            });
        }

        let mapBodyColumns: TableColumnType[] = [];
        map(columns);
        return mapBodyColumns;
    }, [columns]);

    useEffect(() => {
        setTimeout(() => {
            const elementsTh = document.querySelectorAll('[data-fixed-th]');
            const elementsTd = document.querySelectorAll('[data-fixed-td]');
            if (!elementsTh.length || !elementsTd.length) return;

            function setStyles(elements: NodeListOf<Element>) {
                Array.prototype.forEach.call(elements, (item) => {
                    const width = item.getBoundingClientRect().width;
                    const left = item.offsetLeft;
                    item.style.position = 'sticky';
                    item.style.zIndex = '1';
                    item.style.width = `${width}px`;
                    item.style.left = `${left}px`;
                });
            }

            setStyles(elementsTh);
            setStyles(elementsTd);
        }, 100);
    }, [fixedCols]);

    useEffect(() => {
        if (sessionStorage.getItem(GridConstants.AreFiltersApplicable)) {
            let sortColumn = sessionStorage.getItem(GridConstants.SortColumn);
            if (sortColumn) sort(sortColumn);
        }
    }, []);

    return (
        <table className="offer-table table table-hover mb-0">
            <thead>
                {mapHeadColumns.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((col, colIndex) => (
                            <th
                                rowSpan={col.rowSpan}
                                colSpan={col.colSpan}
                                key={col.dataIndex || colIndex}
                                data-fixed-th={col.fixed}
                                data-border-th=""
                                className={'lt_' + col.dataIndex}
                            >
                                <div className={isInputFilterVisible ? 'offer-table-th' : 'job-offer-table-th'}>
                                    {col.dataIndex ? (
                                        <>
                                            {col.title && (
                                                <>
                                                    {col.title}
                                                    {!col.hideSort && (
                                                        <>
                                                            <span className="ms-1" />
                                                            <button
                                                                type="button"
                                                                onClick={() => col.dataIndex && sort(col.dataIndex)}
                                                            >
                                                                {col.dataIndex === filteredKey && !reverse ? (
                                                                    <i className="bi bi-chevron-up text-primary" />
                                                                ) : col.dataIndex === filteredKey && reverse ? (
                                                                    <i className="bi bi-chevron-down" />
                                                                ) : (
                                                                    <i className="bi bi-chevron-down" />
                                                                )}
                                                            </button>
                                                        </>
                                                    )}
                                                    {isInputFilterVisible ? (
                                                        <div className="d-flex">
                                                            <input
                                                                type="text"
                                                                value={
                                                                    inputFilter
                                                                        ? inputFilter.dataIndex === col.dataIndex
                                                                            ? inputFilter.value
                                                                            : ''
                                                                        : ''
                                                                }
                                                                onChange={(ev) =>
                                                                    col.dataIndex &&
                                                                    setInputFilter({
                                                                        dataIndex: col.dataIndex,
                                                                        value: ev.target.value,
                                                                    })
                                                                }
                                                                className="form-control form-control-sm mt-1"
                                                                placeholder={`Search ${col.title}`}
                                                            />
                                                        </div>
                                                    ) : null}
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        col.title
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {paginationArray[paginationCurrent]?.length > 0 ? (
                    paginationArray[paginationCurrent]?.map((row, rowIndex) => (
                        <tr key={rowIndex} style={{ position: 'relative' }}>
                            {mapBodyColumns.map((col, colIndex) => {
                                return (
                                    <td
                                        key={col.dataIndex || colIndex}
                                        data-fixed-td={colIndex < fixedBodyCols || undefined}
                                        valign="middle"
                                    >
                                        {col.render && col.render(row)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))
                ) : (
                    <tr className="nodataRow">
                        <td valign="middle" colSpan={columns.length}>
                            <div className="offer-container">
                                <img src={imgNoResult} alt="" className="offer-no-result-img" />
                                <div className="mt-2">No results</div>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default Table;
