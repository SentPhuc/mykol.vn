import { useEffect } from 'react';
import { PieChart } from 'chartist';
import 'chartist/dist/index.css';

const ChartDoughnutMultiData = ({ data: dataChartDoughnutMulti, dataKey: dataKey }) => {
    useEffect(() => {
        let data = new PieChart(
            `#${dataChartDoughnutMulti?.element}`,
            {
                series: dataChartDoughnutMulti?.data
            },
            {
                donut: true,
                donutWidth: 40,
                startAngle: 0,
                labelOffset: -20,
                labelDirection: 'explode',
                labelInterpolationFnc: (value, index) => {
                    if (value < 1) {
                        return dataChartDoughnutMulti?.data?.[index]?.name +' '+ `(${Math.round(value * 100)}%)`;
                    }
                    return dataChartDoughnutMulti?.data?.[index]?.name +' '+ `(${value})}%)`;
                }
            },
            [
                [
                    'screen and (min-width: 640px)',
                    {
                        chartPadding: 30,
                        labelOffset: 40,
                        labelDirection: 'explode',
                        labelInterpolationFnc: (value, index) => {
                            if (value < 1) {
                                return dataChartDoughnutMulti?.data?.[index]?.name +' '+ `(${Math.round(value * 100)}%)`;
                            }
                            return dataChartDoughnutMulti?.data?.[index]?.name +' '+ `(${value})}%)`;
                        }
                    }
                ],
                [
                    'screen and (min-width: 1024px)',
                    {
                        labelOffset: 10,
                        chartPadding: 30,
                        labelDirection: 'explode',
                        labelInterpolationFnc: (value, index) => {
                            if (value < 1) {
                                return dataChartDoughnutMulti?.data?.[index]?.name +' '+ `(${Math.round(value * 100)}%)`;
                            }
                            return dataChartDoughnutMulti?.data?.[index]?.name +' '+ `(${value})}%)`;
                        }
                    }
                ]
            ]
        );

    }, []);

    const TemaplateDatasets = (data) => {
        return (
            <ul className="box-datasets-chart pl-0 my-0 justify-content-center flex list-none">
                {data?.map(value => {
                    return (
                        <li className='cursor-pointer'>
                            <span className={`dots-chart border-circle ${value?.className}`}></span>
                            {value?.name}
                        </li>
                    )
                })}
            </ul>
        );
    };

    return (
        <>
            <div key={dataKey} id={dataChartDoughnutMulti?.element} style={{ height: '240px' }} className="relative cursor-pointer">
                <div className="chartCenter text-center absolute">
                    <span>{dataChartDoughnutMulti?.label}</span>
                </div>
            </div>
            {TemaplateDatasets(dataChartDoughnutMulti?.data)}
        </>
    );
};

export default ChartDoughnutMultiData;
