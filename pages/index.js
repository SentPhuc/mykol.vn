import React, { useEffect, useRef } from 'react';
import 'primereact/resources/primereact.min.css';
import SearchKOL from './components/homepage/search-kol';
import { useDispatch } from 'react-redux';
import { login } from '../public/reduxConfig/authSlice';
import { useRouter } from 'next/router';
import { isShowPayment, nameCookieRef } from 'src/commons/Utils';
import { GlobalService } from 'demo/service/GlobalService';
import { setCookie, getCookie } from 'src/commons/Function';
import { Toast } from 'primereact/toast';
import MykolWoking from './components/homepage/mykol-woking';
import AdvMykol from './components/homepage/adv-mykol';
import BrandWoking from './components/homepage/brand-woking';
import QuestionAndAnswer from './components/homepage/question-and-answer';
import CareersHome from './components/homepage/careers-home';
import ListCareers from './components/homepage/list-careers';
import Careers from './components/homepage/Careers';
import TheRecruitment from './components/homepage/TheRecruitment';

const Dashboard = () => {
    const globalService = new GlobalService();
    const toast = useRef(null);
    const router = useRouter();
    const ref = router?.query?.ref;
    const dispatch = useDispatch();

    const isRoleEqualRecruitment = () => {
        const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
        return role == 'REC';
    };

    const checkLogin = () => {
        if (window.localStorage.getItem('accessToken')) {
            dispatch(login());
        }
    };

    useEffect(() => {
        checkLogin();
    }, [dispatch]);

    useEffect(() => {
        if (!!ref) {
            globalService
                .postClickReferals({
                    referralCode: ref ?? '',
                    cookie: getCookie(nameCookieRef) ?? ''
                })
                .then((data) => {
                    if (data?.data?.code === 'success') {
                        if (data?.data?.message === 'Referral code is not found') {
                            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Referral code is not found' });
                            router.push('/');
                            return;
                        }
                        setCookie(nameCookieRef, ref, 30);
                    }
                })
                .catch((error) => console.error(error));
        }
    }, [ref]);

    return (
        <div className="grid m-0 index-homepage">
            <Toast ref={toast} />
            <TheRecruitment />
            {/* <Recruitment /> */}
            <SearchKOL />
            {/* <BannerKol /> */}
            <Careers />
            <ListCareers />
            <CareersHome />
            {isShowPayment && <MykolWoking />}
            <AdvMykol />
            <BrandWoking />
            <QuestionAndAnswer />
        </div>
    );
};

export default Dashboard;
