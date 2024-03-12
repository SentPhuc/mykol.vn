export default function DisputeResolution() {
    return (
        <div className="card md:p-5 py-3 px-0" id="lading-page">
            <div className="container line-height-4">
                <b className="text-4xl">GIẢI QUYẾT TRANH CHẤP, KHIẾU NẠI</b>
                <br />
                <b>I. Khách hàng khiếu nại đối với nền tảng MYKOL.</b>
                <ul className="my-0 list-decimal">
                    <li>MYKOL sẽ cố gắng nắm bắt các thông tin chính xác nhất và cập nhật trên trang website MYKOL. Tuy nhiên, các lỗi hay thiếu sót vẫn có thể xuất hiện.</li>
                    <li>Trong phạm vi tối đa theo luật quy định, MYKOL không cam đoan hoặc đảm bảo sự chính xác về nội dung của trang thông tin điện tử này.</li>
                    <li>
                        Trong mọi trường hợp, bao gồm cả những trường hợp do sơ suất, hay bất kỳ bên nào tham gia vào việc tạo ra hoặc hình thành trang thông tin điện tử này, MYKOL sẽ không chịu trách nhiệm với người sử dụng đối với bất kỳ thiệt hại
                        trực tiếp, ngẫu nhiên, gián tiếp, do quan hệ nhân quả hay do bị phạt do việc sử dụng, hay không thể sử dụng các tài liệu hay thông tin trên trang thông tin điện tử MYKOL, bao gồm ngay cả trường hợp MYKOL hoặc bất kỳ đại diện
                        được ủy quyền đã được thông báo về khả năng xảy ra những thiệt hại đó.
                    </li>
                    <li>
                        MYKOL - Chúng tôi sẽ chỉ chịu trách nhiệm pháp lý cho các tổn hại trực tiếp mà quý vị thực sự phải gánh chịu, chi trả hoặc phát sinh do thiết sót có thể quy ra trong giao ước của chúng tôi về dịch vụ tùy theo các giới hạn được
                        quy định bởi những điều khoản và điều kiện này. Mức chịu trách nhiệm pháp lý tối đa sẽ bằng tổng số tiền của chi phí như quý vị đã định ra trong email xác nhận (cho dù là 1 trường hợp hay các chuỗi sự kiện có liên quan đến
                        nhau).
                    </li>
                    <li>Trong bất kỳ trường hợp nào, toàn bộ trách nhiệm của MYKOL đối với các thiệt hại, tổn thất hay các khiếu kiện của khách hàng sẽ không vượt quá số tiền mà người sử dụng đã trả cho việc truy cập vào MYKOL (Nếu có).</li>
                    <li>
                        MYKOL sẽ không chịu trách nhiệm và không có nghĩa vụ thanh toán đối với bất kỳ thiệt hại nào liên quan đến các tài sản của người sử dụng do hậu quả của việc truy cập, sử dụng hay lướt qua trang thông tin điện tử này hay có
                        liên quan đến các dạng vi-rút có thể tấn công hay tải xuống các tài liệu, dữ liệu, các hình ảnh, phim, đoạn văn hay âm thanh từ website nền tảng MYKOL.
                    </li>
                </ul>
                <br />
                <b>II. Tranh chấp, khiếu nại giữa Nhà tuyển dụng và KOL/KOC/Influencers.</b>
                <br />
                MYKOL chỉ chịu trách nhiệm kết nối hai bên với nhau dễ dàng hơn, chịu trách nhiệm xác thực các thông tin đăng tải trên website. MYKOL không chịu trách nhiệm về chất lượng, môi trường, mức thù lao hay các vấn đề khác phát từ phía Nhà
                tuyển dụng.
                <ul className="my-0 list-decimal">
                    <li>Các tranh chấp, khiếu nại (nếu có) giữa Nhà tuyển dụng và KOL/KOC/Influencers, hai bên tự thỏa thuận riêng trong hòa bình, đảm bảo quyền lợi của cả hai bên.</li>
                    <li>
                        Trường hợp có mâu thuẫn không thể thỏa thuận riêng, người bị hại thu thập toàn bộ thông tin, bằng chứng và gửi yêu cầu đến website MYKOL qua địa chỉ Email: mykol.vn@gmail.com Chúng tôi sẽ đóng vai trò trung gian hòa giải trên
                        cơ sở điều khoản đã quy định và nội dung bảo vệ quyền lợi của người sử dụng trong Điều khoản sử dụng dịch vụ nhằm đảm bảo quyền lợi bình đẳng cho cả hai bên. Căn cứ theo từng tình huống khiếu nại cụ thể, nhân viên bộ phận chăm
                        sóc khách hàng sẽ có giải đáp chi tiết cho người bị hại theo các chính sách quy định.
                    </li>
                    <li> Trong trường hợp không thể giải quyết tranh chấp theo 2 phương án trên, MYKOL hỗ trợ bên bị hại liên hệ đến các cơ quan chức năng có thẩm quyền để phân xử.</li>
                </ul>
                <br />
                Lưu ý, trường hợp MYKOL tiếp nhận thông tin phản ánh về chất lượng Nhà tuyển dụng hay KOL/KOC/Influencers,.. phần thông tin của Nhà tuyển dụng và KOL/KOC/Influencers sẽ tạm thời bị khóa để chờ kết luận/thỏa thuận cuối cùng của các bên
                có liên quan.
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    return {
        props: {
            dataSeo: {
                title: 'MyKOL - Giải quyết tranh chấp, khiếu nại'
            }
        }
    };
}
