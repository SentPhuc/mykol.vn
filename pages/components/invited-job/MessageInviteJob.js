import { Dialog } from 'primereact/dialog';

const MessageInviteJob = (props) => {
    const { setVisible, footerContent, data } = props;
    return (
        <div>
            <Dialog header="Lời mời từ nhà tuyển dụng" visible={true} style={{ width: '30vw' }} onHide={() => setVisible(null)}
                    footer={footerContent}
                    breakpoints={{ '960px': '75vw', '641px': '95vw' }}>
                <p className="m-0">
                    { data?.messageInvited}
                </p>
            </Dialog>
        </div>
    );
};
export default MessageInviteJob;