import { Dialog } from 'primereact/dialog';
import { KolRecruitmentService } from 'demo/service/KolRecruitmentService';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openPopupLogin } from 'public/reduxConfig/loginSlice';

export default function PopupContact({ visible, setVisible, recruitmentDetail, setCreateInterested }) {
    const recruitmentService = new KolRecruitmentService();
    const accountProfile = useSelector((state) => state.profiles);
    const loggedIn = useSelector((state) => state.auth.isLoggedIn);
    const toast = useRef(null);
    const dispatch = useDispatch();

    const onSendMessage = async (recruitmentId) => {
        if (!loggedIn) {
            dispatch(openPopupLogin());
            return;
        }

        /**
         * Check user match with platfrom the job
         */
        const acc = accountProfile?.[0];

        if (acc?.fullName == null || acc?.phoneNumber == null || acc?.email == null || acc?.careerFields.length == 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: 'Bạn cần hoàn thành hồ sơ trước khi ứng tuyển công việc',
                life: 2000
            });
            setTimeout(() => {
                window.location.href = "/components/profile";
            }, 2000);
            return;
        }

        const res = await recruitmentService.onSendMessage({ id: recruitmentId });
        if (res.data.code === 'success') {
            setCreateInterested((pre) => !pre);
            toast.current.show({
                severity: 'success',
                summary: 'Thông báo',
                detail: res.data.message,
                life: 1000
            });
            //open new tab to chat
            window.open('/components/chat-box');
        } else {
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: res.data.message,
                life: 2000
            });
        }
    };

    const handleCopyText = (data) => {
        navigator.clipboard.writeText(data);
        toast.current.show({
            severity: 'success',
            summary: 'Thông báo',
            detail: 'Copy thành công',
            life: 2000
        });
    };

    return (
        <>
            <Toast ref={toast} />
            <Dialog header="Liên hệ với nhãn hàng" visible={visible} style={{ width: '100%', maxWidth: '310px' }} onHide={() => setVisible(false)}>
                <ul className="list-none select-none pl-0 my-0 cursor-pointer text-lg" style={{ lineHeight: '2.5' }}>
                    <li className="hover:text-primary">
                        <span className="inline-block" style={{ width: '90%' }}>
                            Số điện thoại (Zalo): {recruitmentDetail?.contactPhone}
                        </span>{' '}
                        <i className="pi text-xl pi-book" onClick={() => handleCopyText(recruitmentDetail?.contactPhone)}></i>
                    </li>
                    <li className="hover:text-primary">
                        <span className="inline-block" style={{ width: '90%' }}>
                            Email: {recruitmentDetail?.contactEmail}
                        </span>{' '}
                        <i className="pi text-xl pi-book" onClick={() => handleCopyText(recruitmentDetail?.contactEmail)}></i>
                    </li>
                    <li className="hover:text-primary" onClick={() => onSendMessage(recruitmentDetail?.id)}>
                        <span className="inline-block" style={{ width: '90%' }}>
                            Gửi tin nhắn hệ thống{' '}
                        </span>{' '}
                        <i className="pi text-xl pi-send"></i>
                    </li>
                </ul>
            </Dialog>
        </>
    );
}
