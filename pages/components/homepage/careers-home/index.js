import getConfig from 'next/config';

export default function CareersHome() {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const listCareers = [
        {
            name: 'Ẩm thực',
            link: '/components/search-kocs?careerCodes=1'
        },
        {
            name: 'Làm đẹp',
            link: '/components/search-kocs?careerCodes=2'
        },
        {
            name: 'Thời trang',
            link: '/components/search-kocs?careerCodes=3'
        },
        {
            name: 'Sức khỏe',
            link: '/components/search-kocs?careerCodes=4'
        },
        {
            name: 'Lifestyle',
            link: '/components/search-kocs?careerCodes=5'
        },
        {
            name: 'Mẹ và bé',
            link: '/components/search-kocs?careerCodes=6'
        },
        {
            name: 'Du lịch',
            link: '/components/search-kocs?careerCodes=7'
        },
        {
            name: 'Công nghệ',
            link: '/components/search-kocs?careerCodes=8'
        }
    ];

    return (
        <div id="careers-home" className="w-full">
            <div className="container">
                <div className="box-careers-home shadow-1">
                    <div className="flex flex-wrap justify-content-between bg-white">
                        {listCareers.map((value, index) => {
                            return (
                                <div key={index} className="item-careers-home">
                                    <a className="block relative" href={value.link} title={value.name}>
                                        <div className="image hover-zoom">
                                            <img className="max-w-full w-full" alt={value.name} src={contextPath + `/demo/images/home/career-${index + 1}.png`} />
                                        </div>
                                        <div className="info">
                                            <h3>{value.name}</h3>
                                        </div>
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
