import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import YearsDropdown from '../../../components/dropdown';
import PageLoader from '../../../components/loader';
import { dashboardServices } from '../../../lib/api/dashboard';
import { RootState } from '../../../redux';
import { getAllRecruiterOffersType } from '../../../types/dashboard';

type Props = {
    selectedYear: number;
};

const RecruiterOffers: React.FC<Props> = ({ selectedYear }) => {
    const { loading, user } = useSelector((state: RootState) => state.user);
    const [dropdownYear, setDropdownYear] = useState<number>(selectedYear);
    const [graphLoading, setGraphLoading] = useState<boolean>();
    const [data, setData] = useState<getAllRecruiterOffersType[] | null>(null);

    useMemo(() => {
        setDropdownYear(selectedYear);
    }, [selectedYear]);

    useEffect(() => {
        (async () => {
            try {
                setGraphLoading(true);
                const {
                    resultObject: { items },
                } = await dashboardServices.getAllRecruiterOffers(user?.companyId || '', dropdownYear);

                const mapItems = items.map((item) => ({
                    ...item,
                    fullName: `${item.firstName} ${item.middleName} ${item.lastName}`,
                }));
                setData(mapItems);
            } catch {
            } finally {
                setGraphLoading(false);
            }
        })();
    }, [dropdownYear]);

    return (
        <div className="col-xl-12 col-xxl-12 col-12">
            <div className="card p-4 mb-4">
                <div className="d-flex mb-3">
                    <div className="card-title fs-16 fw-600">
                        Employer's offer report{' '}
                        <i className="bi bi-info-circle lt-tooltip">
                            <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14 bottom-tip">
                                Offer details of individual recruiter
                            </span>
                        </i>
                    </div>
                    <YearsDropdown setDropdownYear={setDropdownYear} />
                </div>
                <div className="mt-0 table-responsive">
                    {data?.length ? (
                        loading || graphLoading ? (
                            <PageLoader />
                        ) : (
                            <table className="table table-border lt-table-border mb-0 text-nowrap">
                                <thead>
                                    <tr>
                                        <th>Recruitment / HR</th>
                                        <th className="text-end">Released</th>
                                        <th className="text-end">Accepted</th>
                                        <th className="text-end">Rejected</th>
                                        <th className="text-end">Expired</th>
                                        <th className="text-end">Retracted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.fullName}</td>
                                            <td className="text-end">{item.totalOffersReleased}</td>
                                            <td className="text-end">{item.totalOffersAccepted}</td>
                                            <td className="text-end">{item.totalOffersRejected}</td>
                                            <td className="text-end">{item.totalOffersExpired}</td>
                                            <td className="text-end">{item.totalOffersRetracted}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th> Total </th>
                                        <th className="text-end">
                                            <div className="fs-14 ms-2 fw-600">
                                                {data?.reduce((pre: any, cur: any) => pre + cur.totalOffersReleased, 0)}
                                            </div>
                                        </th>
                                        <th className="text-end">
                                            <div className="fs-14 ms-2 fw-600">
                                                {data?.reduce((pre: any, cur: any) => pre + cur.totalOffersAccepted, 0)}
                                            </div>
                                        </th>
                                        <th className="text-end">
                                            <div className="fs-14 ms-2 fw-600">
                                                {data?.reduce((pre: any, cur: any) => pre + cur.totalOffersRejected, 0)}
                                            </div>
                                        </th>
                                        <th className="text-end">
                                            <div className="fs-14 ms-2 fw-600">
                                                {data?.reduce((pre: any, cur: any) => pre + cur.totalOffersExpired, 0)}
                                            </div>
                                        </th>
                                        <th className="text-end">
                                            <div className="fs-14 ms-2 fw-600">
                                                {data?.reduce(
                                                    (pre: any, cur: any) => pre + cur.totalOffersRetracted,
                                                    0
                                                )}
                                            </div>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                        )
                    ) : (
                        <div>no data</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecruiterOffers;
