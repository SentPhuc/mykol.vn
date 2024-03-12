import AccountProfileForm from './accountProfileForm';
import { Provider, useSelector } from 'react-redux';
import configureStore from '../../../public/reduxConfig/store/configureStore';
import AppLayout from '../../../layout/AppLayout';

const AccountProfile = () => {
    const accountProfile = useSelector((state) => state.profiles);
    return AppLayout(
        <Provider store={configureStore}>
            { accountProfile.length > 0 ? <AccountProfileForm accountProfile={accountProfile}/> : ''}
        </Provider>
    );
};

export default AccountProfile;