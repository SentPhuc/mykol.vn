import { GlobalService } from 'demo/service/GlobalService';
import { useState, useEffect } from 'react';
import ItemRecruitments from 'pages/recruitments/ItemRecruitments';
import { DataView } from 'primereact/dataview';
import TitleRecruitment from './TitleRecruitment';

export default function TheRecruitment() {
    const global = new GlobalService();
    const [recruitments, setRecruitments] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        global
            .getRecruitments({
                keyword: '',
                hasProductSample: false,
                careerCodes: null,
                page: 1,
                recordPage: 8,
                sorting: ''
            })
            .then((data) => {
                if (data?.data?.type == 'SUCCESS') {
                    setRecruitments(data?.data?.data?.content);
                }
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, []);

    const TemplatePage = (rowData) => {
        return <ItemRecruitments data={rowData} />;
    };

    return (
        <div id="theRecruitment" className="w-full">
            <div className="container">
                <TitleRecruitment />
                <DataView loading={loading} value={recruitments} itemTemplate={TemplatePage} />
                <div className="footer-theRecruitment text-center">
                    <a href="/recruitments" title="Xem tất cả">
                        <span>
                            Xem tất cả <img src="/demo/images/home/icon-arr-view-more.png" alt="Xem tất cả" />
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
}
