import getConfig from 'next/config';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const ContactPage = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const toastCopy = useRef(null);
    const onCopyHandler = async (email) => {
        await navigator.clipboard.writeText(email);
        toastCopy.current.show({ severity: 'success', summary: 'Thành công', detail: 'Copy to clipboard', life: 3000 });
    };

    return (
        <div id="contact" className="md:p-5">
            <Toast ref={toastCopy} position="top-right" />
            <h3 className="text-center text-4xl font-bold mb-3 md:mb-5">Liên hệ</h3>
            <div className="grid">
                <div className="md:col-8 col-12 md:pr-4">
                    <div className="bg-white h-full p-5">
                        <p>Vui lòng liên hệ với chúng tôi thông qua các kênh sau: </p>
                        <p>
                            <span className="inline-block w-7rem">Hotline / Zalo:</span>
                            <input onClick={() => onCopyHandler("0383050533")} className="border-none outline-none text-blue-400 cursor-pointer" type="text" readOnly value="0383050533" />
                        </p>
                        <p>
                            <span className="inline-block w-7rem">Email:</span>
                            <a target="_blank" className="text-blue-400" href="mailto:support@influx.vn">
                                support@influx.vn
                            </a>
                        </p>
                        <p>
                            <span target="_blank" className="inline-block w-7rem">
                                Website:
                            </span>
                            <a href="https://influx.vn" className="text-blue-400">
                                influx.vn
                            </a>
                        </p>
                        <p>
                            <span target="_blank" className="inline-block w-7rem">
                                Fanpage:
                            </span>
                            <a href="https://www.facebook.com/influxcompany" className="text-blue-400">
                                InfluX - Nền Tảng Booking Influencer, KOL, KOC
                            </a>
                        </p>
                        <p>
                            <span className="inline-block w-7rem">
                                Group:
                            </span>
                            <a target="_blank" href="https://www.facebook.com/groups/letsvietketnoikol" className="text-blue-400">
                                InfluX - Nền Tảng Booking Influencer, KOL, KOC
                            </a>
                        </p>
                        <p>
                            <span target="_blank" className="inline-block w-7rem">
                                Youtube:
                            </span>
                            <a href="https://www.youtube.com/@Influxvn" className="text-blue-400">
                                InfluX - Nền tảng booking Influencer, KOC, KOL
                            </a>
                        </p>
                    </div>
                </div>
                <div className="col-4 hidden md:block">
                    <img src={`${contextPath}/demo/images/avatar/contact.png`} className="max-w-full" alt={'img'} />
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
