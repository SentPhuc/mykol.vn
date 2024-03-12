import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { InputTextarea } from 'primereact/inputtextarea';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import AppLayout from 'layout/AppLayout';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { SettingService } from 'demo/service/SettingService';
import { GlobalService } from 'demo/service/GlobalService';
const InformationCensorship = () => {
    const setting = new SettingService();
    const location = useRouter().pathname;
    const toast = useRef(null);

    const { handleSubmit, setFieldValue, values } = useFormik({
        initialValues: {
            keywords: ''
        },
        onSubmit: async (data) => {
            if (data && data.keywords) {
                setting
                    .postKeywordBacklist({ keywords: data?.keywords })
                    .then((data) => {
                        if (data?.data?.code == 'success') {
                            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Cập nhật thành công', life: 3000 });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        toast.current.show({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
                    });
            }
        }
    });

    useEffect(() => {
        new GlobalService()
            .getKeywordBacklist()
            .then((data) => {
                if (data?.data?.code == 'success' && data?.data?.data?.keywords) {
                    setFieldValue('keywords', data?.data?.data?.keywords);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [setFieldValue]);

    return AppLayout(
        <>
            <Toast ref={toast} />
            <div className="layout-main">
                <div className="card">
                    <BreadcrumbCustom path={location} />
                    <br />
                    <form style={{ maxWidth: '700px', margin: '0 auto' }} onSubmit={handleSubmit}>
                        <label className="mb-3 block font-bold" htmlFor="valueCensorship">
                            Giá trị thông tin (Cách nhau bằng dấu phậy)
                        </label>
                        <InputTextarea id="valueCensorship" className="w-full" value={values?.keywords} onChange={(e) => setFieldValue('keywords', e.target.value)} rows={5} cols={30} />
                        <Button className="mt-3" label="Lưu" type="submit" />
                    </form>
                </div>
            </div>
        </>
    );
};
export default InformationCensorship;
