const escape = (str) => {
    return str.replace(/[&<>"'\/]/g, (char) => {
        switch (char) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case "'":
                return '&#x27;';
            case '/':
                return '&#x2F;';
            default:
                return char;
        }
    });
};

const unescape = (str) => {
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;/g, (entity) => {
        switch (entity) {
            case '&amp;':
                return '&';
            case '&lt;':
                return '<';
            case '&gt;':
                return '>';
            case '&quot;':
                return '"';
            case '&#x27;':
                return "'";
            case '&#x2F;':
                return '/';
            default:
                return entity;
        }
    });
};
