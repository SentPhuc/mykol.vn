import React from 'react';
import { Chip } from 'primereact/chip';
import Link from 'next/link';

const PlatformIcon = (props) => {
    const { kolName, kolSocialNetworks, kolAge, address, mask, kolId } = props;
    return (
        <div>
            <Link
                href={{
                    pathname: '/components/detail-candidate',
                    query: { mask: mask, id: kolId }
                }}
            >
                <a target='_blank' className={'text-2xl cursor-pointer block hover:underline'}>{kolName} <span className={'text-xs'}>{kolAge} tuổi</span></a>
            </Link>
            {
                kolSocialNetworks.map((e) => {
                    switch (e.socialNetworkCode) {
                        case 1:
                            return (
                                <div className={'inline-block mr-4'}  key={e.socialNetworkCode}>
                                    <i className="fab fa-square-facebook mr-1"></i>
                                    <b>{e.followers}</b>
                                </div>
                            );
                        case 3:
                            return (
                                <div className={'inline-block mr-4'}  key={e.socialNetworkCode}>
                                    <i className="fab fa-tiktok mr-1" ></i>
                                    <b>{e.followers}</b>
                                </div>
                            );
                        case 2:
                            return (
                                <div className={'inline-block mr-4'} key={e.socialNetworkCode}>
                                    <i className="fab fa-youtube mr-1" ></i>
                                    <b>{e.followers}</b>
                                </div>
                            );
                        case 4:
                            return (
                                <div className={'inline-block mr-4'} key={`${e.socialNetworkCode}`}>
                                    <i className="fab fa-instagram mr-1"></i>
                                    <b>{e.followers}</b>
                                </div>
                            );
                    }
                })
            }
            <div className={"mt-3"}>
                <Chip label={address} />
            </div>
        </div>
    );
};
export default PlatformIcon;