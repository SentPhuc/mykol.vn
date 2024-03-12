import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { ProgressBar } from 'primereact/progressbar';
import { GlobalService } from '../../../demo/service/GlobalService';
import ReviewCandidateForm from './ReviewCandidateForm';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../public/reduxConfig/authSlice';
import { useRouter } from 'next/router';

const ReviewCandidate = (props) => {
    const { kolName, accountId, hasNewComment, setHasNewComment } = props;
    const service = new GlobalService();
    const [ratingList, setRatingList] = useState([]);
    const [progressBarValues, setProgressBarValues] = useState([]);
    const [numberOfRating, setNumberOfRating] = useState(0);
    const [averageOfRating, setAverageOfRating] = useState(0);
    const [openReviewDialog, setOpenReviewDialog] = useState(false);
    const router = useRouter();

    const isRoleEqualRecruitment = () => {
        const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
        return role == 'REC';
    };

    const loggedIn = useSelector((state) => state.auth.isLoggedIn) && isRoleEqualRecruitment();
    const dispatch = useDispatch();

    const checkLogin = () => {
        if (window.localStorage.getItem('accessToken')) {
            dispatch(login());
        }
    };

    useEffect(() => {
        checkLogin();
    }, [dispatch]);

    useEffect(async () => {
        if (!router.isReady) {
            return;
        }
        const param = router.query;
        const res = await service.getRatingByAccountId({ referenceId: parseInt(param.id), evaluationType: 0 });
        if (res.data.type === 'SUCCESS') {
            setRatingList(res?.data?.data);
            const totalRecords = res?.data?.data.reduce((acc, { total }) => acc + total, 0);
            setNumberOfRating(totalRecords);
            createRatingMap(res?.data?.data);
            setAverageOfRating(calculateRating(res?.data?.data));
        } else {
            setRatingList([]);
        }
    }, [router, hasNewComment]);

    const calculateRating = (data) => {
        if (data.length == 0) return 0;
        const sumOfRatings = data.reduce((acc, rating) => acc + rating.starNumber * rating.total, 0);
        const totalRatings = data.reduce((acc, rating) => acc + rating.total, 0);
        var average = sumOfRatings / totalRatings;
        average = Math.floor(average * 100) / 100;
        return average.toFixed(1);
    };

    const createRatingMap = (data) => {
        const progressBarValues = [];
        for (let i = 5; i >= 1; i--) {
            const rating = data.find((item) => item.starNumber === i);
            const value = rating?.total || 0;
            progressBarValues.push({ numberStar: i, value });
        }
        setProgressBarValues(progressBarValues);
    };

    return (
        <>
            <React.Fragment>
                <div className="candidate-price-service">
                    <h2 className="font-bold text-center">Đánh giá</h2>
                    <div className="grid">
                        <div className="col text-center justify-content-center mx-0 my-auto">
                            <p>Đánh giá trung bình</p>
                            <p className="avg-star-text font-bold">{averageOfRating || 0}/5</p>
                            <Rating className="justify-content-center" value={averageOfRating || 0} readOnly cancel={false} />
                            <p className="mt-3">{numberOfRating} đánh giá</p>
                        </div>
                        <div className="col">
                            <div className="flex flex-wrap gap-3">
                                {progressBarValues.map((e, index) => (
                                    <div key={index} className="grid w-full flex align-items-center">
                                        <div className="col-3">
                                            <span>
                                                {e.numberStar} <i className="pi pi-star-fill" style={{ color: '#FBBF24' }}></i>
                                            </span>
                                        </div>
                                        <div className="col-9">
                                            <ProgressBar color={'#34D399'} showValue={false} mode={'determinate'} className="color-progess-bar" value={e.value} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* {(loggedIn && isRoleEqualRecruitment()) &&
                            <div className="col text-center">
                                <p>Bạn từng làm việc với <span className="primary-color font-bold">{kolName} ?</span>
                                </p>
                                <Button label="Gửi đánh giá"
                                        className="p-button advanced-filter"
                                        onClick={() => {setOpenReviewDialog(true);
                                        }}/>
                                <ReviewCandidateForm
                                    fullName={kolName}
                                    kolId={accountId}
                                    openReviewDialog={openReviewDialog}
                                    setOpenReviewDialog={setOpenReviewDialog}
                                    hasNewComment={hasNewComment}
                                    setHasNewComment={setHasNewComment}
                                />
                            </div>
                        } */}
                    </div>
                </div>
            </React.Fragment>
        </>
    );
};

export default ReviewCandidate;
