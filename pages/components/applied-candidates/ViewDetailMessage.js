import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const ViewDetailMessage = (props) => {
    const { visibleViewDetailMessage, setVisibleViewDetailMessage, data } = props;
    const footerContent = (
        <div>
            <Button type='button' className="p-button-secondary mr-0 w-120" label="Đóng" icon="pi pi-times" onClick={() => setVisibleViewDetailMessage(false)} />
        </div>
    );

    return (
        <div className="flex justify-content-center">
            <Dialog header="Xem chi tiết lời nhắn" visible={visibleViewDetailMessage} style={{ width: '30vw' }} footer={footerContent} onHide={() => setVisibleViewDetailMessage(false)} breakpoints={{ '960px': '75vw', '641px': '95vw' }}>
                <p className={'font-bold'}>Lời nhắn</p>
                <hr />
                <div>{data?.message}</div>
            </Dialog>
        </div>
    );
};

export default ViewDetailMessage;
