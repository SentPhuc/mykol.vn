import React, { useState, useRef } from 'react';
import { AutoComplete } from 'primereact/autocomplete';

import { TikTokSaveListService } from '../../../demo/service/TikTokSaveListService';


const LabelsInput = (props, { labels }) => {
    const service = new TikTokSaveListService();
    const { row } = props;
    const [selectedLabels, setSelectedLabels] = useState(row?.labels?.map((x) => x.name || [])); //selected labels
    const [masterLabels, setMasterLabels] = useState(labels?.map((x) => x.name || [])); //master labels
    const autoCompleteRef = useRef(null);
    const [isShow, setIsShow] = useState(true);


    const search = (event, kolRecruit) => {
        setTimeout(() => {
            let _filteredLabels = [];
            if (event === undefined || !event.query?.trim().length) {
                _filteredLabels = [...masterLabels];
                event.query = '';
                return;
            } else {
                if (masterLabels === undefined || masterLabels.length === 0) {
                    _filteredLabels = ['them: ' + event.query.trim()];
                    masterLabels = [..._filteredLabels];
                    setMasterLabels(masterLabels);
                    return;
                }

                if (masterLabels.length > 0) {
                    for (let i = 0; i < masterLabels.length; i++) {
                        if (removeUniCode(masterLabels[i]).includes(removeUniCode(event.query.trim())) || removeUniCode(masterLabels[i]).includes(removeUniCode(event.query.trim()))) {
                            if (!_filteredLabels.length) {
                                _filteredLabels = masterLabels[i].split();
                            } else {
                                _filteredLabels.push(masterLabels[i]);
                            }
                        }
                    }

                    if (!_filteredLabels.length) {
                        _filteredLabels = ['them: ' + event.query.trim()];
                        masterLabels = _filteredLabels;
                        setMasterLabels(masterLabels);
                        //set width hegith for autocomplete
                        return;
                    } else {
                        if (_filteredLabels === undefined) {
                            _filteredLabels = [];
                        }

                        let removeElement;
                        for (let i = 0; i < _filteredLabels.length; i++) {
                            if (removeUniCode(_filteredLabels[i]) === 'them: ' + removeUniCode(event.query.trim())) {
                                _filteredLabels[i] = 'them: ' + event.query.trim();
                            } else if (removeUniCode(_filteredLabels[i]).includes('them: ') && removeUniCode(_filteredLabels[i]) !== removeUniCode(event.query.trim())) {
                                _filteredLabels.splice(_filteredLabels.indexOf(_filteredLabels[i]), 1);
                            }
                        }

                        if (removeElement !== undefined) {
                            _filteredLabels.splice(_filteredLabels.indexOf(removeElement), 1);
                        }

                        if (!_filteredLabels.includes('them: ' + event.query.trim())) {
                            _filteredLabels.push('them: ' + event.query.trim());
                        }
                        masterLabels = _filteredLabels;

                        setMasterLabels(masterLabels);
                        return;
                    }
                }
            }
        }, 250);
    };

    function removeUniCode(label) {
        return label
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    const handleClick = (e, kolRecruit) => {
        setTimeout(() => {
            service.getAllLabels(kolRecruit.id).then((res) => {
                if (res.data.code === 'success') {
                    const data = res.data.data;
                    let _labels = data.map((x) => x.name || []);
                    _labels.filter((item, index) => _labels.indexOf(item) === index);
                    masterLabels = [..._labels];
                    setMasterLabels(masterLabels);
                } else {
                    setMasterLabels([]);
                }
                if (isShow) {
                    autoCompleteRef.current?.show();
                }
                isShow = true;
                setIsShow(isShow);
            });
        }, 150);
    };

    function selectedValue(e, kolRecruit) {
        if (!e.value.length) {
            return;
        }

        if (e.value.includes('them: ')) {
            e.value = e.value.replace('them: ', '');
        }

        if (selectedLabels === undefined || selectedLabels.length === 0) {
            setSelectedLabels([e.value.trim()]);
        } else {
            if (selectedLabels.includes(e.value.trim())) {
                return;
            } else {
                selectedLabels.push(e.value.trim());
                setSelectedLabels(selectedLabels);
            }
        }
        props.onClick(kolRecruit.id, e.value.trim(), true);
    }

    function removeValue(e, kolRecruit) {
        if (!e.value.length) {
            return;
        }

        isShow = false;
        setIsShow(isShow);
        props.onClick(kolRecruit.id, e.value, false);

        selectedLabels.splice(selectedLabels.indexOf(e.value), 1);
        setSelectedLabels(selectedLabels);
        return;
    }

    const customTemplate = (item) => {
        return (
            <div className="w-full">
                <span className="w-full">
                    {item.includes('them: ') ? (
                        <span
                            className="w-full cut-line-2"
                            style={{
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                                textOverflow: 'clip',
                                textAlign: 'left',
                                fontWeight: 'bold',
                                maxWidth: 400
                            }}
                        >
                            <i className="pi pi-plus-circle"></i> Thêm nhãn: {item.replace('them: ', '')}
                        </span>
                    ) : (
                        <span
                            className="cut-line-2"
                            style={{
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                                textOverflow: 'clip',
                                textAlign: 'left',
                                maxWidth: 400
                            }}
                        >
                            {item}
                        </span>
                    )}
                </span>
            </div>
        );
    };

    return (
        <div className="w-full">
            <AutoComplete
                className="w-full"
                field="name"
                multiple
                placeholder="Thêm nhãn"
                value={selectedLabels}
                itemTemplate={customTemplate}
                suggestions={masterLabels}
                completeMethod={(e) => search(e, row)}
                emptyMessage="Không tìm thấy nhãn"
                showEmptyMessage={true}
                selectedItemTemplate={customTemplate}
                onSelect={(e) => selectedValue(e, row)}
                onUnselect={(e) => removeValue(e, row)}
                forceSelection={true}
                ref={autoCompleteRef}
                onClick={(e) => handleClick(e, row)}
                // virtualScrollerOptions={{ lazy: true, itemSize: 50 }}
                panelStyle={{ minWidth: 200,minHeight:10, overflow: 'none' }}
            />
        </div>
    );
};

export default LabelsInput;
