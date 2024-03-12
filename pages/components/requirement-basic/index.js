import { useRouter } from 'next/router';
import { classNames } from 'primereact/utils';
import { useEffect, useState, useRef } from 'react';
import { Calendar } from 'primereact/calendar';
import { Editor } from 'primereact/editor';
import { useFormik } from 'formik';
import AppLayout from 'layout/AppLayout';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Bookings } from 'demo/service/Bookings';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tooltip } from 'primereact/tooltip';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { SERVICE_ENUM, formatCurrencyVND, isShowPayment } from 'src/commons/Utils';
import { Wallets } from 'demo/service/Wallets';
import ModalRecharge from './ModalRecharge';
import isForbiddenKeywordExists from 'src/commons/isForbiddenKeywordExists';

const RequirementBasic = () => {
    const bookings = new Bookings();
    const wallets = new Wallets();
    const toast = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [textValue, setTextValue] = useState('');
    const [lengthText, setLengthText] = useState(0);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('request');
    const router = useRouter();
    const query = router.query;
    const LIMIT_TEXT = Number(800);
    const [visible, setVisible] = useState(false);

    function stripHtml(html) {
        let tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    //Set max 3 months
    let minDate = new Date();
    let getDate = minDate.getDate() + 1;
    let nextMonth = new Date().getMonth() + 3;
    let maxDate = new Date();
    maxDate.setMonth(nextMonth);
    minDate.setDate(getDate);

    useEffect(() => {
        wallets
            .getWallets()
            .then((data) => {
                if (data?.data?.code == 'success') {
                    setWalletBalance(data?.data?.data?.balance);
                }
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        if (query.kolId) formik.setFieldValue('kolId', Number(query.kolId));
        if (query.serviceId) formik.setFieldValue('serviceId', Number(query.serviceId));
        if (query.serviceType) formik.setFieldValue('serviceType', query.serviceType ?? '');
        if (query.price) formik.setFieldValue('price', Number(query.price));
        if (query.serviceOption) formik.setFieldValue('serviceOption', query.serviceOption ?? '');
    }, [query]);

    const formik = useFormik({
        initialValues: {
            availableBalance: 0,
            kolId: 0,
            serviceId: 0,
            description: '',
            expectedCompletionTime: '',
            serviceOption: '',
            serviceType: '',
            price: 0
        },
        validate: async (data) => {
            let errors = {};
            if (!data.description) errors.description = 'Mô tả công việc bắt buộc nhập';
            if (!!data.description && textValue.replace('\n', '').length > LIMIT_TEXT) errors.description = 'Mô tả công việc giới hạn là 800 ký tự';
            if (!data.expectedCompletionTime) errors.expectedCompletionTime = 'Ngày mong đợi hoàn thành công việc bắt buộc nhập';
            if (data?.serviceOption == 'UNAVAILABLE') {
                if (!data.price) errors.price = 'Giá dịch vụ bắt buộc nhập';
                // if (!!data.price && data.price < 300000) errors.price = 'Giá dịch vụ không được nhỏ hơn 300.000';
                if (!data.serviceType) errors.serviceType = 'Tên dịch vụ bắt buộc nhập';
            }

            const checkDescription = await isForbiddenKeywordExists(data.description);
            if (!!data.description && checkDescription?.error) {
                errors.description = `Vui lòng không nhập ký tự không phù hợp "${checkDescription?.message}"`;
            }
            return errors;
        },
        onSubmit: async (data) => {
            if (!!isShowPayment) {
                const totalPrice = data.price + data.price * 0.1;
                if (totalPrice > data.availableBalance) {
                    confirmDialog({
                        message: 'Số tiền khả dụng của bạn không đủ, vui lòng nạp thêm',
                        icon: 'pi pi-info-circle',
                        acceptClassName: 'p-button-danger',
                        rejectClassName: 'hidden',
                        acceptLabel: 'Nạp thêm',
                        accept: () => openModal()
                    });
                    return;
                }
            }

            setLoading(true);
            let newData = { ...data, ...{ expectedCompletionTime: new Date(data?.expectedCompletionTime).toISOString(), description: stripHtml(data.description) } };

            if ((!data.price || !data.serviceType || !data.serviceId) && data?.serviceOption != 'UNAVAILABLE') {
                toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Dữ liệu không tồn tại', life: 3000 });
                return;
            }

            await bookings
                .request(newData)
                .then((data) => {
                    if (data?.data?.code === 'success') {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Đặt đơn hàng thành công', life: 3000 });
                        window.location.href = '/components/chat-box';
                    }
                })
                .catch((errors) => console.error(errors))
                .finally(() => setLoading(true));
        }
    });

    useEffect(() => {
        formik.setFieldValue('availableBalance', walletBalance);
    }, [walletBalance]);

    const renderHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
            </span>
        );
    };

    const header = renderHeader();

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error mt-2 block">{formik.errors[name]}</small> : '';
    };

    const handleValidate = () => {
        if (Object.keys(formik.errors).length) {
            const keyErrors = Object.keys(formik.errors);
            keyErrors.forEach((key) => {
                formik.setFieldError(String(key), String(formik.errors?.[key]));
                formik.setFieldTouched(String(key), !!String(formik.errors?.[key]));
            });
            return false;
        }
        return true;
    };

    const hanldNextStep = () => {
        const confirm = handleValidate();
        if (!confirm) {
            return;
        }
        setType('order');
    };

    const handleSwitchTab = () => {
        const confirm = handleValidate();
        if (!confirm) {
            return;
        }
        setType('order');
    };

    const openModal = () => {
        setVisible(true);
        //set scroll can not scroll
        document.body.style.overflow = 'hidden';
    };

    const handleItemClick = (index) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return AppLayout(
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div id="requirement-basic" className="card md:p-5 py-3 px-0">
                <div className="container">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex flex-wrap bg-white mb-3 md:mb-7">
                            <div
                                onClick={() => setType('request')}
                                className={classNames(
                                    type == 'request' ? 'active' : '',
                                    'item-tab w-6 border-round-lg px-3 text-center py-3 font-bold overflow-hidden bg-gray-100 transition-all transition-duration-200 transition-ease-out cursor-pointer'
                                )}
                            >
                                <span className="inline-block mr-2 border-circle">1</span>
                                Nhập yêu cầu
                            </div>
                            {isShowPayment && (
                                <div
                                    onClick={() => handleSwitchTab()}
                                    className={classNames(
                                        type == 'order' ? 'active' : '',
                                        'item-tab w-6 border-round-lg px-3 text-center py-3 font-bold overflow-hidden bg-gray-100 transition-all transition-duration-200 transition-ease-out cursor-pointer'
                                    )}
                                >
                                    <span className="inline-block mr-2 border-circle">2</span>
                                    Đặt đơn hàng
                                </div>
                            )}
                        </div>
                        <div className={classNames(type == 'request' ? 'show' : 'hidden')}>
                            <div>
                                <div className="font-bold text-xl md:mb-4 mb-2">Gửi yêu cầu công việc bằng cách nhập các thông tin bên dưới</div>
                                {formik.values.serviceOption == 'UNAVAILABLE' && (
                                    <>
                                        <label htmlFor="serviceType" className="font-bold block md:mb-3 mb-2">
                                            Tên dịch vụ <span className="text-primary">*</span>
                                        </label>
                                        <div className="md:mb-4 mb-2">
                                            <Dropdown
                                                inputId={'serviceType'}
                                                name="serviceType"
                                                value={formik?.values?.serviceType}
                                                onChange={(e) => formik.setFieldValue('serviceType', e.target.value)}
                                                options={SERVICE_ENUM.map((s) => ({ label: s.name, value: s.code }))}
                                                display="chip"
                                                placeholder="Chọn dịch vụ"
                                                className={classNames({ 'p-invalid': isFormFieldInvalid('serviceType') }, 'w-full')}
                                            />
                                            {getFormErrorMessage('serviceType')}
                                        </div>
                                        <label htmlFor="price" className="font-bold block md:mb-3 mb-2">
                                            Giá đề xuất <span className="text-primary">*</span>
                                        </label>
                                        <div className="md:mb-4 mb-2">
                                            <InputNumber
                                                inputId="price"
                                                placeholder="Ví dụ: 2,000,000"
                                                value={formik?.values?.price}
                                                onValueChange={(e) => formik.setFieldValue('price', e.value)}
                                                className={classNames({ 'p-invalid': isFormFieldInvalid('price') }, 'w-full')}
                                                min={0}
                                            />
                                            {getFormErrorMessage('price')}
                                        </div>
                                    </>
                                )}
                                <label className="font-bold block md:mb-3 mb-2">
                                    Ngày mong đợi hoàn thành công việc <span className="text-primary">*</span>
                                </label>
                                <div className="md:mb-4 mb-2">
                                    <div className={classNames({ 'p-invalid': isFormFieldInvalid('expectedCompletionTime') }, 'w-full date cursor-pointer border-1 border-round-lg')}>
                                        <Calendar
                                            className="md:w-6 w-full"
                                            name="expectedCompletionTime"
                                            placeholder="dd/mm/yy"
                                            value={formik?.values?.expectedCompletionTime}
                                            onChange={(e) => {
                                                formik.setFieldValue('expectedCompletionTime', e.target.value);
                                            }}
                                            maxDate={maxDate}
                                            minDate={minDate}
                                            readOnlyInput
                                            dateFormat="dd/mm/yy"
                                        />
                                    </div>
                                    {getFormErrorMessage('expectedCompletionTime')}
                                </div>
                                <div className="md:mb-4 mb-2 ">
                                    <div className="relative">
                                        <b className={classNames({ 'p-error': isFormFieldInvalid('description') })}>
                                            Mô tả công việc <span style={{ color: 'red' }}>*</span>
                                        </b>
                                        <div className={'my-3'}>
                                            <p>Thông tin cho vị trí công việc yêu cầu, trách nhiệm mà ứng viên có thể đảm nhận khi làm việc cho doanh nghiệp bạn.</p>
                                        </div>
                                        <Editor
                                            headerTemplate={header}
                                            onTextChange={(e) => {
                                                if (!!e.htmlValue) {
                                                    const length = e.textValue.replace('\n', '').length;
                                                    setLengthText(length);
                                                    setTextValue(e.textValue);
                                                    if (length > LIMIT_TEXT) {
                                                        setLengthText(800);
                                                        formik.setFieldError('description', e.htmlValue);
                                                        formik.setFieldTouched('description', e.htmlValue);
                                                    } else {
                                                        formik.setFieldValue('description', e.htmlValue);
                                                    }
                                                }
                                            }}
                                            style={{ height: '200px' }}
                                            className={classNames({ 'p-invalid': isFormFieldInvalid('description') })}
                                            id="description"
                                            name="description"
                                            maxLength={LIMIT_TEXT + 1}
                                        />
                                        <div className="absolute right-0 bottom-0 px-3 py-2">Số ký tự {lengthText}</div>
                                    </div>
                                    {getFormErrorMessage('description')}
                                </div>
                            </div>
                            <div className="text-center">{isShowPayment ? <Button onClick={hanldNextStep} type="button" label="Tiếp tục" /> : <Button type="submit" label="Tiếp tục" />}</div>
                        </div>
                        {isShowPayment && (
                            <div className={classNames(type == 'order' ? 'show' : 'hidden')}>
                                <div className="flex align-items-center md:flex-row flex-column md:gap-5 justify-content-between">
                                    <div className="md:w-9 w-full">
                                        <h3 className="text-xl mb-3 font-bold">Đặt đơn hàng</h3>
                                        Sau khi "Đặt đơn hàng" số tiền sẽ được hệ thống giữ lại. Nếu KOC không chấp nhận đơn hàng sau 7 ngày kể từ lúc bạn "Đặt đơn hàng" hoặc hai bên không thống nhất được nội dung công việc, thì hệ thống sẽ hoàn lại
                                        tiền vào "Số dư khả dụng" của bạn.
                                        <h3 className="text-xl mb-3 font-bold">{formik?.values?.serviceType}</h3>
                                        <div className="flex mb-2 w-full justify-content-between align-items-center">
                                            Giá dịch vụ
                                            <span>{formatCurrencyVND(formik?.values?.price)}</span>
                                        </div>
                                        <div className="flex mb-2 w-full justify-content-between align-items-center">
                                            <span>
                                                Phí <i className="pi pi-info-circle custom-target-persent ml-2 cursor-pointer vertical-align-middle" autohide="false"></i>
                                            </span>
                                            <Tooltip target=".custom-target-persent">Phí dịch vụ 10% trên mỗi đơn hàng thành công, phí này giúp chúng tôi duy trì nền tảng</Tooltip>
                                            <span>{formatCurrencyVND(Math.floor(formik?.values?.price * 0.1))}</span>
                                        </div>
                                        <div className="flex mb-2 w-full justify-content-between align-items-center">
                                            Tổng giá tiền
                                            <span>{formatCurrencyVND(formik?.values?.price + formik?.values?.price * 0.1)}</span>
                                        </div>
                                        <div className="text-center mt-3">
                                            <Button loading={loading} disabled={loading} onClick={() => Object.keys(formik.errors).length > 0 && setType('request')} type="submit" className="w-full" label="Đặt đơn hàng" />
                                        </div>
                                    </div>
                                    <div className="md:w-3 w-full">
                                        <h3 className="text-lg mb-0 font-bold">Ví của bạn</h3>
                                        <div className="flex mt-2 mb-3 w-full justify-content-between align-items-center">
                                            Số dư của bạn
                                            <span>{formatCurrencyVND(walletBalance)}</span>
                                        </div>
                                        <Button type="button" className="w-full bg-white text-primary" label="Nạp thêm" onClick={() => openModal()} />
                                        <ModalRecharge visible={visible} setVisible={setVisible} />
                                    </div>
                                </div>
                                <div className="w-full md:mt-7 mt-3">
                                    <h3 className="text-xl mb-4 font-bold">Quy trình làm việc</h3>
                                    <div className="flex md:flex-row flex-column justify-content-between gap-4">
                                        <div className="md:w-4 w-full">
                                            <h3 className="text-lg mb-2 font-bold">Bước 1: Đặt đơn hàng</h3>
                                            Sau khi đặt đơn hàng thành công, KOC có tối đa 7 ngày để chấp nhận đơn hàng.
                                            <br />
                                            Nếu KOC không đồng ý hoặc không phản hồi thì số tiền được hệ thống giữ lại sẽ được hoàn lại vào "Số dư khả dụng" của bạn
                                        </div>
                                        <div className="md:w-4 w-full">
                                            <h3 className="text-lg mb-2 font-bold">Bước 2: Nhắn tin với KOC</h3>
                                            Bạn có thể nhắn tin với KOC để trao đổi chi tiết hơn về yêu cầu công việc, thỏa thuân deadline...
                                        </div>
                                        <div className="md:w-4 w-full">
                                            <h3 className="text-lg mb-2 font-bold">Bước 3: Nhận kết quả công việc</h3>
                                            Bạn sẽ nhận được kết quả công việc và có 01 lần yêu cầu chỉnh sửa.
                                            <br />
                                            Khi bạn Đồng ý hoàn thành đơn hàng, số tiền được hệ thống giữ lại ban đầu sẽ được thanh toán cho KOC
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:mt-5 mt-3 md:mb-4">
                                    <h3 className="text-xl mb-4 font-bold">Câu hỏi thường gặp</h3>
                                    <div className="flex md:flex-row flex-column justify-content-between gap-4">
                                        <div className="md:w-6 w-full">
                                            <ul className="list-none pl-0 my-0">
                                                <li onClick={() => handleItemClick(1)} className="cursor-pointer mb-3">
                                                    <h3 className="text-lg font-bold border-bottom-1 mb-3 pb-3 relative pr-4 select-none">
                                                        Sau khi tôi đặt đơn hàng, tiền của tôi sẽ được sử dụng như nào?
                                                        <i className={classNames(activeIndex === 1 ? 'pi-times' : 'pi-plus', 'pi absolute right-0')} style={{ top: '2px' }}></i>
                                                    </h3>
                                                    <div className={classNames(activeIndex === 1 ? '' : 'hidden')}>
                                                        100% tiền sẽ được giữ an toàn ở trung gian là MYKOL và chỉ được thanh toán khi KOC hoàn thành công việc đúng theo yêu cầu của bạn và tuân thủ thời gian quy định.
                                                    </div>
                                                </li>
                                                <li onClick={() => handleItemClick(2)} className="cursor-pointer mb-3">
                                                    <h3 className="text-lg font-bold border-bottom-1 mb-3 pb-3 relative pr-4 select-none">
                                                        Nếu đơn hàng không được thực hiện thành công, tôi có mất phí không?
                                                        <i className={classNames(activeIndex === 2 ? 'pi-times' : 'pi-plus', 'pi absolute right-0')} style={{ top: '2px' }}></i>
                                                    </h3>
                                                    <div className={classNames(activeIndex === 2 ? '' : 'hidden')}>Bạn hoàn toàn không bị mất chi phí nào, nếu đơn hàng không được thực hiện thành công.</div>
                                                </li>
                                                <li onClick={() => handleItemClick(3)} className="cursor-pointer">
                                                    <h3 className="text-lg font-bold border-bottom-1 mb-3 pb-3 relative pr-4 select-none">
                                                        Tôi có quyền hủy đơn hàng và hoàn tiền sau khi đặt không?
                                                        <i className={classNames(activeIndex === 3 ? 'pi-times' : 'pi-plus', 'pi absolute right-0')} style={{ top: '2px' }}></i>
                                                    </h3>
                                                    <div className={classNames(activeIndex === 3 ? '' : 'hidden')}>
                                                        Bạn có quyền hủy đơn hàng chỉ khi KOC không tuân thủ thời hạn Deadline (Ngày mong đợi + 07 ngày). Sau khi hủy đơn hàng, số tiền sẽ được hoàn lại vào Ví của bạn.
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="md:w-6 w-full">
                                            <ul className="list-none pl-0 my-0">
                                                <li onClick={() => handleItemClick(4)} className="cursor-pointer mb-3">
                                                    <h3 className="text-lg font-bold border-bottom-1 mb-3 pb-3 relative pr-4 select-none">
                                                        Ngày mong đợi hoàn thành công việc có ý nghĩa như nào?
                                                        <i className={classNames(activeIndex === 4 ? 'pi-times' : 'pi-plus', 'pi absolute right-0')} style={{ top: '2px' }}></i>
                                                    </h3>
                                                    <div className={classNames(activeIndex === 4 ? '' : 'hidden')}>
                                                        Ngày mong đợi chính là Deadline của công việc và đồng thời cũng là căn cứ để đảm bảo quyền lợi cho 2 bên. Bạn có quyền chỉnh sửa ngày mong đợi.
                                                    </div>
                                                </li>
                                                <li onClick={() => handleItemClick(5)} className="cursor-pointer mb-3">
                                                    <h3 className="text-lg font-bold border-bottom-1 mb-3 pb-3 relative pr-4 select-none">
                                                        Tôi có được yêu cầu KOC chỉnh sửa kết quả làm việc không?
                                                        <i className={classNames(activeIndex === 5 ? 'pi-times' : 'pi-plus', 'pi absolute right-0')} style={{ top: '2px' }}></i>
                                                    </h3>
                                                    <div className={classNames(activeIndex === 5 ? '' : 'hidden')}>Bạn có 01 lần yêu cầu KOC chỉnh sửa kết quả làm việc. Bạn cũng có quyền đánh giá KOC sau khi làm việc xong.</div>
                                                </li>
                                                <li onClick={() => handleItemClick(6)} className="cursor-pointer">
                                                    <h3 className="text-lg font-bold border-bottom-1 mb-3 pb-3 relative pr-4 select-none">
                                                        Tôi có được rút tiền sau khi nạp vào MYKOL không?
                                                        <i className={classNames(activeIndex === 6 ? 'pi-times' : 'pi-plus', 'pi absolute right-0')} style={{ top: '2px' }}></i>
                                                    </h3>
                                                    <div className={classNames(activeIndex === 6 ? '' : 'hidden')}>Bạn hoàn toàn có quyền rút lại tiền. Chúng tôi sẽ chuyển khoản lại cho bạn trong vòng 07 ngày làm việc.</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default RequirementBasic;
