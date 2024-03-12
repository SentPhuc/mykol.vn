import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Formik, Form, Field, FieldArray } from 'formik';
import { useRef } from 'react';
import { CampaignService } from 'demo/service/CampaignService';
import _ from 'lodash';

const UploadCampaign = ({ visibleUploadCampaign, setVisibleUploadCampaign, setReports, reports }) => {
    const toastUploadCampaign = useRef(null);
    const formik = {
        initialValues: { title: '', links: ['', '', ''] }
    };
    const handleSubmit = async (values) => {
        const indexUrl = [];
        const newLinks = [];
        const checkUrl = values?.links?.map((link, index) => {
            if (!isValidHttpUrl(link) && !!link) {
                indexUrl.push(index + 1);
                return false;
            }
            if (!!link) newLinks.push(link);
            return true;
        });

        if (!_.every(checkUrl)) {
            toastUploadCampaign.current.show({ severity: 'error', summary: 'Error', detail: `URL thứ ${indexUrl.toString()} không hợp lệ` });
            return;
        }
        try {
            const newValues = { ...values, ...{ links: newLinks } };
            const { data } = await new CampaignService().uploadCampaigns(newValues);
            if (data.code === 'success') {
                // const dataNew = [
                //     ...reports,
                //     {
                //         id: 5,
                //         jobName: 'Laboris officia veniam Laboris officia veniamLaboris officia veniam 5',
                //         Platform: 'tiktok',
                //         price: 24540000,
                //         totalViews: 100000,
                //         interactionRate: 20,
                //         numberPosts: 25,
                //         numberInfluencer: 10003
                //     }
                // ];
                // setReports(dataNew);

                toastUploadCampaign.current.show({ severity: 'success', summary: 'Thông báo', detail: 'Tải lên thành công' });
                setVisibleUploadCampaign(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const isValidHttpUrl = (string) => {
        try {
            const newUrl = new URL(string);
            return newUrl?.protocol === 'http:' || newUrl?.protocol === 'https:';
        } catch (err) {
            return false;
        }
    };
    return (
        <>
            <Toast ref={toastUploadCampaign} position="top-right" />
            <Dialog header="Tải lên chiến dịch" visible={visibleUploadCampaign} style={{ maxWidth: '440px', width: '100%' }} onHide={() => setVisibleUploadCampaign(false)}>
                <Formik initialValues={formik.initialValues} onSubmit={(values) => handleSubmit(values)}>
                    {({ values }) => (
                        <Form className="p-fluid">
                            <FieldArray
                                name="links"
                                render={(arrayHelpers) => (
                                    <>
                                        <div className="field">
                                            <label htmlFor="title">Tên chiến dịch</label>
                                            <Field className="p-inputtext p-component p-filled" id="title" name="title" placeholder="Nhập tên chiến dịch" />
                                        </div>
                                        <div className="field">
                                            <label className="flex justify-content-between">
                                                <strong>Link bài đăng tiktok</strong> <i>*Tối đa 50 link tiktok</i>
                                            </label>
                                            {values.links &&
                                                values.links.length > 0 &&
                                                values.links.map((dataLink, index) => (
                                                    <div key={index}>
                                                        <Field className="p-inputtext p-component p-filled mb-3" name={`links.${index}`} placeholder="Nhập Link bài đăng Tiktok" />
                                                    </div>
                                                ))}
                                            {values.links.length <= 50 && <Button className="bg-primary-reverse font-bold text-3xl py-1" label="+" type="button" onClick={() => arrayHelpers.push('')} />}
                                        </div>
                                        <div className="text-center">
                                            <Button className="w-auto" label="Tải lên" type="submit" />
                                        </div>
                                    </>
                                )}
                            />
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    );
};

export default UploadCampaign;
