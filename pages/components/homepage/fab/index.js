import getConfig from 'next/config';
import { useRef } from 'react';
const FabButton = () => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    return (
        <>
            <div id="fb-chat">
                <a href="https://www.messenger.com/t/influxcompany" target="_blank">
                    <img src={`/demo/images/social/fb-icon.png`} alt="fb-icon" />
                </a>
            </div>
            <div id="zalo-fixed">
                <a href="https://zalo.me/1666429115208586737" target="_blank">
                    <img src={`/demo/images/social/zalo-icon.png`} alt="zalo" />
                </a>
            </div>
        </>
    );
};

export default FabButton;
