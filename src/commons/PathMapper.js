import { getParams } from 'src/commons/Utils';
let fullPath = getParams()?.size > 0 ? '?' + getParams()?.toString() : '';
const PathMapper = new Map([
    //home page
    ['/', [{ label: 'Trang chủ' }, { label: 'Trang chủ' }]],
    ['/components/detail-candidate', [{ label: 'KOLS', url: `/components/search-candidates/${fullPath}` }]],

    // Quản lý tuyển dụng
    ['/components/create-new-recruitment', [{ label: 'Quản lý tuyển dụng' }, { label: 'Tạo tin tuyển dụng' }]],
    ['/components/list-recruitments', [{ label: 'Quản lý tuyển dụng' }, { label: 'Hồ sơ tin tuyển dụng' }]],
    ['/components/company/recruitment-detail', [{ label: 'Tuyển dụng' }]],

    // Quản lý ứng viên
    ['/components/applied-candidates', [{ label: 'Quản lý tuyển dụng' }, { label: 'Ứng viên đã ứng tuyển' }]],
    ['/components/invited-candidates', [{ label: 'Quản lý ứng viên' }, { label: 'Ứng viên đã mời tham gia' }]],
    ['/components/saved-candidates', [{ label: 'Quản lý tuyển dụng' }, { label: 'Ứng viên đã lưu' }]],

    ['/components/contact', [{ label: 'Liên hệ' }]],
    ['/components/influencer-ranking', [{ label: 'Bảng xếp hạng' }]],

    // Quản  & Duyệt hồ sơ
    ['/components/verified-kols', [{ label: 'Duyệt hồ sơ' }, { label: 'Duyệt Kols' }]],
    ['/components/verified-recruitment', [{ label: 'Duyệt hồ sơ' }, { label: 'Duyệt tin tuyển dụng' }]],
    ['/components/roles', [{ label: 'Quản trị' }, { label: 'Xem danh sách quyền' }]],
    ['/components/update-kol-sales', [{ label: 'Quản trị' }, { label: 'Cập nhật lượt bán Kols' }]],
    ['/components/assign-sales-role', [{ label: 'Quản trị' }, { label: 'Phân quyền Sales' }]],
    ['/components/information-censorship', [{ label: 'Quản trị' }, { label: 'Kiểm duyệt thông tin' }]],

    // Quản lý tài khoản
    ['/components/profile', [{ label: 'Quản lý tài khoản' }, { label: 'Cập nhật hồ sơ' }]],
    ['/components/download-profile', [{ label: 'Quản lý tài khoản' }, { label: 'Tải xuống' }]],
    ['/components/kol-information', [{ label: 'Quản lý tài khoản' }, { label: 'Thông tin bổ sung' }]],

    // Quản lý tài khoản tuyển dụng
    ['/components/campaign-report', [{ label: 'Quản lý kết quả' }, { label: 'Báo cáo chiến dịch' }]],
    ['/components/company-profile', [{ label: 'Quản lý tài khoản' }, { label: 'Hồ sơ công ty' }]],

    // Quản lý việc làm
    ['/components/applied-job', [{ label: 'Quản lý việc làm' }, { label: 'Việc làm đã ứng tuyển' }]],
    ['/components/saved-job', [{ label: 'Quản lý việc làm' }, { label: 'Việc làm đã lưu' }]],
    ['/components/invited-job', [{ label: 'Quản lý việc làm' }, { label: 'Việc làm được mời tham gia' }]],

    ['/recruitments/[mask]/[id]', [{ label: 'Tuyển dụng' }]],

    // Tìm kiếm Influencer
    ['/components/search-tiktok-candidates', [{ label: 'Tìm kiếm Influencer' }, { label: 'Tìm kiếm ứng viên Tiktok' }]],
    ['/components/saved-tiktok-candidates', [{ label: 'Tìm kiếm Influencer' }, { label: 'Danh sách Influencer đã lưu' }]],
    ['/components/search-tiktok-products', [{ label: 'Tìm kiếm theo sản phẩm' }, { label: 'Danh sách sản phẩm Tiktok' }]],
    ['/applied-candidates', [{ label: 'Ứng viên đã ứng tuyển' }]]
]);

export default PathMapper;
