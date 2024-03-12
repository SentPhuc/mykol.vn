import React, { useEffect } from 'react';
import 'primereact/resources/primereact.min.css';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { CATEGORY_ENUM, CITY_ENUM } from '../../../src/commons/Utils';

const HeaderSearchRecruitment = (props) => {
    const { showDiv, setShowDiv, formik, setPage } = props;

    const handleClick = () => {
        setShowDiv(!showDiv);
    };

    const panelHeaderTemplate = () => null; // return an empty template

    return (
        <>
            <div className="flex flex-wrap justify-content-between gap-3 header-filter-recruitment lx:px-5 lg:px-5 px-2">
                <div className="items-input-filter">
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-search" />
                        <InputText
                            value={formik?.values.matchingJobs}
                            onChange={(e) => {
                                formik.setFieldValue('matchingJobs', e.target.value);
                                setPage(1);
                            }}
                            placeholder="Tìm tin tuyển dụng"
                            className='p-inputtext p-component input-search-influencers w-full'
                        />
                    </span>
                </div>
                <MultiSelect
                    value={formik?.values.careerFieldRequests}
                    onChange={(e) => {
                        formik.setFieldValue('careerFieldRequests', e.target.value);
                        setPage(1);
                    }}
                    options={CATEGORY_ENUM}
                    optionLabel="name"
                    display="chip"
                    showSelectAll={false}
                    panelHeaderTemplate={panelHeaderTemplate}
                    placeholder="Lĩnh vực"
                    maxSelectedLabels={3}
                    className="items-input-filter"
                />
                <MultiSelect
                    value={formik?.values.recLocationRequests}
                    onChange={(e) => {
                        formik.setFieldValue('recLocationRequests', e.target.value);
                        setPage(1);
                    }}
                    options={CITY_ENUM}
                    optionLabel="name"
                    display="chip"
                    showSelectAll={false}
                    panelHeaderTemplate={panelHeaderTemplate}
                    placeholder="Nơi làm việc"
                    maxSelectedLabels={3}
                    className="items-input-filter"
                />
                <Button type="submit" label="Tìm kiếm" className="p-button send-email-button custom-button-filter" />
                <Button type="button" onClick={handleClick} label="Lọc nâng cao" className="p-button advanced-filter custom-button-filter white-space-nowrap" />
            </div>
        </>
    );
};

export default HeaderSearchRecruitment;
