import React from 'react';
import { TabPanel, TabView } from 'primereact/tabview';
import BreadcrumbCustom from '../../commons/BreadcrumbCustom';
import { useRouter } from 'next/router';
import CV from './CV';
import CardVisit from './CardVisit';
import AppLayout from '../../../layout/AppLayout';

const DownloadProfile = () => {
    const location = useRouter().pathname;

    return AppLayout(
        <>
            <BreadcrumbCustom path={location} /><br />
            <TabView>
                <TabPanel header='Xem trước CV' leftIcon='pi pi-eye mr-2'>
                    <CV />
                </TabPanel>
                <TabPanel header='Xem trước danh thiếp' leftIcon='pi pi-credit-card mr-2'>
                    <CardVisit />
                </TabPanel>
            </TabView>
        </>
    );
};

export default DownloadProfile;