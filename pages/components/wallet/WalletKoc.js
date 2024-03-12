import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect } from 'react';
import { Wallets } from 'demo/service/Wallets';
import moment from 'moment';
import { formatCurrencyVND, checkTextColor, defineTitleType } from 'src/commons/Utils';

export default function WalletKoc() {
    const wallets = new Wallets();
    const [wallet, setWallet] = useState({});
    const [listHistory, setListHistory] = useState([]);

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

    const TemplateTime = (rowData) => {
        return moment(rowData.createdTime).format('DD/MM/YYYY');
    };

    const TemplateTitleWithType = (rowData) => {
        return !!rowData && defineTitleType?.[rowData.type];
    };

    const TemplateAmount = (rowData) => {
        return !!rowData && <span className={checkTextColor(rowData.type)}>{formatCurrencyVND(rowData.amount)}</span>;
    };

    console.log(wallet);

    return (
        <>
            <h3 className="title-wallet">Ví của bạn</h3>
            <div className="title-desc">Số tiền sẽ được đối soát và chuyển khoản tự động vào tài khoản ngân hàng của bạn vào ngày 10 hàng tháng. Hãy đảm bảo rằng số tài khoản bạn nhập ở page Cập nhật hồ sơ là chính xác.</div>
            <div className="available-balances text-right">
                Số dư khả dụng: <span>{wallet?.balance ? formatCurrencyVND(wallet?.balance) : '0 ₫'}</span>
            </div>
            <DataTable className="custom" scrollable={true} value={listHistory} paginator={true} rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '100%' }}>
                <Column body={TemplateTime} header="Thời gian"></Column>
                <Column field="content" header="Nội dung"></Column>
                <Column body={TemplateTitleWithType} header="Loại giao dịch"></Column>
                <Column body={TemplateAmount} header="Số tiền"></Column>
            </DataTable>
        </>
    );
}
