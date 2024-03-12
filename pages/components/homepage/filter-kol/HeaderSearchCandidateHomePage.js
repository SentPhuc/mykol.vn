import React, { useEffect, useState } from 'react';
import 'primereact/resources/primereact.min.css';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { AGE_ENUM, CATEGORY_ENUM, CITY_ENUM } from '../../../../src/commons/Utils';

const HeaderSearchCandidateHomePage = (props) => {
    const { showDiv, setShowDiv, formik } = props;

    const handleClick = () => {
        setShowDiv(!showDiv);
    };

    const panelHeaderTemplate = () => null; // return an empty template

    return (
        <>
            <div className="flex flex-wrap justify-content-between gap-3 header-filter-candidate">
                <div className="items-input-filter">
                    <span className="p-input-icon-left w-full h-full">
                        <i className="pi pi-search" />
                        <InputText
                            value={formik?.values?.kolsInfluencerName || ''}
                            onChange={(e) => {
                                formik.setFieldValue('kolsInfluencerName', e.target.value);
                            }}
                            className="input-search-influencers w-full h-full"
                            placeholder="Tìm Influencers"
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
                    value={formik?.values?.workingAgeRequests}
                    onChange={(e) => {
                        formik.setFieldValue('workingAgeRequests', e.target.value);
                    }}
                    options={AGE_ENUM}
                    optionLabel="name"
                    display="chip"
                    showSelectAll={false}
                    panelHeaderTemplate={panelHeaderTemplate}
                    placeholder="Độ tuổi"
                    maxSelectedLabels={3}
                    className="items-input-filter-advanced"
                />
                <Button type="submit" label="Tìm kiếm" className="p-button send-email-button search-button custom-button-filter" />
                <Button type="button" onClick={handleClick} label="Lọc nâng cao" className="p-button advanced-filter custom-button-filter" />
            </div>
        </>
    );
};

export default HeaderSearchCandidateHomePage;
