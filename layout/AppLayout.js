import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const AppLayout = (content) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

    useEffect(() => {
        const accountID = window.localStorage.getItem('accountId');
        if (accountID) {
            setIsLoaded(true);
            return;
        }

        window.location.href = '/';
    }, []);

    return content;
}

export default AppLayout;