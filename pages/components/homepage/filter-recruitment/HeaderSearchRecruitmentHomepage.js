import React from 'react';
import 'primereact/resources/primereact.min.css';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { CATEGORY_ENUM, CITY_ENUM } from '../../../../src/commons/Utils';

const HeaderSearchRecruitmentHomepage = (props) => {
    const { showDiv, setShowDiv, formik } = props;

    const handleClick = () => {
        if (showDiv != null && showDiv != undefined) {
            setShowDiv(!showDiv);
        }
    };

    const panelHeaderTemplate = () => null; // return an empty template

    return (
        <>
            <div className="flex flex-wrap justify-content-between gap-3 header-filter-recruitment">
                <div className="items-input-filter">
                    <span className="p-input-icon-left w-full h-full">
                        <i className="pi pi-search" />
                        <InputText
                            value={formik?.values?.matchingJobs}
                            onChange={(e) => {
                                formik.setFieldValue('matchingJobs', e.target.value);
                            }}
                            placeholder="Tìm tin tuyển dụng"
                            className="input-search-recruitment w-full h-full"
                        />
                    </span>
                </div>
                <MultiSelect
                    value={formik?.values?.careerFieldRequests}
                    onChange={(e) => {
                        formik.setFieldValue('careerFieldRequests', e.target.value);
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
                <Button label="Tìm kiếm" className="p-button custom-button-filter send-email-button" />
                <Button onClick={handleClick} label="Lọc nâng cao" className="p-button custom-button-filter advanced-filter" />
            </div>
        </>
    );
};

export default HeaderSearchRecruitmentHomepage;
