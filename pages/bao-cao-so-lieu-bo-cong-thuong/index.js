import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { GlobalService } from 'demo/service/GlobalService';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '/public/reduxConfig/authSlice';
import { closePopupLogin, openPopupLogin } from '/public/reduxConfig/loginSlice';

export default function ReportData() {
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

    const global = new GlobalService();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [dataReport, setDataReport] = useState({});
    const setOpenLoginDialog = (open) => {
        dispatch(open ? openPopupLogin() : closePopupLogin());
    };
    const checkLogin = () => {
        if (window.localStorage.getItem('accessToken')) {
            setOpenLoginDialog(false);
            return true;
        } else {
            setOpenLoginDialog(true);
            return false;
        }
    };
    useEffect(() => {
        if (checkLogin()) {
            global
                .getReportData()
                .then((data) => {
                    if (data.data.code == 'success') {
                        console.log(data.data.data);
                        setDataReport(data.data.data);
                    }
                })
                .catch((error) => console.error(error));
            setLoading(true);
        }
    }, [isLoggedIn]);

    return (
        <div id="report-data">
            <div className="row page-wrapper">
                <div id="content" className="large-12 col" role="main">
                    <header className="entry-header text-center">
                        <h1 className="entry-title text-3xl font-semibold mb-4">Báo cáo số liệu Bộ Công Thương</h1>
                    </header>

                    <div className="entry-content">
                        <div className="protected-content text-lg">
                            <p>
                                Từ ngày: <b>01-01-2024</b> - đến thời điểm truy cập hiện tại <b>{loading && moment().format('hh:mm, DD-MM-YYYY')}</b>
                            </p>
                            <p className="text-lg">
                                <i>
                                    Website bắt đầu hoạt động từ ngày: <b>01-01-2024</b>
                                </i>
                            </p>
                            <table className="table-data">
                                <thead>
                                    <tr>
                                        <th className="uppercase text-left text-lg">Tiêu chí</th>
                                        <th className="uppercase text-left text-lg">Giá trị</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Số lượng truy cập</td>
                                        <td>{dataReport?.totalAccess}</td>
                                    </tr>
                                    <tr>
                                        <td>Số lượng người bán</td>
                                        <td>{dataReport?.totalKoc}</td>
                                    </tr>
                                    <tr>
                                        <td>Số lượng người bán mới</td>
                                        <td>{dataReport?.totalNewKoc}</td>
                                    </tr>
                                    <tr>
                                        <td>Tổng số sản phẩm</td>
                                        <td>{dataReport?.totalProduct}</td>
                                    </tr>
                                    <tr>
                                        <td>Số sản phẩm mới</td>
                                        <td>{dataReport?.totalNewProduct}</td>
                                    </tr>
                                    <tr>
                                        <td>Số lượng giao dịch</td>
                                        <td>{dataReport?.totalOrder}</td>
                                    </tr>
                                    <tr>
                                        <td>Tổng số đơn hàng thành công</td>
                                        <td>{dataReport?.totalSuccessOrder}</td>
                                    </tr>
                                    <tr>
                                        <td>Tổng số đơn hàng không thành công</td>
                                        <td>{dataReport?.totalFailOrder}</td>
                                    </tr>
                                    <tr>
                                        <td>Tổng giá trị giao dịch</td>
                                        <td>{dataReport?.totalOrderVenue}</td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* <h4 data-text-color="alert">
                                <b>LƯU Ý:</b> nội dung trên trang này chỉ là ví dụ minh họa, các số ở cột GIÁ TRỊ là số làm mẫu, còn số thực tế để báo cáo với Bộ Công Thương phải là số lấy theo thực tế của website, ứng dụng đó.
                                <br />
                                Ví dụ: Số lượng truy cập 5000, và có thêm 1 người truy cập nữa sẽ tăng lên 5001. Tương tự cho các số còn lại.
                            </h4> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
