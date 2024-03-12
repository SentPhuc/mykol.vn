import React, { useEffect, useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { NotificationService } from '../../../demo/service/NotificationService';
import getConfig from 'next/config';
import { Avatar } from 'primereact/avatar';
import moment from 'moment';
import axios from 'axios';

const Notifications = (props) => {
    const [listNotifications, setListNotifications] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [updateIsReadNotification, setUpdateIsReadNotification] = useState(false);
    const service = new NotificationService();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const { notificationOp, isLogin } = props;
    // const notificationOp = useRef(null);
    const toast = useRef(null);
    const isMounted = useRef(false);
    const notificationService = new NotificationService();

    useEffect(() => {
        if (isMounted.current && selectedNotification) {
            notificationOp.current.hide();
            if (selectedNotification.isRead) {
                const cloneSelectedNotification = Object.assign({}, selectedNotification, { isRead: false });
                service.saveOrUpdate(cloneSelectedNotification);
                toast.current.show({
                    severity: 'success',
                    summary: 'Bạn đã đọc thông báo này',
                    detail: selectedNotification.name,
                    life: 3000
                });
                setUpdateIsReadNotification(true);
            }
        }
    }, [selectedNotification]);

    useEffect(() => {
        const fetchNotifications = async() => {
            const accountId = typeof window !== 'undefined' ? localStorage.getItem('accountId') : null;
            if (accountId != null) {
                isMounted.current = true;
                const res = await service.search({
                    accountId: accountId
                });
                if (res.data.code === 'success') {
                    let content = res.data.data.content;
                    setListNotifications(content);
                } else {
                    setListNotifications([]);
                }
            }
            setUpdateIsReadNotification(false);
        };
        const interval = setInterval(fetchNotifications, 3000);
        return () => clearInterval(interval);
    }, [isLogin, updateIsReadNotification]);

    const imageBody = (rowData) => {
        return <Avatar image={`${contextPath}/layout/images/favicon.png`} size="normal" shape="circle" style={{ border: '1px solid black' }} />;
    };

    const contentBody = (rowData) => {
        return (
            <div className={rowData.isRead ? 'is_read' : 'is_not_read'}>
                <p>{rowData.description}</p>
                <p>{moment(rowData.createdTime).format('DD/MM/YYYY')}</p>
            </div>
        );
    };

    const setAllNotificationRead = () => {
        const response = notificationService.setAllNotificationRead();
        props.setUnReadCount(0);
    }

    return (
        <div>
            <Toast ref={toast} />
            <OverlayPanel ref={notificationOp} className="custom-notification" onShow={() => setAllNotificationRead()}>
                <DataTable
                    scrollable
                    value={listNotifications}
                    paginator
                    rows={5}
                    emptyMessage="Không có thông báo mới"
                    selection={selectedNotification}
                    onSelectionChange={(e) => setSelectedNotification(e.value)}
                >
                    <Column header="Thông báo" body={imageBody} headerStyle={{maxWidth:'100%'}} style={{ maxWidth: '4rem' }} />
                    <Column field="price" header={null} body={contentBody} headerStyle={{minWidth:'auto'}} style={{ minWidth: '5rem' }} />
                </DataTable>
            </OverlayPanel>
        </div>
    );
};

export default Notifications;
