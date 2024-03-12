import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';

const CalendarPostVideoDeadlineAt = (props) => {
    const { row } = props;
    const [openInput, setOpenInput] = useState(false);
    const [currentDate] = useState(new Date());
    const onCalendarChange = async (event, kolRecruit) => {
        props.onChange(kolRecruit.id, event.value);
        setOpenInput(false);
    };

    const rowDate = new Date(currentDate);

    let dateDeadline = new Date(row?.postVideoDeadlineAt ? row?.postVideoDeadlineAt : currentDate);
    let month = rowDate.getMonth();
    let year = rowDate.getFullYear();
    let nextMonth = month === 9 ? 0 : month + 3;
    let nextYear = nextMonth === 0 ? year + 1 : year;

    let maxDate = new Date(currentDate);

    maxDate.setMonth(nextMonth);
    maxDate.setFullYear(nextYear);

    return (
            <span className="p-input-icon-left">
                <i className="pi pi-calendar z-2"/>
                <Calendar inputClassName="pl-5" placeholder="Chọn ngày deadline"
                          value={row?.postVideoDeadlineAt && dateDeadline}
                          minDate={rowDate} maxDate={maxDate}
                          dateFormat="dd/mm/yy"
                          onChange={(e) => onCalendarChange(e, row)}
                />
            </span>
    );
};
export default CalendarPostVideoDeadlineAt;
