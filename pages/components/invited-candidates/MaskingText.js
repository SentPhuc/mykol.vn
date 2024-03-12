const MaskingText = (props) => {
    const maxLength = 100;
    const { text } = props;

    if (text?.length > maxLength) {
        return (
            <span>
        {text?.substr(0, maxLength - 3)}
                ...
      </span>
        );
    }

    return <span>{text}</span>;
};

export default MaskingText;