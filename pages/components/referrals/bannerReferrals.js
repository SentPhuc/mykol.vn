import { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ReferralsService } from 'demo/service/Referrals';
import { GlobalService } from 'demo/service/GlobalService';
import { useRouter } from 'next/router';
import { classNames } from 'primereact/utils';

const BannerReferrals = () => {
    const accountId = typeof window !== 'undefined' ? localStorage.getItem('accountId') : null;
    const referrals = new ReferralsService();
    const global = new GlobalService();
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    const router = useRouter();
    const toast = useRef(null);
    const [linkRef, setLinkRef] = useState('');
    const [code, setCode] = useState('');
    const [visible, setVisible] = useState(false);
    const pathName = router.pathname;
    const asPath = router.asPath;
    const kolsInfluencerId = router.query?.id;
    const isDetailCandidate = pathName === '/components/detail-candidate';
    const checkShowEditFoRec = isDetailCandidate && accountId == kolsInfluencerId && role == "KOLIFL";
    
    useEffect(() => {
        if (accountId) {
            referrals
                .getCodeReferrals()
                .then(({ data }) => {
                    if (data?.code === 'success') {
                        setCode(data?.data?.referralCode);
                    }
                })
                .catch((error) => console.error(error));
        } else {
            setCode(undefined);
            // global
            //     .getCodeReferrals(kolsInfluencerId)
            //     .then(({ data }) => {
            //         if (data?.code === 'success') {
            //             setCode(data?.data?.referralCode);
            //         }
            //     })
            //     .catch((error) => console.error(error));
        }
    }, [accountId, kolsInfluencerId]);

    useEffect(() => {
        const url = isDetailCandidate ? process.env.APP_URL + asPath + '&ref=' + code : process.env.APP_URL + '?ref=' + code;
        setLinkRef(url);
    }, [code, pathName, asPath]);

    if (code === undefined) {
        return <></>;
    }

    return (
        <>
            <Toast ref={toast} />
            <div className={classNames(isDetailCandidate ? 'mb-2' : '', 'banner share-banner')}>
                <div className="banner-row flex align-items-center justify-content-between m-auto">
                    <div className="banner-txt-holder">
                        <h1 className="banner-title">Mời nhãn hàng và nhận hoa hồng</h1>
                        <div className="banner-txt">Nhãn hàng do bạn mời chi tiêu càng nhiều, hoa hồng bạn nhận được càng lớn. Hãy sử dụng link sau đây và gửi cho các nhãn hàng bạn nhé!</div>
                    </div>
                    <div onClick={() => setVisible(true)} className="btn banner-btn share-modal-btn">
                        Share Your Link
                    </div>
                </div>
            </div>
            {checkShowEditFoRec && (
                <>
                    <div className="card text-right p-3 pt-0 border-none">
                        <a className="text-lg hover:underline inline-block text-color font-semibold" href="/components/profile" title="Edit">
                            <i className="pi text-xl mr-1 pi-user-edit"></i> Edit
                        </a>
                    </div>
                </>
            )}

            <Dialog draggable={false} header="Share Your Link" headerClassName="text-center text-2xl" visible={visible} onHide={() => setVisible(false)} style={{ width: '100%', maxWidth: '600px' }}>
                <div className="flex flex-row mb-5 mt-3">
                    <InputText value={linkRef} className="w-full opacity-100" disabled type="text" />
                    <Button
                        onClick={() => {
                            window.navigator.clipboard.writeText(linkRef);
                            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Copy thành công' });
                        }}
                        label="Copy"
                        className="ml-2"
                    />
                </div>
            </Dialog>
        </>
    );
};

export default BannerReferrals;
