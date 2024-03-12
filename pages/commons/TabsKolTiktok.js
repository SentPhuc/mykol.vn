import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

const TabsKolTiktok = ({ urlActive }) => {
    return (
        <div className="white-space-nowrap py-2 md:pl-1" style={{ overflowX: 'auto' }}>
            <Button
                onClick={() => (window.location.href = '/components/search-tiktok-candidates')}
                type="button"
                label="Tìm kiếm theo doanh thu"
                icon="pi pi-search"
                className={`${urlActive == '/components/search-tiktok-candidates' ? '' : 'remove-filter'}`}
            />
            <Button
                onClick={() => (window.location.href = '/components/search-tiktok-products')}
                type="button"
                label="Tìm kiếm theo sản phẩm"
                icon="pi pi-search"
                className={classNames(urlActive == '/components/search-tiktok-products' ? '' : 'remove-filter', 'p-button ml-2')}
            />
            <Button
                onClick={() => (window.location.href = '/components/saved-tiktok-candidates')}
                type="button"
                label="Danh sách Influencers đã lưu"
                icon="pi pi-search"
                className={classNames(urlActive == '/components/saved-tiktok-candidates' ? '' : 'remove-filter', 'p-button ml-2')}
            />
            <Button
                onClick={() => (window.location.href = '/components/service-packages-and-payments')}
                type="button"
                label="Gói dịch vụ và thanh toán"
                icon="pi pi-search"
                className={classNames(urlActive == '/components/service-packages-and-payments' ? '' : 'remove-filter', 'p-button ml-2')}
            />
        </div>
    );
};

export default TabsKolTiktok;
