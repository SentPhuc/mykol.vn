import getConfig from 'next/config';
import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    return (
        <>
            <footer className="bg-white shadow-1 pt-3 pb-5">
                <div className="layout-footer grid">
                    <div className="col-12 md:col-4">
                        <img src={`${contextPath}/layout/images/logo.jpg`} alt="InfluX" width="300" />
                        <p className="mb-2 text-xl">Công ty TNHH INFLU X</p>
                        <p className="mb-2 text-xl">Giấy chứng nhận ĐKKD số 0700871355 do Sở Kế hoạch và Đầu tư tỉnh Hà Nam cấp ngày 20/4/2023</p>
                        <p className="mb-2 text-xl">
                            Hotline: <a href="tel:0383050533">0383.050.533</a>
                        </p>
                        <p className="mb-2 text-xl">Email: mykol.vn@gmail.com</p>
                        <p className="mb-2 text-xl">Địa chỉ: Trại Quan Nha, Hòa Mạc, Duy Tiên, Hà Nam</p>
                        <div className="flex mt-3 gap-3">
                            <a href="https://www.facebook.com/influxcompany" target="_blank">
                                <img src={`/demo/images/social/icon-facebook.svg`} alt="facebook" width="50" />
                            </a>
                            <a href="https://www.youtube.com/channel/UCGTfOtd_pxJXIk8wYZyKyBg" target="_blank">
                                <img src={`/demo/images/social/icon-youtube.svg`} alt="youtube" width="50" />
                            </a>
                            <a href="https://www.tiktok.com/@mykol.marketing" target="_blank">
                                <img src={`/demo/images/social/icon-tiktok.svg`} alt="tiktok" width="50" />
                            </a>
                            <a href="https://zalo.me/1666429115208586737" target="_blank">
                                <img src={`/demo/images/social/zalo-icon.png`} alt="zalo" width="50" />
                            </a>
                        </div>
                    </div>
                    <div className="col-12 md:col-8 md:pl-8 info-footer">
                        <h3 className="w-full uppercase md:mb-5 text-center text-4xl title-info-footer">Về mykol</h3>
                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <ul className="list-none my-0 pl-0 text-xl">
                                    <li className="mb-4">
                                        <a className="text-color" href="/landing/introduce" title="Giới thiệu">
                                            Giới thiệu
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a className="text-color" href="/components/contact" title="Liên hệ">
                                            Liên hệ
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a className="text-color" href="/landing/answer-and-question" title="Hỏi đáp">
                                            Hỏi đáp
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a className="text-color" href="/landing/operating-regulations" title="Quy chế hoạt động">
                                            Quy chế hoạt động
                                        </a>
                                    </li>
                                    <li>
                                        <a className="text-color" href="/landing/instructions-creating-profile" title="Hướng dẫn tạo profile">
                                            Hướng dẫn tạo profile
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-12 md:col-6">
                                <ul className="list-none my-0 pl-0 text-xl">
                                    <li className="mb-4">
                                        <a className="text-color" href="/landing/privacy-policy" title="Chính sách bảo mật">
                                            Chính sách bảo mật
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a className="text-color" href="/landing/terms-of-use" title="Điều khoản sử dụng">
                                            Điều khoản sử dụng
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a className="text-color" href="/landing/dispute-resolution" title="Giải quyết tranh chấp">
                                            Giải quyết tranh chấp
                                        </a>
                                    </li>
                                    <li className="mb-4">
                                        <a className="text-color" href="#" title="Chương trình Referrals">
                                            Chương trình Referrals
                                        </a>
                                    </li>
                                    <li>
                                        <a className="text-color" href="/landing/refund-policy" title="Chính sách hoàn tiền">
                                            Chính sách hoàn tiền
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='px-3 text-center pt-2'><i>Website đang chạy chế độ thử nghiệm, chờ cấp phép từ Bộ Công Thương</i></div>
            </footer>
        </>
    );
};

export default AppFooter;
