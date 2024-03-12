import React, { useEffect, useState } from 'react';
import { DataView } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { DEV_URL } from '../../../src/commons/Utils';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';
import {useRouter} from "next/router";

const ListComment = (props) => {
    const { service, hasNewComment } = props;
    const [listComments, setListComments] = useState([]);

    const evaluationType = 0;

    const pageSizeDefault = 5;
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeDefault);
    const [totalRecords, setTotalRecords] = useState(0);
    const router = useRouter();

    useEffect(async() => {
        if (!router.isReady) {
            return;
        }
        const param = router.query;
        const res = await service.getEvaluationsByCandidates({
            page: page,
            recordPage: pageSizeDefault,
            referenceId: parseInt(param.id),
            evaluationType: evaluationType
        });
        if (res.data.type === 'SUCCESS') {
            setListComments(res.data.data.evaluations);
            setTotalRecords(res.data.data.totalElements);
        }else {
            setListComments([]);
        }
    }, [page, router, hasNewComment]);

    const renderStar = (data) => {
        return data.starRating;
    };

    const onPageChange = (event) => {
        setPage(event.page + 1);
        setPageSize(event.rows);
    };

    if(listComments?.length == 0) return <></>;

    const itemTemplate = (data) => {
        return (
            <div className="col-12">
                <div className="item-list-comment flex flex-wrap xl:align-items-start py-4 gap-4">
                    <Avatar image={`${DEV_URL}${data.accountImage}`} size="large" shape="circle"/>
                    <div
                        className="info-comment flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column w-full align-items-start gap-3">
                            <div className="text-2xl font-bold text-left text-900">{data.accountName}</div>
                            <div className="flex align-items-center">
                                <span className="font-italic status-color mr-2">Đã làm việc</span>
                                <Button icon="pi pi-arrow-right" label="Xem kết quả" iconPos="right"
                                        className="p-button-text"/>
                            </div>
                            <Rating className="star-color" value={renderStar(data)} readOnly cancel={false}></Rating>
                            <div className="flex align-items-center">
                                <span className="flex text-justify">
                                    <span className="font-semibold">{data.evaluation}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <React.Fragment>
                <div className="block-content-detail-candidate lx:w-10 lg:w-10 w-full my-0 mx-auto center-item list-comment-box">
                    <h2 className="font-bold mt-4">Đánh giá KOLs</h2>
                    <DataView
                        value={listComments}
                        itemTemplate={itemTemplate}
                        emptyMessage="KOL này chưa có đánh giá nào"
                    />
                    <Paginator
                        first={page * pageSize - 1}
                        rows={pageSize}
                        totalRecords={totalRecords}
                        onPageChange={onPageChange}
                    />
                </div>
            </React.Fragment>
        </>
    );
};

export default ListComment;