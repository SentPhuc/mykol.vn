import { Button } from 'primereact/button';
import React from 'react';

const HeartButton = (props) => {
    const { data, onJobSaving, recruitmentId } = props;
    const onHeartDisplayHandler = (isInterested) => {
        const onHeart = {
            0: <div className="heart-button absolute top-0 right-0 flex flex-row md:flex-column md:w-auto md:align-items-end mt-5 md:mt-0">
                <Button icon="pi pi-heart" className="p-button-rounded p-button-danger p-button-text" onClick={() => {onJobSaving(recruitmentId);}}></Button>
            </div>,
            1: <div className="heart-button absolute top-0 right-0 flex flex-row md:flex-column md:w-auto md:align-items-end mt-5 md:mt-0">
                <Button icon="pi pi-heart-fill" className="p-button-rounded p-button-danger p-button-text" onClick={() => {onJobSaving(recruitmentId);}}></Button>
            </div>
        };
        return onHeart?.[isInterested];
    };
    return (
        onHeartDisplayHandler(data) ?? null
    );
};

export default HeartButton;