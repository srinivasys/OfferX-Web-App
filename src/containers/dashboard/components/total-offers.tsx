import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { months, totalMonths } from '../utils/month';
import { OffersChartColor } from '../utils/colors';
import { dashboardServices } from '../../../lib/api/dashboard';
import PageLoader from '../../../components/loader';
import { getAllMonthWiseOffersCount, seriesArray } from '../../../types/dashboard';
import YearsDropdown from '../../../components/dropdown';

type Props = {
    selectedYear: number;
};

const TotalOffers: React.FC<Props> = ({ selectedYear }) => {
    const { loading, user } = useSelector((state: RootState) => state.user);
    const [graphLoading, setGraphLoading] = useState<boolean>();
    const [data, setData] = useState<getAllMonthWiseOffersCount>();
    const [seriesArray, setSeriesArray] = useState<seriesArray[]>();
    const [dropdownYear, setDropdownYear] = useState<number>(selectedYear);

    useMemo(() => {
        setDropdownYear(selectedYear);
    }, [selectedYear]);

    useEffect(() => {
        (async () => {
            try {
                setGraphLoading(true);
                if (!user) return;
                if (user) {
                    const { resultObject } = await dashboardServices.getAllMonthWiseOffersCount(
                        user.companyId || '',
                        dropdownYear
                    );
                    const value = resultObject;
                    setData(value);
                    setSeriesArray([
                        {
                            name: 'Offers released',
                            data: value.offersReleased,
                        },
                        {
                            name: 'Offers accepted',
                            data: value.offersAccepted,
                        },
                        {
                            name: 'Offers declined',
                            data: value.offersRejected,
                        },
                        {
                            name: 'Offers expired',
                            data: value.offersExpired,
                        },
                        {
                            name: 'Offers retracted',
                            data: value.offersRetracted,
                        },
                    ]);
                }
            } catch (error) {
            } finally {
                setGraphLoading(false);
            }
        })();
    }, [dropdownYear]);

    const options: ApexOptions = {
        chart: {
            id: 'area-datetime',
            type: 'area',
            height: 350,
            width: '100vw',
            zoom: {
                autoScaleYaxis: true,
            },
        },
        colors: OffersChartColor,
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
        },
        xaxis: {
            categories: months,
            max: totalMonths(dropdownYear),
        },
        legend: {
            position: 'bottom',
        },
    };

    return (
        <div aria-labelledby="pills-offers-tab" className="tab-pane fade show active" id="pills-offers" role="tabpanel">
            <div>
                <div className="d-flex justify-content-between mb-3">
                    <div className="card-title fs-16 fw-600 mb-0">
                        Total offers{' '}
                        <i className="bi bi-info-circle lt-tooltip">
                            <span className="lt-tooltiptext lt-shadow-md fw-400 fs-14 bottom-tip">
                                Total number of offers in a year and month
                            </span>
                        </i>
                    </div>
                    <YearsDropdown setDropdownYear={setDropdownYear} />
                </div>
                <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                    {graphLoading || loading ? (
                        <PageLoader />
                    ) : (
                        <ReactApexChart options={options} series={seriesArray} type="line" height={350} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TotalOffers;
