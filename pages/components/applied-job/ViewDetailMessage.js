import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { formatPriceVnd } from '../../../src/commons/Utils';

const ViewDetailMessage = (props) => {
    const { visibleViewDetailMessage, setVisibleViewDetailMessage, data } = props;
    console.log({ data });
    const footerContent = (
        <div>
            <Button className="p-button-secondary mr-0 w-120" label="Đóng" icon="pi pi-times" onClick={() => setVisibleViewDetailMessage(false)} />
        </div>
    );

    return (
        <div className="flex justify-content-center">
            <Dialog header="Xem chi tiết lời nhắn" visible={visibleViewDetailMessage} style={{ width: '30vw' }} footer={footerContent} onHide={() => setVisibleViewDetailMessage(false)} breakpoints={{ '960px': '75vw', '641px': '95vw' }}>
                <p className={'font-bold'}>Giá cast đề xuất</p>
                <hr />
                <div>{formatPriceVnd(data?.castingPrice)}</div>
                <hr />
                <p className={'font-bold'}>Lời nhắn</p>
                <hr />
                <div>{data?.message}</div>
            </Dialog>
        </div>
    );
};

export default ViewDetailMessage;
