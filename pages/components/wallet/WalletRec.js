import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { useState, useEffect } from 'react';
import { Wallets } from 'demo/service/Wallets';
import moment from 'moment';
import { formatCurrencyVND, checkTextColor, defineTitleType } from 'src/commons/Utils';
import ModalRecharge from '../requirement-basic/ModalRecharge';
import WithdrawMoney from './WithdrawMoney';
import { useRouter } from 'next/router';

export default function WalletRec() {
    const wallets = new Wallets();
    const [visible, setVisible] = useState(false);
    const [visibleWithdraw, setVisibleWithdraw] = useState(false);
    const [wallet, setWallet] = useState({});
    const [listHistory, setListHistory] = useState([]);
    const router = useRouter();

    useEffect(() => {
        wallets
            .getWallets()
            .then((data) => {
                if (data?.data?.code == 'success') {
                    setWallet(data?.data?.data);
                }
            })
            .catch((err) => console.log(err));

        wallets
            .getHistoris({
                page: 0,
                recordPage: 10
            })
            .then((data) => {
                if (data?.data?.code == 'success') {
                    setListHistory(data?.data?.data?.content);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        if (!!router.query.embed_data) {
            router.push(router.route);
        }
    }, [router]);

    const TemplateTime = (rowData) => {
        return moment(rowData.createdTime).format('DD/MM/YYYY');
    };

    const TemplateTitleWithType = (rowData) => {
        return !!rowData && defineTitleType?.[rowData.type];
    };

    const TemplateAmount = (rowData) => {
        return !!rowData && <span className={checkTextColor(rowData.type)}>{formatCurrencyVND(rowData.amount)}</span>;
    };

    const openModal = () => {
        setVisible(true);
        document.body.style.overflow = 'hidden';
    };

    const openModalWithdraw = () => {
        setVisibleWithdraw(true);
        document.body.style.overflow = 'hidden';
    };

    return (
        <>
            <h3 className="title-wallet font-bold">Ví của bạn</h3>
            <div className="available-balances flex flex-wrap align-items-end justify-content-between">
                <div className="flex md:mb-0 mb-3">
                    <Button onClick={() => openModal()} type="submit" style={{ width: '100px' }} label="Nạp tiền" />
                    <Button onClick={() => openModalWithdraw()} label="Rút tiền" style={{ width: '100px' }} className="p-button remove-filter ml-4"></Button>
                </div>
                <div className="balance">
                    <div className="mb-1 flex">
                        <p className="mb-0">Tổng số dư:</p> <span className="font-bold">{wallet?.totalBalance ? formatCurrencyVND(wallet?.totalBalance) : '0 ₫'}</span>
                    </div>
                    <div className="mb-1 flex">
                        <p className="mb-0">Số dư khả dụng:</p> <span className="font-bold">{wallet?.balance ? formatCurrencyVND(wallet?.balance) : '0 ₫'}</span>
                    </div>
                    <div className="flex align-items-center">
                        <p className="mb-0">
                            Số tiền tạm khóa: <i data-pr-position="left" data-pr-at="left top+10" data-pr-my="right center-2" className="pi pi-info-circle custom-target-tooltip ml-1 mr-1 cursor-pointer vertical-align-middle" autohide="false"></i>
                        </p>
                        <span className="font-bold">{wallet?.holdBalance ? formatCurrencyVND(wallet?.holdBalance) : '0 ₫'}</span>
                    </div>
                    <Tooltip target=".custom-target-tooltip">Đây là tổng số tiền tạm khóa khi bạn đang thực hiện giao dịch với KOC</Tooltip>
                </div>
            </div>
            <DataTable className="custom" scrollable={true} value={listHistory} paginator={true} rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '100%' }}>
                <Column style={{ width: '25%' }} body={TemplateTime} header="Thời gian"></Column>
                <Column style={{ width: '35%' }} field="content" header="Nội dung"></Column>
                <Column style={{ width: '25%' }} body={TemplateTitleWithType} header="Loại giao dịch"></Column>
                <Column style={{ width: '15%' }} body={TemplateAmount} header="Số tiền"></Column>
            </DataTable>
            <ModalRecharge visible={visible} setVisible={setVisible} />
            <WithdrawMoney visibleWithdraw={visibleWithdraw} setVisibleWithdraw={setVisibleWithdraw} />
        </>
    );
}
