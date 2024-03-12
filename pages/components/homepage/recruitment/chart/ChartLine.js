import React, {useEffect, useState} from 'react';
import {Chart} from 'primereact/chart';

export default function ChartLine({dataChartLine}) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: dataChartLine.labels,
            datasets: [
                {
                    data: dataChartLine?.data,
                    label: dataChartLine?.label,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--primary-color'),
                    tension: 0.4
                }
            ]
        };
        const defineLabels = (labels) => {
            if (!labels) return false;
            let arrayLabelsNew = [];
            const indexMin = 0;
            const indexMax = Math.max(...Object.keys(labels));
            const indexCenter = Math.round(Object.keys(labels).length / 2);
            arrayLabelsNew.push(labels?.[indexMin]);
            labels?.map((label, index) => {
                if (index !== indexMin && index !== indexMax) {
                    if (index === indexCenter) {
                        arrayLabelsNew.push(labels?.[indexCenter]);
                    } else {
                        arrayLabelsNew.push("");
                    }
                }
            })
            if (labels.length >= indexMax) arrayLabelsNew.push(labels?.[indexMax]);
            return labels;
        }
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            responsive: true,
            borderWidth: 1,
            elements: {
                point: {
                    hoverBorderWidth: 2,
                }
            },
            plugins: {
                legend: {
                    labels: false
                }
            },
            scales: {
                x: {
                    labels: defineLabels(data?.labels),
                    grid: {
                        display: false,
                    }
                },
                y: {
                    ticks: {
                        callback: function (value, index, ticks) {
                            return value >= 1000 ? value / 1000 + 'k' : value;
                        },
                        maxTicksLimit: 50
                    },
                    min: 0,
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [dataChartLine]);

    return <Chart type="line" data={chartData} options={chartOptions}/>;
}
