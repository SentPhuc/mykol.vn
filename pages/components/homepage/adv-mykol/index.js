import getConfig from 'next/config';
import { classNames } from 'primereact/utils';
import { isShowPayment } from 'src/commons/Utils';

export default function AdvMykol() {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const listAdvMykol = [
        {
            link: 'https://www.tiktok.com/@judythemarketer/video/7325437660087061762',
            image: contextPath + '/demo/images/KOL/kol-1.png'
        },
        {
            link: 'https://www.tiktok.com/@xuan_affiliate/video/7327267593713175826',
            image: contextPath + '/demo/images/KOL/kol-2.png'
        },
        {
            link: 'https://www.tiktok.com/@_tuanhoang_/video/7327633546410052871',
            image: contextPath + '/demo/images/KOL/kol-3.png'
        },
        {
            link: 'https://www.tiktok.com/@vietnamdigitalreview/video/7304294909362654466',
            image: contextPath + '/demo/images/KOL/kol-4.png'
        },
        {
            link: 'https://www.tiktok.com/@judythemarketer/video/7305023638900575490',
            image: contextPath + '/demo/images/KOL/kol-5.png'
        }
    ];

    return (
        <div id="adv-mykol" className={classNames(isShowPayment ? '' : 'md:pt-5 mt-2', 'w-full')}>
            <div className="container">
                <h3 className="title-home">Mọi người nhắc về chúng tôi</h3>
                <p className="desc-home">Hàng trăm chuyên gia marketing, người có ảnh hưởng, báo chí tin tưởng chúng tôi</p>
                <div className="flex md:flex-row flex-column box-adv-mykol">
                    {listAdvMykol.map((value, index) => {
                        return (
                            <a target="_blank" key={index} href={value.link} className="relative item-adv-mykol cursor-pointer w-full">
                                <div className="hover-zoom image">
                                    <img className="max-w-full w-full" alt={value.link} src={value.image} />
                                </div>
                            </a>
                        );
                    })}
                </div>
                <div className="text-center cursor-pointer">
                    <img className="max-w-full w-full" src={contextPath + '/demo/images/home/logo-partner.jpg'} alt="mykol" />
                </div>
            </div>
        </div>
    );
}
