import { useState, useEffect } from 'react';
export default function StatusContent({ status, content }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const htmlContent = () => {
        if (typeof content == 'string') {
            return content;
        }

        return (
            <ul className="my-0 pl-3">
                {!!content &&
                    content.map((value, index) => {
                        return <li key={index}>{value}</li>;
                    })}
            </ul>
        );
    };

    return (
        <div className="content p-3 mb-2 bg-red-100">
            <h3 className="text-lg font-bold mb-2">{status}</h3>
            {isClient && htmlContent()}
        </div>
    );
}
