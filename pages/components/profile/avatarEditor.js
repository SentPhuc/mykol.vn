import AccountProfileForm from "./accountProfileForm";
import {Provider, useSelector} from "react-redux";
import store from "../../../public/reduxConfig/profileStore";

const AvatarEditor = (props) => {
    const accountProfile = useSelector((state) => state.profiles);
    return (
        <Provider store={store}>
            { accountProfile.length > 0 ? <AccountProfileForm accountProfile={accountProfile}/> : ''}
        </Provider>
    )
}

export default AvatarEditor;
