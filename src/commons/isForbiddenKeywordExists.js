import { GlobalService } from 'demo/service/GlobalService';

export default async function isForbiddenKeywordExists(textValidate) {
    const stringValidate = await new GlobalService()
        .getKeywordBacklist()
        .then((data) => {
            if (data?.data?.code == 'success') {
                return data?.data?.data?.keywords;
            }
        })
        .catch((err) => console.error(err));

    if (!stringValidate || !textValidate)
        return {
            error: false,
            message: ''
        };

    const convertText =
        !!stringValidate &&
        stringValidate
            .trim()
            .replace(/(\r\n|\n|\r)/gm, '')
            .split(',');

    let error = false;
    let messageText = '';

    if (convertText.length) {
        for (let index = 0; index < convertText.length; index++) {
            if (textValidate.toLowerCase().includes(convertText[index].trim().toLowerCase())) {
                error = true;
                messageText += ', ' + convertText[index].trim();
            }
        }
    }
    if (error && messageText) {
        return {
            error: true,
            message: messageText?.substring(1)
        };
    }

    return {
        error: false,
        message: ''
    };
}
