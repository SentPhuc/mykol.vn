import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const ViewContactNow = (props) => {
    const { visibleViewDetailMessage, setVisibleViewDetailMessage, data } = props;
    const footerContent = (
        <div>
            <Button className='p-button-secondary mr-0 w-120' label='Đóng'
                    icon='pi pi-times'
                    onClick={() => setVisibleViewDetailMessage(false)} />
        </div>
    );

    return (
        <div className='card flex justify-content-center'>
            <Dialog header='Liên hệ ngay' visible={visibleViewDetailMessage} style={{ width: '30vw' }} footer={footerContent}
                    onHide={() => setVisibleViewDetailMessage(false)}
                    breakpoints={{ '960px': '75vw', '641px': '95vw' }}
            >
                <p className='m-0'>
                    Chức năng hiện tại chưa phát triển
                </p>
            </Dialog>
        </div>
    );
};

export default ViewContactNow;