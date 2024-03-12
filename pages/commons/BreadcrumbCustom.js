import React, { useEffect, useState } from 'react';
import { BreadCrumb } from 'primereact/breadcrumb';
import PathMapper from '../../src/commons/PathMapper';
import { GlobalService } from '../../demo/service/GlobalService';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const BreadcrumbCustom = (props) => {
    const [items, setItems] = useState();
    const home = { icon: 'pi pi-home', url: '/' };
    const router = useRouter();
    const [recruitmentDetail, setRecruitmentDetail] = useState({});
    const [candidate, setCandidate] = useState({});
    const loggedIn = useSelector((state) => state.auth?.isLoggedIn);
    const getJobTitle = async () => {
        const service = new GlobalService();
        if (props.path.includes('/recruitments/[mask]/[id]')) {
            const { id, mask } = router.query;
            if (!id && !mask) return;
            
            const res = await service.findRecruitmentDetailByMask(mask, id, loggedIn);
            if (res.data.code === 'success') {
                const content = res.data.data;
                setRecruitmentDetail(content);
            }
        } else if (props.path.includes('/detail-candidate')) {
            const url = window.location.href;
            const parts = url.split('?');
            const params = parts[1].split('&');
            const mask = params[0].split('=')[1];
            const id = params[1].split('=')[1];
            const res = await service.getDetailKols(mask, id);
            if (res.data.code === 'success') {
                const content = res.data.data;
                setCandidate(content);
            }
        }
    };

    useEffect(async () => {
        await getJobTitle();
    }, []);

    useEffect(async () => {
        let label = PathMapper.get(props.path);

        if (props.path.includes('/recruitments/[mask]/[id]') && recruitmentDetail?.jobTitle) {
            if (label.length <= 1) {
                label.push({
                    label: recruitmentDetail.jobTitle
                });
            } else {
                label.splice(1, 1, {
                    label: recruitmentDetail.jobTitle
                });
            }
            setItems(label);
            return;
        } else if (props.path.includes('/detail-candidate') && candidate.fullName) {
            label = PathMapper.get(props.path);
            label.splice(1);
            label.push({
                label: candidate.fullName
            });
            setItems(label);
            return;
        }

        setItems(label);
    }, [recruitmentDetail, candidate]);

    return <BreadCrumb model={items} home={home} />;
};

export default BreadcrumbCustom;
