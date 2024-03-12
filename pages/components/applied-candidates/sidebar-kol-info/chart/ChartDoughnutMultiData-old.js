import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

const ChartDoughnutMultiData = ({ data: dataChartDoughnutMulti }) =>{
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    
    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        
        const data = {
            labels: dataChartDoughnutMulti?.labels,
            datasets: [
                {
                    data: dataChartDoughnutMulti?.data,
                    backgroundColor: dataChartDoughnutMulti?.styles?.map((style) => documentStyle.getPropertyValue(`--${style}-500`)),
                    hoverBackgroundColor: dataChartDoughnutMulti?.styles?.map((style) => documentStyle.getPropertyValue(`--${style}-400`))
                }
            ]
        };
        const options = {
            cutout: '60%',
            responsive: true,
            borderWidth: 0,
            plugins: {
                legend: {
                    title: {
                      display: false,
                    },
                    labels:{
                        usePointStyle: true,
                        pointStyle:'circle'
                    },
                    position:'bottom'
                },
                tooltip:{
                    callbacks:{
                        label: function(context) {
                            if(context.parsed < 1) {
                                return context ? context.label +' : '+ Math.round(context.parsed * 100) +'%' : '';
                            }
                            return context ? context.label +' : '+ context.parsed: '';
                        }
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);

    }, [dataChartDoughnutMulti]);

    return <Chart type="doughnut" data={chartData} options={chartOptions} className="w-full" />;
}

export default ChartDoughnutMultiData;