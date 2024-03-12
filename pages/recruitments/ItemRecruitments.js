import getConfig from 'next/config';
import moment from 'moment';
import { DEV_URL } from 'src/commons/Utils';
export default function ItemRecruitments({ data }) {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    if (!data?.id) return <></>;
    const expiredDate = Math.floor(moment.duration(moment(data?.expirationDate).diff(moment())).asDays());

    return (
        <div className="item-recruitments cursor-pointer col-12 p-3 md:col-6">
            <div className="p-4 shadow-2 box">
                <div className="box-info flex flex-wrap">
                    <img width={116} height={120} src={!!data?.imageCover ? DEV_URL + data?.imageCover : `${contextPath}/demo/images/avatar/no-avatar.png`} alt={data?.jobTitle} />
                    <div className="info">
                        <a target='_blank' href={`/recruitments/${data?.mask}/${data?.id}`} title={data?.jobTitle} className="title">
                            <h3 className="line-clamp-1">{data?.jobTitle}</h3>
                        </a>
                        <div className="tag-info mb-1 md:mb-2">
                            {expiredDate < 0 ? <span>Hết hạn</span> : <span>Còn {expiredDate} ngày</span>}
                            <span>
                                Đã ứng tuyển: {data?.applyCount ?? 0}/{data?.quantity ?? 0}
                            </span>
                            {data?.hasProductSample && <span>Có sản phẩm mẫu miễn phí</span>}
                        </div>
                        <div className="desc">
                            <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: data?.description }}></div>
                            <a target='_blank' href={`/recruitments/${data?.mask}/${data?.id}`} title="Xem thêm">
                                Xem thêm
                            </a>
                        </div>
                    </div>
                </div>
                <div className="footer-recruitments flex mt-1 md:mt-2 flex-wrap">
                    {data?.careerFields?.length > 0 && (
                        <div className="tag">
                            {data?.careerFields?.map((careerField, index) => {
                                return <span key={index}>{careerField}</span>;
                            })}
                        </div>
                    )}

                    <a target='_blank' href={`/recruitments/${data?.mask}/${data?.id}`} title="Xem chi tiết">
                        Xem chi tiết
                    </a>
                </div>
            </div>
        </div>
    );
}
