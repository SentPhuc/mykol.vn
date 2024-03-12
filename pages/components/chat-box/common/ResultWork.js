import moment from 'moment/moment';

export default function ResultWork({ result }) {
    if (!result) {
        return (
            <ul className="list-none mt-2 flex flex-column gap-2 pl-0 mb-0">
                <li className="bg-gray-100 border-round-xs p-2 flex" key={0}>
                    <a className="line-clamp-1 underline" href="#" title="Chưa có kết quả công việc">
                        Chưa có kết quả công việc
                    </a>
                    <span className="ml-3 text-sm"></span>
                </li>
            </ul>
        );
    }

    return (
        <ul className="list-none mt-2 flex flex-column gap-2 pl-0 mb-0">
            {!!result && result.map((value, index) => {
                return (
                    <li className="bg-gray-100 border-round-xs p-2 flex" key={index}>
                        <a target="_blank" className="line-clamp-1 underline" href={value?.link} title={value?.link}>
                            {value?.link}
                        </a>
                        <span className="ml-3 text-sm">{moment(value?.createdTime).format('DD/MM/YYYY')}</span>
                    </li>
                );
            })}
        </ul>
    );
}
