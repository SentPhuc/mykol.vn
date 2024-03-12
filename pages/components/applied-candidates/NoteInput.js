import React, { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';

const NoteInput = (props) => {
    const { row } = props;
    const [note, setNote] = useState(row?.note||'');

    const onClickCheck = async (event, kolRecruit) => {
        if (event.detail > 1) {
            return;
        }
        props.onClick(kolRecruit.id, note);
    };

    return (
        <div className="w-full">
            <div className="p-inputgroup " style={{ width: '150px' }}>
                <InputTextarea
                    className="w-full border-round-md"
                    onChange={(e) => {
                        setNote(e.target.value);
                    }}
                    value={note}
                    placeholder="Thêm ghi chú"
                    maxLength={255}
                    onBlur={(e) => {
                        onClickCheck(e, row);
                    }}
                    autoResize
                    
                />
            </div>
        </div>
    );
};

export default NoteInput;
