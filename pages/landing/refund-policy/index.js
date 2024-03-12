export default function RefundPolicy() {
    return (
        <div className="card md:p-5 py-3 px-0" id="lading-page">
            <div className="container line-height-4">
                <b className="text-4xl">CHÍNH SÁCH HOÀN TIỀN, THANH TOÁN</b>
                <br />
                <b className="text-xl">1. Chính sách huỷ đơn, hoàn tiền</b>
                <br />
                - Trong quy trình làm việc chúng tôi đưa ra, cả KOC/KOL/INFLUENCER và Nhãn hàng đều có quyền hủy đơn hàng đối với các trường hợp như sau:
                <br />
                + KOC/KOL/INFLUENCER: Có quyền hủy đơn hàng ở bất kỳ giai đoạn nào của công việc
                <br />
                + Nhãn hàng: Có quyền hủy đơn hàng khi KOC/KOL/INFLUENCER quá hạn Deadline 07 ngày hoặc đơn hàng chưa được KOC/KOL/INFLUENCER tiếp nhận trong vòng 05 ngày.
                <br />
                - Ngoài ra, khi chúng tôi phát hiện giao dịch có sự gian lận, chúng tôi cũng sẽ chủ động hủy đơn hàng và thông báo cho 02 bên bằng email.
                <br />
                Sau khi một trong hai bên hủy đơn hàng, số tiền tạm khóa trước đó sẽ được hoàn trả lại vào Số dư khả dụng của nhãn hàng. Giao dịch coi như kết thúc.
                <br />
                <b>* Các trường hợp miễn trừ trách nhiệm</b>
                <br />
                - MYKOL được miễn trừ trách nhiệm khi xảy ra một trong các trường hợp bất khả kháng theo quy định của pháp luật.
                <br />
                - MYKOL được miễn trừ trách nhiệm trong việc bồi thường thiệt hại gián tiếp, ngẫu nhiên, hoặc do hậu quả phát sinh.
                <br />
                - Trong mọi trường hợp, trách nhiệm hoàn tiền của MYKOL không vượt quá tổng số tiền KOC/KOL/INFLUENCER và Nhãn hàng đã giao dịch.
                <br />
                <b className="text-xl">2. Chính sách rút tiền, thanh toán</b>
                <br />
                <b>- Đối với Nhãn hàng.</b>
                <br />
                + Phần ví tiền của Nhãn hàng được chia thành 2 loại: Số dư khả dụng và Số tiền tạm khóa.
                <br />
                + Chúng tôi cho phép Nhãn hàng có quyền rút tiền khi Số dư khả dụng lớn hơn 500.000 VND. Sau khi nhận được yêu cầu rút tiền từ Nhãn hàng thông qua Chức năng rút tiền trên website, trong vòng 07 ngày làm việc, MYKOL sẽ chuyển khoản
                theo thông tin thanh toán Nhãn hàng đã cung cấp.
                <br />
                <b>- Đối với KOC/KOL/INFLUENCER</b>
                <br />
                + Các đơn hàng có thời gian hoàn thành trong tháng T sẽ được MYKOL thực hiện đối soát và thanh toán vào ngày mùng 10 tháng T+1.
                <br />
                + Quy trình đối soát cụ thể sẽ được thực hiện như sau: MYKOL sẽ tiến hành đối soát và thanh toán cho các Đơn Hàng Hợp Lệ từ ngày 1 đến ngày 30 hoặc 31 tháng T và những Đơn Hàng Hợp Lệ nhưng chưa được đối soát ở các tháng trước đó (nếu
                có).
                <br />
                + MYKOL sẽ gửi email đối soát tổng tiền thanh toán tháng T cho KOC/KOL/INFLUENCER trước ngày mùng 8 tháng T+1.
                <br />
                + KOC/KOL/INFLUENCER có thời gian 02 ngày làm việc để phản hồi và xác nhận kết quả hoa hồng. Sau thời gian 02 ngày làm việc nếu MYKOL không nhận được bất kỳ một phản hồi nào của KOC/KOL/INFLUENCER về kết quả đối soát qua biểu mẫu phản
                hồi thì nghĩa là KOC/KOL/INFLUENCER đồng ý với mức hoa hồng mà MYKOL đã gửi qua email.
                <br />
                Trong vòng 5 Ngày Làm Việc kể từ ngày 10 tháng T+1, KOC/KOL/INFLUENCER kiểm tra lịch sử thanh toán trên tài khoản ngân hàng đã cung cấp và hệ thống website của MYKOL.
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    return {
        props: {
            dataSeo: {
                title: 'MyKOL - Chính sách hoàn tiền'
            }
        }
    };
}
