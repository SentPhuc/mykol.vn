import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function ChartDoughnut({ data: dataChart }) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: [],
            datasets: [
                {
                    data: dataChart?.data,
                    backgroundColor: [
                        documentStyle.getPropertyValue(`--${dataChart?.style}-500`), 
                        documentStyle.getPropertyValue(`--${dataChart?.style}-200`)
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue(`--${dataChart?.style}-400`), 
                        documentStyle.getPropertyValue(`--${dataChart?.style}-100`)
                    ]
                }
            ]
        };
        const options = {
            borderWidth: 0,
            responsive: true,
            cutout: '65%',
            plugins: {
                legend: {
                    title: {
                      display: false,
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
        
    }, [dataChart?.data]);
    
    return <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full" />;
}
