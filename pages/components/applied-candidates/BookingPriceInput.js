import React, { useState } from 'react';
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";

const BookingPriceInput = (props) => {
    const { row } = props;
    const [dataPrice, setDataPrice] = useState(-1);
    const [openInput, setOpenInput] = useState(false);
    const onClickCheck = async (event, kolRecruit) => {
        props.onClick(kolRecruit.id, dataPrice);
    };
    const addDotsToNumber = (number) => {
        let numberString = number?.toString();
        numberString = numberString?.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return numberString;
    }
    return (
        (row?.bookingPrice != null) ? (
            openInput ? (
                    <div className='w-full'>
                        <div className="p-inputgroup" style={{'width' : '200px','position' : 'relative', 'z-index' : '99999'}}>
                            <InputNumber
                                inputClassName="w-full" value={row?.bookingPrice} onValueChange={(e) => setDataPrice(e.value)} placeholder="Nhập giá booking"
                                mode="currency"
                                currency="VND"
                                maxLength={12}
                            />
                            <Button icon="pi pi-check" className="p-button-success" onClick={(e) => {onClickCheck(e, row); setOpenInput(false); }} />
                            <Button icon="pi pi-times" className="p-button-cancel" onClick={() => {setOpenInput(false)}} />
                        </div>
                    </div>
                )
                : (
                    <div className='w-full' onClick={()=>{setOpenInput(true)}}>
                        <p className="font-bold cursor-pointer recruitment-title underline text-blue-400 kolName-applied-candidates center-item">{addDotsToNumber(row?.bookingPrice)} đ</p>
                    </div>
                )
        ) : (
            <div className='w-full'>
                <div className="p-inputgroup" style={{'width' : '150px'}}>
                    <InputNumber
                        inputClassName="w-full" value={null} onValueChange={(e) => setDataPrice(e.value)} placeholder="Nhập giá booking"
                        mode="currency"
                        currency="VND"
                        maxLength={12}
                    />
                    <Button icon="pi pi-check" className="p-button-success" onClick={(e) => {onClickCheck(e, row); setOpenInput(false); }} />
                </div>
            </div>
        )
    );
};
export default BookingPriceInput;
