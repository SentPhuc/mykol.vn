import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { RoleService } from '../../../demo/service/RoleService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const ViewDetailsRole = (props) => {
    const {
        visibleViewDetailsRole,
        setVisibleViewDetailsRole,
        cloneData,
    } = props;

    const [nodes, setNodes] = useState([]);

    const service = new RoleService();

    useEffect(async () => {
        if (visibleViewDetailsRole) {
            const res = await service.findById(cloneData.id);
            if (res.data.code == 'success') {
                setNodes(res.data.data.roleAttributeDetailResponses);
            }
        }
    }, [visibleViewDetailsRole]);

    return (
        <>
            <React.Fragment>
                <Dialog header='Xem chi tiết danh sách quyền' visible={visibleViewDetailsRole} maximizable
                        style={{ width: '30vw' }}
                        onHide={() => setVisibleViewDetailsRole(false)}>
                    <div className='flex flex-column align-items-center'>
                        <DataTable value={nodes} className='w-full' emptyMessage='Không có dữ liệu'>
                            <Column field="id" header="ID"></Column>
                            <Column field="name" header="Tên"></Column>
                            <Column field="description" header="Miêu tả"></Column>
                        </DataTable>
                    </div>
                </Dialog>
            </React.Fragment>
        </>
    );
};

export default ViewDetailsRole;