import {useEffect} from 'react';
import moment from 'moment';
import $ from 'jquery';
import daterangepicker from 'daterangepicker';
import 'node_modules/daterangepicker/daterangepicker.css';

const CalendarFilter = ({setDate, startDate, endDate}) => {
    useEffect(() => {
        if (!startDate && !endDate) {
            startDate = Math.floor(new Date().getTime() / 1000);
            endDate = Math.floor(new Date().getTime() / 1000);
        }

        $('#datePicker').daterangepicker(
            {
                ranges: {
                    Today: [moment(), moment()],
                    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                startDate: startDate != null ? moment.unix(startDate).format('MM/DD/YYYY') : null,
                endDate: endDate != null ? moment.unix(endDate).format('MM/DD/YYYY') : null,
                alwaysShowCalendars: true
            },
            function (start, end) {
                setDate({
                    start: startDate != null ? moment.unix(start) : null,
                    end: endDate != null ? moment.unix(end) : null
                });
            }
        );
    }, [startDate, endDate]);

    return (
        <div className="flex align-items-center form-filter">
            <label htmlFor="calendar-filter" className="mb-0 mr-3">
                Bộ lọc
            </label>
            <span className="p-input-icon-left">
                <i className="pi pi-calendar z-2" />
                <input onChange={setDate} type="text" id="datePicker" className="pl-5 p-inputtext-sm p-inputtext p-component" />
            </span>
        </div>
    );
};

export default CalendarFilter;
