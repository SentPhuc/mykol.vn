import { RECRUITMENT_STATUS_ENUM } from '../../../src/commons/Utils';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';

const StatusDropdown = (props) => {
    const { recruitmentStatus, row } = props;
    const [selectedStatus, setSelectedStatus] = useState({});

    const getDropdownValue = (status) => {
        setSelectedStatus(RECRUITMENT_STATUS_ENUM.find((e) => e?.code == status));
    };

    const onDropdownChange = async (event, kolRecruit) => {
        setSelectedStatus(event.value);
        props.onChange(kolRecruit.id, event.value.code);
    };

    useEffect(() => {
        getDropdownValue(recruitmentStatus);
    },[])
    
    const checkExpiredAt = () =>{
        const today = new Date();
        const expiredAt = new Date(row?.expiredAt);
        return today < expiredAt;
    };

    return (
        <div className='w-full'>
            <Dropdown value={selectedStatus} onChange={(e) => onDropdownChange(e, row)}
                      options={RECRUITMENT_STATUS_ENUM}
                      optionLabel="name"
                      /*'Đã duyệt', 'Từ chối'*/
                      disabled={checkExpiredAt()}
                      placeholder="Chọn" className="w-full"
                      id="status_recruitment"
            />
        </div>
    );
};

export default StatusDropdown;
