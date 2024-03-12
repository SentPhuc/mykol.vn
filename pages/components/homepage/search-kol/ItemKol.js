import { formatViewsThousand, formatCurrencyVND, DEV_URL } from 'src/commons/Utils';
import getConfig from 'next/config';
import { classNames } from 'primereact/utils';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';
import { useRef } from 'react';

const ItemKol = ({ data, handleShowProfile, template, showSocial = false }) => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const urlDetailCandidate = data?.mask && data?.id ? `/components/detail-candidate/?mask=${data?.mask}&id=${data?.id}` : '';
    const op = useRef(null);
    const refZalo = useRef(null);

    const onCopyHandler = async (dataCopy) => {
        await navigator.clipboard.writeText(dataCopy);
        toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Copy to clipboard', life: 3000 });
    };

    return (
        <>
            <div className={classNames(!!template && template > 0 ? 'md:col-4' : 'md:col-3', 'item-kol cursor-pointer sm:col-6 col-12 p-3')}>
                <a target="_blank" className="block" href={urlDetailCandidate} title={data?.name}>
                    <div className="image text-center relative border-round-xl overflow-hidden">
                        <div className="followers align-items-center text-white absolute border-round-3xl flex">
                            <img className="mr-1 border-circle" width="22" height="22" src={`${contextPath}/demo/images/social/icon-tiktok.svg`} />
                            {formatViewsThousand(data?.followers)}
                        </div>
                        {data?.profileImage ? (
                            <img width="270" height="330" className="max-w-full w-full vertical-align-middle" src={DEV_URL + data?.profileImage} loading="lazy" alt={data?.name} />
                        ) : (
                            <img width="270" height="330" className="max-w-full vertical-align-middle" src={`${contextPath}/demo/images/avatar/no-avatar.png`} loading="lazy" alt={data?.name} />
                        )}

                        <div className="title text-left px-4 pb-4 w-full absolute">
                            <h3 className="name text-white capitalize mb-0 line-clamp-1">{data?.name}</h3>
                            <span className="city text-white">{data?.city}</span>
                        </div>
                    </div>
                </a>
                <div className="info mt-2 flex justify-content-between flex-wrap align-items-center">
                    <div className="social flex align-items-center">
                        <a href={data?.tiktokUrl} target="_blank" title="tiktok">
                            <img width="22" height="22" src={`${contextPath}/demo/images/social/icon-tiktok.svg`} />
                        </a>
                        <span className="ml-1" onClick={() => handleShowProfile(data)}>
                            <img width="29" height="27" src={`${contextPath}/demo/images/home/icon-analytics.png`} />
                        </span>
                    </div>
                    {showSocial && (
                        <div className="social">
                            {data?.contactPhone && <img onClick={(e) => refZalo.current.toggle(e)} width={22} height={22} src={`${contextPath}/demo/images/kolInfo/zalo.svg`} alt="Kols" className="max-w-full md:w-auto vertical-align-middle" />}
                            {data?.contactEmail && <img onClick={(e) => op.current.toggle(e)} width={22} height={22} src={`${contextPath}/demo/images/kolInfo/gmail.svg`} alt="Kols" className="max-w-full md:w-auto mx-2 vertical-align-middle" />}
                            {/* {!!data?.isChat && !!data?.chatBoxId && (
                                <i
                                    style={{ fontSize: '19px' }}
                                    className="max-w-full md:w-auto vertical-align-middle pi pi-comments"
                                    onClick={() => window.open(`/components/chat-box?chatBoxId=${data?.chatBoxId}`, '_blank', 'noopener,noreferrer')}
                                ></i>
                            )} */}
                        </div>
                    )}

                    <div className="price">{formatCurrencyVND(data?.bookingPrice)}</div>
                </div>
                <div className="careers line-clamp-2">{data?.careers}</div>
            </div>

            {showSocial && (
                <>
                    <OverlayPanel ref={op}>
                        <div className="grid w-full align-items-center">
                            <div className="col-3">
                                <div className="text-left ">Email:</div>
                            </div>
                            <div className="w-full">
                                <div className="box-copy shadow-2 flex align-items-center">
                                    <div className="pl-0 url-copy">
                                        <InputText value={data?.contactEmail} disabled className={'w-full'}></InputText>
                                    </div>
                                    <div className="btn-copy-inner" onClick={() => onCopyHandler(data?.contactEmail)}>
                                        <i className="pi pi-copy" style={{ fontSize: '1rem' }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </OverlayPanel>
                    <OverlayPanel ref={refZalo}>
                        <div className="grid w-full align-items-center">
                            <div className="col-3">
                                <div className="text-left ">Zalo:</div>
                            </div>
                            <div className="w-full">
                                <div className="box-copy shadow-2 flex align-items-center">
                                    <div className="pl-0 url-copy">
                                        <InputText value={data?.contactPhone} disabled className={'w-full'}></InputText>
                                    </div>
                                    <div className="btn-copy-inner" onClick={() => onCopyHandler(data?.contactPhone)}>
                                        <i className="pi pi-copy" style={{ fontSize: '1rem' }}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </OverlayPanel>
                </>
            )}
        </>
    );
};

export default ItemKol;
