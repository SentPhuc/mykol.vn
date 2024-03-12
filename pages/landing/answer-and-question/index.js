export default function AnswerAndQuestion() {
    return (
        <div className="card md:p-5 py-3 px-0" id="lading-page">
            <div className="container line-height-3">
                <b className="text-lg">
                    <span className="text-xl">1.</span> MYKOL là gì?
                </b>
                <br />
                MYKOL là một nền tảng về Influencer Marketing (Influencer Marketing Platform), là trung gian kết nối những Nhà tuyển dụng có nhu cầu quảng cáo theo hình thức Influencers Marketing đến gần hơn với những KOL/KOC/Influencers tiềm năng.
                <br />
                <br />
                <b className="text-lg">
                    <span className="text-xl">2.</span> Tôi không biết cách xây dựng Profile cá nhân thì phải làm thế nào?
                </b>
                <br />
                Đừng lo lắng, MYKOL có riêng một bài viết hướng dẫn và hỗ trợ bạn xây dựng Profile đúng chuẩn yêu cầu của Nhà tuyển dụng đó.
                <br />
                Bạn có thể tìm đọc và tham khảo tại website của MYKOL tại đường link sau:{' '}
                <b>
                    <a target="_blank" href="/landing/instructions-creating-profile" title="Link">
                        Link
                    </a>
                </b>
                <br />
                <br />
                <b className="text-lg">
                    <span className="text-xl">3.</span> MYKOL có khả dụng trên điện thoại không?
                </b>
                <br />
                Có, MYKOL có tương thích trên điện thoại.
                <br />
                <br />
                <b className="text-lg">
                    <span className="text-xl">4.</span> Tôi có thể chỉnh sửa hồ sơ của mình không?
                </b>
                <br />
                Có, bạn hoàn toàn có quyền cập nhật thông tin hồ sơ sau khi đăng nhập vào tài khoản tại mục Hồ sơ hình ảnh.
                <br />
                <br />
                <b className="text-lg">
                    <span className="text-xl">5.</span> MYKOL có bảo mật dữ liệu của tôi không?
                </b>
                <br />
                MYKOL cam kết bảo mật mọi thông tin liên quan đến dữ liệu của bạn.
                <br />
                <br />
                <b className="text-lg">
                    <span className="text-xl">6.</span> Vì sao tôi nên đăng nhập tài khoản thường xuyên?
                </b>
                <br />
                Với tâm thế không ngừng đổi mới, hoàn thiện và cho ra mắt những tính năng mới dựa trên trải nghiệm khách hàng. MYKOL khuyến nghị bạn nên đăng nhập tài khoản thường xuyên để cập nhật nhanh chóng những tính năng mới nhất.
                <br />
                <br />
                <b className="text-lg">
                    <span className="text-xl">7.</span> Vì sao tôi không đăng nhập được MYKOL?
                </b>
                <br />
                Có 2 lý do sau dẫn đến việc bạn không thể đăng nhập được vào nền tảng của chúng tôi:
                <br />
                <ul className="mt-0 pl-5 mb-0">
                    <li>Vui lòng đăng ký tài khoản trước khi đăng nhập MYKOL.</li>
                    <li>Mật khẩu đã bị cũ hoặc người dùng quên mật khẩu. Trường hợp này bạn có thể nhấn chọn “Quên mật khẩu” ở khung màn hình đăng nhập và thao tác theo hướng dẫn để lấy lại mật khẩu qua email.</li>
                </ul>
                <br />
                Mọi thắc mắc, ý kiến đóng góp về nền tảng MYKOL, xin vui lòng gửi về email của chúng tôi: mykol.vn@gmail.com
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    return {
        props: {
            dataSeo: {
                title: 'MyKOL - Hỏi đáp'
            }
        }
    };
}