import React from 'react';
import getConfig from 'next/config';

const contextPath = getConfig().publicRuntimeConfig.contextPath;
const SocialComponent = (props) => {
    const facebookDisplay = (e) => {
        return (
            <div key={e.key}>
                <div className="icon-box featured-box icon-box-left text-left flex">
                    <div className="icon">
                        <div className="icon-inner">
                            <img width="32" height="32" src={`${contextPath}/demo/images/social/icon-facebook.svg`} />
                        </div>
                    </div>
                    <div className="icon-box-text last-reset">
                        <p>Facebook</p>
                        <p>{e.followers}</p>
                    </div>
                </div>
            </div>
        );
    };

    const youtubeDisplay = (e) => {
        return (
            <div key={e.key}>
                <div className="icon-box featured-box icon-box-left text-left flex">
                    <div className="icon">
                        <div className="icon-inner">
                            <img width="32" height="32" src={`${contextPath}/demo/images/social/icon-youtube.svg`} />
                        </div>
                    </div>
                    <div className="icon-box-text last-reset">
                        <p>Youtube</p>
                        <p>{e.followers}</p>
                    </div>
                </div>
            </div>
        );
    };
    const tiktokDisplay = (e) => {
        return (
            <div key={e.key}>
                <div className="icon-box featured-box icon-box-left text-left flex">
                    <div className="icon">
                        <div className="icon-inner">
                            <img width="32" height="32" src={`${contextPath}/demo/images/social/icon-tiktok.svg`} />
                        </div>
                    </div>
                    <div className="icon-box-text last-reset">
                        <p>Tiktok</p>
                        <p>{e.followers}</p>
                    </div>
                </div>
            </div>
        );
    };
    const instagramDisplay = (e) => {
        return (
            <div key={e.key}>
                <div className="icon-box featured-box icon-box-left text-left flex">
                    <div className="icon">
                        <div className="icon-inner">
                            <img width="32" height="32" src={`${contextPath}/demo/images/social/icon-instagram.svg`} />
                        </div>
                    </div>
                    <div className="icon-box-text last-reset">
                        <p>Instagram</p>
                        <p>{e.followers}</p>
                    </div>
                </div>
            </div>
        );
    };

    const { e } = props;

    const numberOfFollowerSocialNetwork = (network) => {
        const socialNetworkHandler = {
            1: facebookDisplay,
            2: tiktokDisplay,
            3: instagramDisplay,
            4: youtubeDisplay
        };
        return socialNetworkHandler[network]?.(e);
    };

    return <div>{numberOfFollowerSocialNetwork(e?.socialNetworkCode)}</div>;
};

export default SocialComponent;
