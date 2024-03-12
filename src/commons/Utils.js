import moment from 'moment';

export const isShowPayment = false;

export const PHONE_REGEX = /^(\+?84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5|8|9|]|9[0-4|6-9])[0-9]{7}$/;

export const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(password);
};

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validatePhone = (phone) => {
    const regex = /(^(84|0)[3|5|7|8|9])+([0-9]{8})\b/g;
    return regex.test(phone);
};

export const validateWebsite = (link) => {
    const regex = /^(https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?$/;
    return regex.test(link);
};

export const convertToSlug = (title) => {
    return title?.replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

export const randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const isValidTaxCode = (taxCode) => {
    const taxCodeRegex = /^([0-9A-Z]{10}|[0-9A-Z]{9}-[0-9A-Z])|([0-9A-Z]{14}|[0-9A-Z]{8}-[0-9A-Z]{3})$/;
    const firstCharRegex = /^[0-9]$/;
    const validLengths = [10, 14];
    const length = taxCode.length;
    if (!validLengths.includes(length)) {
        return false;
    }
    if (!firstCharRegex.test(taxCode.charAt(0))) {
        return false;
    }
    if (!taxCodeRegex.test(taxCode)) {
        return false;
    }
    return true;
};

export const ROLE = {
    KOLIFL: { value: 'KOLIFL', code: '0' },
    REC: { value: 'REC', code: '1' },
    ADMIN: { value: 'ADMIN', code: '2' }
};

export const ACTIVITY_PLATFORM_ENUM = [
    {
        name: 'Facebook',
        code: 1
    },
    {
        name: 'Tiktok',
        code: 2
    },
    {
        name: 'Instagram',
        code: 3
    },
    {
        name: 'Youtube',
        code: 4
    }
];

export const SORT_ORDER_TIKTOK = [
    {
        name: 'Tổng doanh thu/Live',
        value: 'totalLiveRevenue'
    },
    {
        name: 'Tổng doanh thu/Video',
        value: 'totalVideoRevenue'
    },
    {
        name: 'Doanh thu/Live',
        value: 'totalAvgLive'
    },
    {
        name: 'Doanh thu/Video',
        value: 'totalAvgVideo'
    },
    {
        name: 'Tổng số lượng Followers',
        value: 'totalFollowersCount'
    }
];

export const SORT_ORDER_TIKTOK_PRODUCT = [
    {
        name: 'Lượt bán',
        value: 'soldCount'
    },
    {
        name: 'Video quảng bá',
        value: 'videoCount'
    },
    {
        name: 'KOC, KOL',
        value: 'tiktokProfileCount'
    }
];

export const NUMBER_OF_FOLLOWER_ENUM = [
    // ALL("ALL", "Tất cả lượng theo dõi", null, null),
    {
        name: 'Tất cả lượng theo dõi',
        code: 0
    },
    // RANGE_LT10("RANGE_LT10", "Dưới 10 ngàn", 0, 10000),
    {
        name: 'Dưới 10 ngàn',
        code: 1,
        value: 'N/A - 10000'
    },
    // RANGE1050("RANGE1050", "10 ngàn - 50 ngàn", 10000, 50000),
    {
        name: '10 ngàn - 50 ngàn',
        code: 2,
        value: '10000 - 50000'
    },
    // RANGE50100("RANGE50100", "50 ngàn - 100 ngàn", 50000, 100000),
    {
        name: '50 ngàn - 100 ngàn',
        code: 3,
        value: '50000 - 100000'
    },
    // RANGE100200("RANGE100200", "100 ngàn - 200 ngàn", 100000, 200000),
    {
        name: '100 ngàn - 200 ngàn',
        code: 4,
        value: '100000 - 200000'
    },
    // RANGE200500("RANGE200500", "200 ngàn - 500 ngàn", 200000, 500000),
    {
        name: '200 ngàn - 500 ngàn',
        code: 5,
        value: '200000 - 500000'
    },
    // RANGE5001TR("RANGE5001TR", "500 ngàn - 1 triệu", 500000, 1000000),
    {
        name: '500 ngàn - 1 triệu',
        code: 6,
        value: '500000 - 1000000'
    },
    // RANGE1TR2TR("RANGE1TR2TR", "1 triệu - 2 triệu", 1000000, 2000000),
    {
        name: '1 triệu - 2 triệu',
        code: 7,
        value: '1000000 - 2000000'
    },
    // RANGE2TR5TR("RANGE2TR5TR", "2 triệu - 5 triệu", 2000000, 5000000),
    {
        name: '2 triệu - 5 triệu',
        code: 8,
        value: '2000000 - 5000000'
    },
    // RANGE5TR10TR("RANGE5TR10TR", "5 triệu - 10 triệu", 5000000, 10000000),
    {
        name: '5 triệu - 10 triệu',
        code: 9,
        value: '5000000 - 10000000'
    },
    // RANGE_GT10TR("RANGE_GT10TR", "Trên 10 triệu", 10000000, null);
    {
        name: 'Trên 10 triệu',
        code: 10,
        value: '10000000 - N/A'
    }
];
export const FOLLOWER_ENUM = [
    // ALL("ALL", "Tất cả lượng theo dõi", null, null),
    {
        name: 'Tất cả lượng theo dõi',
        code: 0
    },
    {
        name: 'Dưới 1 ngàn',
        code: 1,
        value: 'N/A - 1000'
    },
    {
        name: '1 ngàn - 5 ngàn',
        code: 2,
        value: '1000 - 5000'
    },
    {
        name: '5 ngàn - 10 ngàn',
        code: 3,
        value: '5000 - 10000'
    },
    {
        name: '10 ngàn - 50 ngàn',
        code: 4,
        value: '10000 - 50000'
    },
    // RANGE200500("RANGE200500", "200 ngàn - 500 ngàn", 200000, 500000),
    {
        name: '50 ngàn - 100 ngàn',
        code: 5,
        value: '50000 - 100000'
    },
    // RANGE5001TR("RANGE5001TR", "500 ngàn - 1 triệu", 500000, 1000000),
    {
        name: '100 ngàn - 200 ngàn',
        code: 6,
        value: '100000 - 200000'
    },
    // RANGE1TR2TR("RANGE1TR2TR", "1 triệu - 2 triệu", 1000000, 2000000),
    {
        name: '200 ngàn - 500 ngàn',
        code: 7,
        value: '200000 - 500000'
    },
    {
        name: 'Trên 500 ngàn',
        code: 8,
        value: '5000000 - N/A'
    }
];

export const VIDEO_AVG_ENUM = [
    {
        name: 'Dưới 1 ngàn',
        value: 'N/A - 1000'
    },
    {
        name: '1 ngàn - 5 ngàn',
        value: '1000 - 5000'
    },
    {
        name: '5 ngàn - 10 ngàn',
        value: '5000 - 10000'
    },
    {
        name: '10 ngàn - 50 ngàn',
        value: '10000 - 50000'
    },
    {
        name: '50 ngàn - 100 ngàn',
        value: '50000 - 100000'
    },
    {
        name: '100 ngàn - 200 ngàn',
        value: '100000 - 200000'
    },
    {
        name: '200 ngàn - 1 triệu',
        value: '200000 - 1000000'
    },
    {
        name: 'Trên 1 triệu',
        value: '1000000 - N/A'
    }
];

export const TOTAL_AVG_VIDEO_ENUM = [
    {
        name: 'Dưới 100 ngàn',
        value: 'N/A - 100000'
    },
    {
        name: '100 ngàn - 500 ngàn',
        value: '100000 - 500000'
    },
    {
        name: '500 ngàn - 1 triệu',
        value: '500000 - 1000000'
    },
    {
        name: '1 triệu - 2 triệu',
        value: '1000000 - 2000000'
    },
    {
        name: '2 triệu - 5 triệu',
        value: '2000000 - 5000000'
    },
    {
        name: '5 triệu - 10 triệu',
        value: '5000000 - 10000000'
    },
    {
        name: '10 triệu - 20 triệu',
        value: '10000000 - 20000000'
    },
    {
        name: 'Trên 20 triệu',
        value: '20000000 - N/A'
    }
];

export const TOTAL_AVG_LIVE_ENUM = [
    {
        name: 'Dưới 100 ngàn',
        value: 'N/A - 100000'
    },
    {
        name: '100 ngàn - 500 ngàn',
        value: '100000 - 500000'
    },
    {
        name: '500 ngàn - 1 triệu',
        value: '500000 - 1000000'
    },
    {
        name: '1 triệu - 2 triệu',
        value: '1000000 - 2000000'
    },
    {
        name: '2 triệu - 5 triệu',
        value: '2000000 - 5000000'
    },
    {
        name: '5 triệu - 10 triệu',
        value: '5000000 - 10000000'
    },
    {
        name: '10 triệu - 20 triệu',
        value: '10000000 - 20000000'
    },
    {
        name: 'Trên 20 triệu',
        value: '20000000 - N/A'
    }
];

export const TOTAL_AVG_LIVE_REVENUE_ENUM = [
    {
        name: 'Dưới 100 ngàn',
        value: 'N/A - 100000'
    },
    {
        name: '100 ngàn - 1 triệu',
        value: '100000 - 1000000'
    },
    {
        name: '1 triệu - 5 triệu',
        value: '1000000 - 5000000'
    },
    {
        name: '5 triệu - 10 triệu',
        value: '5000000 - 10000000'
    },
    {
        name: '10 triệu - 50 triệu',
        value: '10000000 - 50000000'
    },
    {
        name: '50 triệu - 100 triệu',
        value: '50000000 - 100000000'
    },
    {
        name: '100 triệu - 200 triệu',
        value: '100000000 - 200000000'
    },
    {
        name: 'Trên 200 triệu',
        value: '200000000 - N/A'
    }
];

export const TOTAL_AVG_VIDEO_REVENUE_ENUM = [
    {
        name: 'Dưới 100 ngàn',
        value: 'N/A - 100000'
    },
    {
        name: '100 ngàn - 1 triệu',
        value: '100000 - 1000000'
    },
    {
        name: '1 triệu - 5 triệu',
        value: '1000000 - 5000000'
    },
    {
        name: '5 triệu - 10 triệu',
        value: '5000000 - 10000000'
    },
    {
        name: '10 triệu - 50 triệu',
        value: '10000000 - 50000000'
    },
    {
        name: '50 triệu - 100 triệu',
        value: '50000000 - 100000000'
    },
    {
        name: '100 triệu - 200 triệu',
        value: '100000000 - 200000000'
    },
    {
        name: 'Trên 200 triệu',
        value: '200000000 - N/A'
    }
];

export const LIVE_AVG_ENUM = [
    {
        name: 'Dưới 1 trăm',
        value: 'N/A - 100'
    },
    {
        name: '1 trăm - 5 trăm',
        value: '100 - 500'
    },
    {
        name: '5 trăm - 1 ngàn',
        value: '500 - 1000'
    },
    {
        name: '1 ngàn - 5 ngàn',
        value: '1000 - 5000'
    },
    {
        name: '5 ngàn - 10 ngàn',
        value: '5000 - 10000'
    },
    {
        name: '10 ngàn - 20 ngàn',
        value: '10000 - 20000'
    },
    {
        name: '20 ngàn - 50 ngàn',
        value: '20000 - 50000'
    },
    {
        name: 'Trên 50 ngàn',
        value: '50000 - N/A'
    }
];

export const SALES_AVG_ENUM = [
    {
        name: 'Lượt bán dưới 500',
        value: 'N/A - 500'
    },
    {
        name: 'Lượt bán 500 - 5,000',
        value: '500 - 5000'
    },
    {
        name: 'Lượt bán 5,000 - 20,000',
        value: '5000 - 20000'
    },
    {
        name: 'Lượt bán Trên 20,000',
        value: '20000 - N/A'
    }
];

export const KOC_KOL_ENUM = [
    {
        name: 'KOC, KOL dưới 50',
        value: 'N/A - 50'
    },
    {
        name: 'KOC, KOL 50 - 500',
        value: '50 - 500'
    },
    {
        name: 'KOC, KOL 500 - 5,000',
        value: '500 - 5000'
    },
    {
        name: 'KOC, KOL trên 5,000',
        value: '5000 - N/A'
    }
];

export const VIDEOS_KOC_KOL_AVG_ENUM = [
    {
        name: 'Video quảng bá dưới 50',
        value: 'N/A - 50'
    },
    {
        name: 'Video quảng bá 50 - 500',
        value: '50 - 500'
    },
    {
        name: 'Video quảng bá 500 - 5,000',
        value: '500 - 5000'
    },
    {
        name: 'Video quảng bá trên 5,000',
        value: '5000 - N/A'
    }
];

export const RECRUITMENT_TYPE = {
    SAVED: { name: 'SAVED', code: 0 },
    APPLIED: { name: 'APPLIED', code: 1 },
    INVITED: { name: 'INVITED', code: 2 }
};
export const WAGE_ENUM = [
    {
        name: 'Tất cả mức lương',
        code: 0
    },
    {
        name: '0 - 1 triệu',
        code: 1
    },
    {
        name: '1 - 3 triệu',
        code: 2
    },
    {
        name: '3 - 5 triệu',
        code: 3
    },
    {
        name: '5 - 7 triệu',
        code: 4
    },
    {
        name: '7 - 10 triệu',
        code: 5
    },
    {
        name: '10 - 15 triệu',
        code: 6
    },
    {
        name: '15 - 20 triệu',
        code: 7
    },
    {
        name: '20 - 30 triệu',
        code: 8
    },
    {
        name: '30 - 50 triệu',
        code: 9
    },
    {
        name: 'Trên 50 triệu',
        code: 10
    },
    {
        name: 'Thoả thuận',
        code: 11
    }
];

export const AGE_ENUM = [
    {
        name: 'Tất cả độ tuổi',
        code: 0
    },
    {
        name: 'Dưới 15 tuổi',
        code: 1
    },
    {
        name: '15 tuổi - 20 tuổi',
        code: 2
    },
    {
        name: '20 tuổi - 25 tuổi',
        code: 3
    },
    {
        name: '25 tuổi - 30 tuổi',
        code: 4
    },
    {
        name: '30 tuổi - 40 tuổi',
        code: 5
    },
    {
        name: '40 tuổi - 50 tuổi',
        code: 6
    },
    {
        name: 'Trên 50 tuổi',
        code: 7
    }
];

export const GENDER_ENUM = [
    {
        name: 'Tất cả giới tính',
        code: 0
    },
    {
        name: 'Nam',
        code: 1
    },
    {
        name: 'Nữ',
        code: 2
    },
    {
        name: 'Khác',
        code: 3
    }
];

export const CITY_ENUM = [
    {
        name: 'Hà Nội',
        code: 1
    },
    {
        name: 'Thành phố Hồ Chí Minh',
        code: 2
    },
    {
        name: 'An Giang',
        code: 3
    },
    {
        name: 'Bà Rịa – Vũng Tàu',
        code: 4
    },
    {
        name: 'Bạc Liêu',
        code: 5
    },
    {
        name: 'Bắc Giang',
        code: 6
    },
    {
        name: 'Bắc Kạn',
        code: 7
    },
    {
        name: 'Bắc Ninh',
        code: 8
    },
    {
        name: 'Bến Tre',
        code: 9
    },
    {
        name: 'Bình Dương',
        code: 10
    },
    {
        name: 'Bình Định',
        code: 11
    },
    {
        name: 'Bình Phước',
        code: 12
    },
    {
        name: 'Bình Thuận',
        code: 13
    },
    {
        name: 'Cà Mau',
        code: 14
    },
    {
        name: 'Cao Bằng',
        code: 15
    },
    {
        name: 'Cần Thơ',
        code: 16
    },
    {
        name: 'Đà Nẵng',
        code: 17
    },
    {
        name: 'Đắk Lắk',
        code: 18
    },
    {
        name: 'Đắk Nông',
        code: 19
    },
    {
        name: 'Điện Biên',
        code: 20
    },
    {
        name: 'Đồng Nai',
        code: 21
    },
    {
        name: 'Đồng Tháp',
        code: 22
    },
    {
        name: 'Gia Lai',
        code: 23
    },
    {
        name: 'Hà Giang',
        code: 24
    },
    {
        name: 'Hà Nam',
        code: 25
    },
    {
        name: 'Hà Tĩnh',
        code: 26
    },
    {
        name: 'Hải Dương',
        code: 27
    },
    {
        name: 'Hải Phòng',
        code: 28
    },
    {
        name: 'Hậu Giang',
        code: 29
    },
    {
        name: 'Hòa Bình',
        code: 30
    },
    {
        name: 'Hưng Yên',
        code: 31
    },
    {
        name: 'Khánh Hòa',
        code: 32
    },
    {
        name: 'Kiên Giang',
        code: 33
    },
    {
        name: 'Kon Tum',
        code: 34
    },
    {
        name: 'Lai Châu',
        code: 35
    },
    {
        name: 'Lạng Sơn',
        code: 36
    },
    {
        name: 'Lào Cai',
        code: 37
    },
    {
        name: 'Lâm Đồng',
        code: 38
    },
    {
        name: 'Long An',
        code: 39
    },
    {
        name: 'Nam Định',
        code: 40
    },
    {
        name: 'Nghệ An',
        code: 41
    },
    {
        name: 'Ninh Bình',
        code: 42
    },
    {
        name: 'Ninh Thuận',
        code: 43
    },
    {
        name: 'Phú Thọ',
        code: 44
    },
    {
        name: 'Phú Yên',
        code: 45
    },
    {
        name: 'Quảng Bình',
        code: 46
    },
    {
        name: 'Quảng Nam',
        code: 47
    },
    {
        name: 'Quảng Ngãi',
        code: 48
    },
    {
        name: 'Quảng Ninh',
        code: 49
    },
    {
        name: 'Quảng Trị',
        code: 50
    },
    {
        name: 'Sóc Trăng',
        code: 51
    },
    {
        name: 'Sơn La',
        code: 52
    },
    {
        name: 'Tây Ninh',
        code: 53
    },
    {
        name: 'Thái Bình',
        code: 54
    },
    {
        name: 'Thái Nguyên',
        code: 55
    },
    {
        name: 'Thanh Hóa',
        code: 56
    },
    {
        name: 'Thừa Thiên Huế',
        code: 57
    },
    {
        name: 'Tiền Giang',
        code: 58
    },
    {
        name: 'Trà Vinh',
        code: 59
    },
    {
        name: 'Tuyên Quang',
        code: 60
    },
    {
        name: 'Vĩnh Long',
        code: 61
    },
    {
        name: 'Vĩnh Phúc',
        code: 62
    },
    {
        name: 'Yên Bái',
        code: 63
    }
];

export const CATEGORY_ENUM = [
    {
        name: 'Ẩm thực',
        careerFieldCode: 1
    },
    {
        name: 'Làm đẹp',
        careerFieldCode: 2
    },
    {
        name: 'Thời trang',
        careerFieldCode: 3
    },
    {
        name: 'Sức khỏe',
        careerFieldCode: 4
    },
    {
        name: 'Lifestyle',
        careerFieldCode: 5
    },
    {
        name: 'Mẹ và bé',
        careerFieldCode: 6
    },
    {
        name: 'Du lịch',
        careerFieldCode: 7
    },
    {
        name: 'Công nghệ',
        careerFieldCode: 8
    },
    {
        name: 'Giải trí',
        careerFieldCode: 9
    },
    {
        name: 'Thể thao',
        careerFieldCode: 10
    },
    {
        name: 'Giáo dục',
        careerFieldCode: 11
    },
    {
        name: 'Kinh doanh',
        careerFieldCode: 12
    },
    {
        name: 'Tài chính',
        careerFieldCode: 13
    },
    {
        name: 'Nông nghiệp',
        careerFieldCode: 14
    },
    {
        name: 'Sách',
        careerFieldCode: 15
    },
    {
        name: 'Thú cưng',
        careerFieldCode: 16
    },
    {
        name: 'Nghệ thuật',
        careerFieldCode: 17
    },
    {
        'name': 'Âm nhạc & Nhảy',
        'careerFieldCode': 18
    },
    {
        'name': 'Xe cộ',
        'careerFieldCode': 19,
    },
    {
        'name': 'Mẫu ảnh/Live',
        'careerFieldCode': 20,
    },
    {
        'name': 'Gia dụng',
        'careerFieldCode': 21,
    },
    {
        'name': 'Nội thất',
        'careerFieldCode': 22,
    },
    {
        'name': 'Đồ chơi',
        'careerFieldCode': 23,
    },
    {
        'name': 'Khác',
        'careerFieldCode': 24,
    }
];
export const TIKTOK_CATEGORY_ENUM = [
    {
        name: 'Ẩm thực',
        value: 'affiliate_find_creator_list_filter_category_food'
    },
    {
        name: 'Làm đẹp',
        value: 'affiliate_find_creator_list_filter_category_beauty'
    },
    {
        name: 'Thời trang',
        value: 'affiliate_find_creator_list_filter_category_fashion'
    },
    {
        name: 'Sức khỏe',
        value: 'affiliate_find_creator_list_filter_category_personal_care'
    },
    {
        name: 'Lifestyle',
        value: 'affiliate_find_creator_list_filter_category_lifestyle'
    },
    {
        name: 'Mẹ và bé',
        value: 'affiliate_find_creator_list_filter_category_mom_babies'
    },
    {
        name: 'Công nghệ',
        value: 'affiliate_find_creator_list_filter_category_electronics'
    }
];

export const RECRUITMENT_STATUS_ENUM = [
    {
        name: 'Chờ duyệt',
        code: 0
    },
    {
        name: 'Tạm duyệt',
        code: 3
    },
    {
        name: 'Đã duyệt',
        code: 1
    },
    {
        name: 'Từ chối',
        code: 2
    }
];

export const SOCIAL_NETWORK = [
    { name: 'Facebook', code: 1 },
    { name: 'Tiktok', code: 2 },
    { name: 'Instagram', code: 3 },
    { name: 'Youtube', code: 4 }
];
export const DEV_URL = process.env.API_URL;

export const API_WITHOUT_TOKEN = [
    `${process.env.API_URL}/api/kols/auth/login`,
    `${process.env.API_URL}/api/kols/auth/refresh-token`,
    `${process.env.API_URL}/api/kols/account/signup`,
    `${process.env.API_URL}/api/kols/account/send-mail-signup`,
    `${process.env.API_URL}/api/kols/global/kolsInfluencer/search`,
    `${process.env.API_URL}/api/kols/global/recruitment/search`,
    `${process.env.API_URL}/api/kols/global/post/selectTop3`
];

export const ALLOWED_HTTP_REQUEST = ['POST', 'GET', 'PUT', 'DELETE'];

export const formatCurrencyVND = (currency) => {
    return currency?.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
};

const numberWithDot = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const NEEDED_CLOSE_MENU = ['/', '/components/influencer-ranking/', '/components/blog/', '/components/search-candidates/', '/components/search-recruitments/'];

export const OTP_REGEX = /^[0-9]{8}$/;

export const BANKSNAPAS = [
    { code: 1, vn_name: 'Ngân hàng thương mại cổ phần Ngoại thương Việt Nam (VIETCOMBANK)' },
    { code: 2, vn_name: 'Ngân hàng Đầu tư và Phát triển Việt Nam (BIDV)' },
    { code: 3, vn_name: 'Ngân hàng Công thương Việt Nam (VIETINBANK)' },
    { code: 4, vn_name: 'Ngân hàng Kỹ thương Việt Nam (TECHCOMBANK)' },
    { code: 5, vn_name: 'Ngân hàng Việt Nam Thịnh Vượng (VPBANK)' },
    { code: 6, vn_name: 'Ngân hàng nông nghiệp và phát triển nông thôn Việt Nam (AGRIBANK)' },
    { code: 7, vn_name: 'Ngân hàng Quân Đội (MB)' },
    { code: 8, vn_name: 'Ngân hàng Sài Gòn thương tín (SACOMBANK)' },
    { code: 9, vn_name: 'Ngân hàng Á Châu (ACB)' },
    { code: 10, vn_name: 'CitiBank VietNam' },
    { code: 11, vn_name: 'Công ty Tài chính TNHH MTV Mirae Asset Việt Nam (MAFC)' },
    { code: 12, vn_name: 'Ngân hàng An Bình (ABBank)' },
    { code: 13, vn_name: 'Ngân hàng Bưu điện Liên Việt (LPBank)' },
    { code: 14, vn_name: 'Ngân hàng Bản Việt (Viet Capital Bank)' },
    { code: 15, vn_name: 'Ngân hàng Bắc Á (Bac A Bank)' },
    { code: 16, vn_name: 'Ngân hàng Cake By VPBank (CAKE)' },
    { code: 17, vn_name: 'Ngân hàng CIMB Việt Nam (CIMB)' },
    { code: 18, vn_name: 'Ngân hàng Dầu khí toàn cầu (GPBank)' },
    { code: 19, vn_name: 'Ngân hàng Hong Leong Việt Nam (HLBank)' },
    { code: 20, vn_name: 'Ngân hàng Hàng Hải (MSB)' },
    { code: 21, vn_name: 'Ngân hàng Kiên Long (Kien Long Bank)' },
    { code: 22, vn_name: 'Ngân hàng Liên doanh Việt Nga (VRB)' },
    { code: 23, vn_name: 'Ngân hàng Nam Á (Nam A Bank)' },
    { code: 24, vn_name: 'Ngân hàng DBS - Chi nhánh Hồ Chí Minh (DBS)' },
    { code: 25, vn_name: 'Ngân hàng Kookmin - Chi nhánh Thành phố Hồ Chí Minh (KBHCM)' },
    { code: 26, vn_name: 'Ngân hàng Kookmin - Chi nhánh Hà Nội (KBHN)' },
    { code: 27, vn_name: 'Ngân hàng TNHH MTV Public Việt Nam (PBVN)' },
    { code: 28, vn_name: 'Ngân hàng Nonghuyp - Chi nhánh Hà Nội (NONGHUYP)' },
    { code: 29, vn_name: 'Ngân hàng Phương Đông (OCB)' },
    { code: 30, vn_name: 'Ngân hàng Quốc Dân (NCB)' },
    { code: 31, vn_name: 'Ngân hàng Quốc tế (VIB)' },
    { code: 32, vn_name: 'Ngân hàng Shinhan Bank Việt Nam (SHINHAN)' },
    { code: 33, vn_name: 'Ngân hàng Sài Gòn Công Thương (SAIGONBANK)' },
    { code: 34, vn_name: 'Ngân hàng Sài Gòn Hà Nội (SHB)' },
    { code: 35, vn_name: 'Ngân hàng TNHH MTV HSBC Việt Nam (HSBC)' },
    { code: 36, vn_name: 'Ngân hàng TNHH MTV Standard Chartered Việt Nam (SCVN)' },
    { code: 37, vn_name: 'Ngân hàng Trách nhiệm hữu hạn Indovina (IVB)' },
    { code: 38, vn_name: 'Ngân hàng UBBANK BY VPBANK (UBANK)' },
    { code: 39, vn_name: 'Ngân hàng UOB Việt Nam (UOB VN)' },
    { code: 40, vn_name: 'Ngân hàng Việt Nam Thương Tín (VIETBANK)' },
    { code: 41, vn_name: 'Ngân hàng Việt Á (VIET A BANK)' },
    { code: 42, vn_name: 'Ngân hàng Xuất Nhập Khẩu (EXIMBANK)' },
    { code: 43, vn_name: 'Ngân hàng Xăng dầu Petrolimex (PGBANK)' },
    { code: 44, vn_name: 'Ngân hàng Đông Á (DONG A BANK)' },
    { code: 45, vn_name: 'Ngân hàng Đại chúng (PVCOMBANK)' },
    { code: 46, vn_name: 'Ngân hàng Bảo Việt (BVB)' },
    { code: 47, vn_name: 'Ngân hàng Chính sách Xã hội VBSP (VBSP)' },
    { code: 48, vn_name: 'Ngân hàng Công nghiệp Hàn Quốc (IBK BANK)' },
    { code: 49, vn_name: 'Ngân hàng Hợp tác xã Việt Nam (CO-OPBANK)' },
    { code: 50, vn_name: 'Ngân hàng KEB HANA - Chi nhánh Hà Nội (KEB HANA)' },
    { code: 51, vn_name: 'Ngân hàng KEB HANA - Chi nhánh Thành phố Hồ Chí Minh (KEB HANA)' },
    { code: 52, vn_name: 'Ngân hàng Phát triển TP.HCM (HD BANK)' },
    { code: 53, vn_name: 'Ngân hàng Sài Gòn (SCB)' },
    { code: 54, vn_name: 'Ngân hàng Tiên Phong (TPBANK)' },
    { code: 55, vn_name: 'Ngân hàng Woori Bank Việt Nam (WOORI)' },
    { code: 56, vn_name: 'Ngân hàng Xây dựng (CBBANK)' },
    { code: 57, vn_name: 'Ngân hàng số LioBank - Ngân hàng TMCP Phương Đông (LioBank)' },
    { code: 58, vn_name: 'Ngân hàng số Timo - Ngân hàng TMCP Bản Việt (Timo by Ban Viet Bank)' },
    { code: 59, vn_name: 'Ngân hàng số UMEE by Kienlongbank (UMEE)' },
    { code: 60, vn_name: 'Ngân hàng Đông Nam Á (SEABANK)' },
    { code: 61, vn_name: 'Ngân hàng Đại dương (OCEANBANK)' },
    { code: 62, vn_name: 'Ngân hàng đại chúng TNHH KASIKORNBANK - Chi nhánh thành phố Hồ Chí Minh (KBank)' },
    { code: 63, vn_name: 'VNPT Money' },
    { code: 64, vn_name: 'Viettel Money' }
];

export const EFFECTIVE_ENUM = [
    {
        name: 'Chưa đăng bài',
        code: 0
    },
    {
        name: 'Có đăng bài',
        code: 1
    }
];

export const CONVERT_FULL_CITY_TO_ACRONYM = [
    {
        'Thành phố Hồ Chí Minh': 'TP.HCM',
        'Tất cả tỉnh thành': 'Tất cả tỉnh thành'
    }
];
export const convertAcronym = (text) => {
    let valueConvert = CONVERT_FULL_CITY_TO_ACRONYM.map((value) => value[text]);
    if (valueConvert[0] != undefined) return valueConvert;
    return text;
};

export const RULE_UPDATE_PROFILE_CREATE_RECRUITMENT = ['companyName', 'specificAddress', 'contactName', 'contactPhone', 'contactEmail'];
export const RULE_UPDATE_PROFILE_PROFILE = ['profileImage', 'fullName', 'birthYear', 'gender', 'careerFields', 'phoneNumber', 'email'];

export const handleOnChangeCareerAndValidateMaxFive = (event, toast, setFieldValue) => {
    if (event?.target?.value?.length > 3) {
        toast.current.show({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Chỉ được chọn tối đa 3 lĩnh vực'
        });
        return;
    }
    return setFieldValue('careerFieldRequests', event.target.value);
};

export const formatUrlExact = (url) => {
    if (!url) return url;

    let newUrl = window.decodeURIComponent(url);
    newUrl = newUrl.trim().replace(/\s/g, '');

    if (/^(:\/\/)/.test(newUrl)) {
        return `http${newUrl}`;
    }
    if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
        return `https://${newUrl}`;
    }
    return newUrl;
};

export const defineSocialIcon = {
    tiktok: '<i class="fab fa-tiktok"></i>',
    facebook: '<i class="fab fa-square-facebook"></i>',
    youtube: '<i class="fab fa-youtube" ></i>',
    instagram: '<i class="fab fa-instagram"></i>'
};

export const formatPriceVnd = (price, calculateThousand = false) => {
    let value = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    let priceNew = Math.round(!!price && price > 0 ? price / 1000 : price);
    return !!calculateThousand ? priceNew + 'k đ' : value;
};

/**
 * @param (Number)
 * @returns String || 0
 */
export const formatNumberThousands = (number) => {
    return !!number ? Math.round(number)?.toLocaleString('en-US') : 0;
};

export const formatViewsThousand = (views) => {
    if (!views) return 0;
    return views >= 1000 ? Math.floor(views / 1000) + 'k' : views;
};

export const dataAndStyleChartDoughnut = () => {
    return {
        veryLow: {
            value: [20, 80],
            style: 'red',
            percent: 20,
            titlePercentType: 'Rất thấp'
        },
        low: {
            value: [40, 60],
            style: 'orange',
            percent: 40,
            titlePercentType: 'Thấp'
        },
        medium: {
            value: [60, 40],
            style: 'yellow',
            percent: 60,
            titlePercentType: 'Trung bình'
        },
        high: {
            value: [80, 20],
            style: 'green',
            percent: 80,
            titlePercentType: 'Cao'
        },
        VeryHigh: {
            value: [100, 0],
            style: 'blue',
            percent: 100,
            titlePercentType: 'Rất cao'
        }
    };
};

export const defineValueLikePerView = (value) => {
    let data = dataAndStyleChartDoughnut()?.veryLow;
    let totalPercent = '5.5%-8.5%';
    if (value > 3 && value < 5.5) {
        data = dataAndStyleChartDoughnut()?.low;
    } else if (value > 5.5 && value < 8.5) {
        data = dataAndStyleChartDoughnut()?.medium;
    } else if (value > 8.5 && value < 11) {
        data = dataAndStyleChartDoughnut()?.high;
    } else if (value > 11) {
        data = dataAndStyleChartDoughnut()?.VeryHigh;
    }
    data = { ...data, ...{ totalPercent: totalPercent, valuePercent: value } };
    return data;
};

export const defineValueSharePerView = (value) => {
    let data = dataAndStyleChartDoughnut()?.veryLow;
    let totalPercent = '0.045%-0.075%';
    if (value > 0.02 && value < 0.045) {
        data = dataAndStyleChartDoughnut()?.low;
    } else if (value > 0.045 && value < 0.075) {
        data = dataAndStyleChartDoughnut()?.medium;
    } else if (value > 0.075 && value < 0.1) {
        data = dataAndStyleChartDoughnut()?.high;
    } else if (value > 0.1) {
        data = dataAndStyleChartDoughnut()?.VeryHigh;
    }
    data = { ...data, ...{ totalPercent: totalPercent, valuePercent: value } };
    return data;
};

export const defineValueCommentPerView = (value) => {
    let data = dataAndStyleChartDoughnut()?.veryLow;
    let totalPercent = '0.065%-0.095%';
    if (value > 0.04 && value < 0.065) {
        data = dataAndStyleChartDoughnut()?.low;
    } else if (value > 0.065 && value < 0.095) {
        data = dataAndStyleChartDoughnut()?.medium;
    } else if (value > 0.095 && value < 0.12) {
        data = dataAndStyleChartDoughnut()?.high;
    } else if (value > 0.12) {
        data = dataAndStyleChartDoughnut()?.VeryHigh;
    }
    data = { ...data, ...{ totalPercent: totalPercent, valuePercent: value } };
    return data;
};

export const defineValueViewPerFollower = (value) => {
    let data = dataAndStyleChartDoughnut()?.veryLow;
    let totalPercent = '10%-15%';
    if (value > 5 && value < 10) {
        data = dataAndStyleChartDoughnut()?.low;
    } else if (value > 10 && value < 15) {
        data = dataAndStyleChartDoughnut()?.medium;
    } else if (value > 15 && value < 20) {
        data = dataAndStyleChartDoughnut()?.high;
    } else if (value > 20) {
        data = dataAndStyleChartDoughnut()?.VeryHigh;
    }
    data = { ...data, ...{ totalPercent: totalPercent, valuePercent: value } };
    return data;
};

export const defineTypeChart = {
    likeView: 'Like/View',
    shareView: 'Share/View',
    commentView: 'Comment/View',
    viewFollower: 'View/Follower'
};

export const calculateAndCutomChartForInteract = (value, type) => {
    value = value * 100;
    switch (type) {
        case defineTypeChart.likeView:
            value = value > 0 ? value?.toFixed(1) : 0;
            return defineValueLikePerView(value);
        case defineTypeChart.shareView:
            value = value > 0 ? value?.toFixed(3) : 0;
            return defineValueSharePerView(value);
        case defineTypeChart.commentView:
            value = value > 0 ? value?.toFixed(3) : 0;
            return defineValueCommentPerView(value);
        case defineTypeChart.viewFollower:
            value = value > 0 ? value?.toFixed(1) : 0;
            return defineValueViewPerFollower(value);
        default:
            break;
    }
};

export const calculateEngagementRate = (totalLikes = 0, totalComments, totalShares, totalViews) => {
    if (!totalViews) return 0 + '%';
    const value = (((totalLikes + totalComments + totalShares) / totalViews) * 100)?.toFixed(1);
    return (!!value ? value : 0) + '%';
};

export const formartDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
};

export const calculateSerialNumber = (index, page, pageSize) => {
    const stt = index + 1 + (page - 1) * pageSize;
    return stt;
};

export const filterParamURL = ['kolsInfluencerName', 'careerFieldRequests', 'workingAgeRequests', 'kolsGenderRequests', 'tiktokFollowerRequests', 'socialNetworks', 'sorting'];

export const getParams = () => {
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        let params = new URLSearchParams(url.search);
        if (params.has('mask')) {
            params.delete('mask');
        }

        if (params.has('id')) {
            params.delete('id');
        }
        return params;
    }
};

export const hanldeChangeParamURL = (name, value, router, path) => {
    let valueParam = value;
    let isRun = !!valueParam;

    if (typeof value === 'object') {
        valueParam = JSON.stringify(value);
        isRun = !!valueParam && valueParam.length > 2;
    }
    const params = getParams();

    params.set(name, value);
    if (isRun) params.set(name, valueParam);
    else params.delete(name);
    let fullPath = params.size > 0 ? path + '?' + params.toString() : '';
    router.push(fullPath, undefined, { scroll: false });
};

const PackageTraiNghiem = {
    listService: [
        {
            title: 'Chủ động tìm kiếm',
            titleHelper: '',
            helper: false
        },
        {
            title: 'Phân tích chỉ số doanh thu',
            titleHelper: '',
            helper: false
        },
        {
            title: 'Đăng tin tìm kiếm',
            titleHelper: '',
            helper: false
        },
        {
            title: 'Quản lý influencer',
            titleHelper: '',
            helper: false
        },
        {
            title: 'Quản lý chiến dịch',
            titleHelper: '',
            helper: false
        },
        {
            title: 'Tiếp cận 500 influencer/ tháng',
            titleHelper: '',
            helper: false
        },
        {
            title: '150 lượt tìm kiếm và lọc',
            titleHelper: "Tại trang tìm kiếm influencer, khi bạn click vào nút 'Tìm kiếm', thì danh sách gồm 10 Influencer sẽ được hiển thị. Đây chính là 'Số lượt tìm kiếm'",
            helper: true
        },
        {
            title: '5 lượt sang trang',
            titleHelper: "Tại trang tìm kiếm influencer, khi bạn click sang trang tiếp theo, thì danh sách 10 influencer sẽ được hiển thị. Đây chính là 'Số lượt click sang trang'",
            helper: true
        }
    ],
    type: 'Mua ngay'
};

const PackageCoBan = {
    listService: [
        {
            title: 'Bao gồm tất cả tính năng ở gói Free',
            helper: false,
            titleHelper: ''
        },
        {
            title: 'Tiếp cận 600 Influencer/tháng',
            helper: false,
            titleHelper: ''
        },
        {
            title: '150 lượt tìm kiếm và lọc',
            helper: true,
            titleHelper: "Tại trang tìm kiếm influencer, khi bạn click vào nút 'Tìm kiếm', thì danh sách gồm 10 Influencer sẽ được hiển thị. Đây chính là 'Số lượt tìm kiếm'"
        },
        {
            title: '15 lượt sang trang',
            titleHelper: "Tại trang tìm kiếm influencer, khi bạn click sang trang tiếp theo, thì danh sách 10 influencer sẽ được hiển thị. Đây chính là 'Số lượt click sang trang'",
            helper: true
        }
    ],
    type: 'Mua ngay'
};

const PackageTieuChuan = {
    listService: [
        {
            title: 'Bao gồm tất cả tính năng ở gói Free',
            helper: false,
            titleHelper: ''
        },
        {
            title: 'Tiếp cận 1400 Influencer/tháng',
            helper: false,
            titleHelper: ''
        },
        {
            title: '300 lượt tìm kiếm và lọc',
            helper: true,
            titleHelper: "Tại trang tìm kiếm influencer, khi bạn click vào nút 'Tìm kiếm', thì danh sách gồm 10 Influencer sẽ được hiển thị. Đây chính là 'Số lượt tìm kiếm'"
        },
        {
            title: '50 lượt sang trang',
            helper: true,
            titleHelper: "Tại trang tìm kiếm influencer, khi bạn click sang trang tiếp theo, thì danh sách 10 influencer sẽ được hiển thị. Đây chính là 'Số lượt click sang trang'"
        }
    ],
    type: 'Mua ngay'
};

const PackageNangCao = {
    listService: [
        {
            title: 'Bao gồm tất cả tính năng ở gói Free',
            helper: false,
            titleHelper: ''
        },
        {
            title: 'Tiếp cận 5600 Influencer/tháng',
            helper: false,
            titleHelper: ''
        },
        {
            title: '1200 lượt tìm kiếm và lọc',
            helper: true,
            titleHelper: "Tại trang tìm kiếm influencer, khi bạn click vào nút 'Tìm kiếm', thì danh sách gồm 10 Influencer sẽ được hiển thị. Đây chính là 'Số lượt tìm kiếm'"
        },
        {
            title: '200 lượt sang trang',
            helper: true,
            titleHelper: "Tại trang tìm kiếm influencer, khi bạn click sang trang tiếp theo, thì danh sách 10 influencer sẽ được hiển thị. Đây chính là 'Số lượt click sang trang'"
        }
    ],
    type: 'Mua ngay'
};

const PackageTuyChinh = {
    listService: [
        {
            title: 'Bao gồm tất cả tính năng ở gói Free',
            helper: false,
            titleHelper: ''
        },
        {
            title: 'Tùy chỉnh  số lượng tiếp cận Influencer theo nhu cầu',
            helper: false,
            titleHelper: ''
        },
        {
            title: 'Điều chỉnh riêng gói sản phẩm theo nhu cầu',
            helper: false,
            titleHelper: ''
        }
    ],
    type: 'Liên hệ'
};

export const listPricings = (codePackage) => {
    let packageData = '';
    switch (codePackage) {
        case 'trainghiem':
            packageData = PackageTraiNghiem;
            break;
        case 'coban':
            packageData = PackageCoBan;
            break;
        case 'tieuchuan':
            packageData = PackageTieuChuan;
            break;
        case 'nangcao':
            packageData = PackageNangCao;
            break;
        case 'lienhe':
            packageData = PackageTuyChinh;
            break;
        default:
            break;
    }

    return packageData;
};

export const listCommissionRank = [
    {
        rank: 'Bạc',
        spendingBrand: '0 - 10.000.000đ',
        commissionSale: '10%',
        value: [0, 10000000]
    },
    {
        rank: 'Vàng',
        spendingBrand: '10.000.000đ - 100.000.000đ',
        commissionSale: '15%',
        value: [10000000, 100000000]
    },
    {
        rank: 'Kim cương',
        spendingBrand: '100.000.000đ - 500.000.000đ',
        commissionSale: '20%',
        value: [100000000, 500000000]
    },
    {
        rank: 'Tinh anh',
        spendingBrand: 'Trên 500.000.000đ',
        commissionSale: '25%',
        value: [500000000, 0]
    }
];

export const listMonth = [
    { name: '1', code: 1 },
    { name: '2', code: 2 },
    { name: '3', code: 3 },
    { name: '5', code: 5 },
    { name: '6', code: 6 },
    { name: '7', code: 7 },
    { name: '8', code: 8 },
    { name: '9', code: 9 },
    { name: '10', code: 10 },
    { name: '11', code: 11 },
    { name: '12', code: 12 }
];

export const nameCookieRef = 'referralCode';

export const SERVICE_ENUM = [
    {
        name: 'TikTok Video',
        code: 'TIKTOK_VIDEO'
    },
    {
        name: 'TikTok Live',
        code: 'TIKTOK_LIVE'
    }
];

export const BOOKKING_FILTER_ENUM = [
    {
        name: '0đ - 500,000đ',
        value: '0-500000'
    },
    {
        name: '500,000đ - 1,000,000đ',
        value: '500000-1000000'
    },
    {
        name: '1,000,000đ - 2,000,000đ',
        value: '1000000-2000000'
    },
    {
        name: '2,000,000đ - 5,000,000đ',
        value: '2000000-5000000'
    },
    {
        name: '5,000,000đ - 10,000,000đ',
        value: '5000000-10000000'
    },
    {
        name: '10,000,000đ - 20,000,000đ',
        value: '10000000-20000000'
    },
    {
        name: 'Trên 20,000,000đ',
        value: '20000000-N/A'
    }
];

export const FOLLOWER_SEARCH_KOC_ENUM = [
    {
        name: 'Dưới 1,000',
        value: 'N/A - 1000'
    },
    {
        name: '1,000 - 5,000',
        value: '1000 - 5000'
    },
    {
        name: '5,000 - 10,000',
        value: '5000 - 10000'
    },
    {
        name: '10,000 - 50,000',
        value: '10000 - 50000'
    },
    {
        name: '50,000 - 100,000',
        value: '50000 - 100000'
    },
    {
        name: '100,000 - 200,000',
        value: '100000 - 200000'
    },
    {
        name: '200,000 - 500,000',
        value: '200000 - 500000'
    },
    {
        name: 'Trên 500,000',
        value: '500000 - N/A'
    }
];

export const AVG_VIDEO_LIVE_SEARCH_KOC_ENUM = [
    {
        name: 'Dưới 100,000đ',
        value: 'N/A - 100000'
    },
    {
        name: '100,000đ - 500,000đ',
        value: '100000 - 500000'
    },
    {
        name: '500,000đ - 1,000,000đ',
        value: '500000 - 1000000'
    },
    {
        name: '1,000,000đ - 5,000,000đ',
        value: '1000000 - 5000000'
    },
    {
        name: '5,000,000đ - 10,000,000đ',
        value: '5000000 - 10000000'
    },
    {
        name: '10,000,000đ - 20,000,000đ',
        value: '10000000 - 20000000'
    },
    {
        name: 'Trên 20,000,000đ',
        value: '20000000 - N/A'
    }
];

export const ROLE_CONTANT = ['KOLIFL', 'REC', 'ADMIN'];

export const dateDeadLine = (expectedDay) => {
    if (!expectedDay) return;
    const getYear = new Date().getFullYear();
    const getMonth = new Date().getMonth();
    const getDate = new Date().getDate();
    const today = moment().year(getYear).month(getMonth).date(getDate);
    if (today > expectedDay) {
        return `Deadline: Đã quá hạn ${today.diff(expectedDay, 'days')} ngày.`;
    }

    if (today < expectedDay) {
        return `Deadline: Còn lại ${expectedDay.diff(today, 'days')} ngày.`;
    }

    if (moment(expectedDay).isSame(today)) {
        return `Deadline: Đã đến hạn.`;
    }

    return '';
};

export const setContentStatusOrder = (role, expectedDay, requestRedoCount, results) => {
    const isSecond = !!results && results?.some((value) => value?.time > 1);

    if (role == ROLE_CONTANT[1]) {
        if (requestRedoCount == 0 && results?.length == 0) {
            return ['Vui lòng chờ KOC gửi link hoặc file công việc.Nếu KOC quá hạn 7 ngày so với Ngày mong đợi hoàn thành công việc, bạn có thể hủy đơn hàng và hoàn lại tiền cọc.', dateDeadLine(expectedDay)];
        }

        if (requestRedoCount == 0 && results?.length > 0) {
            return ['KOC đã gửi file/link công việc.', 'Bạn có thể "Hoàn tất đơn hàng để thanh toán cho KOC hoặc "Yêu cầu làm lại" nếu chưa hài lòng với kết quả công việc.', dateDeadLine(expectedDay)];
        }

        if (requestRedoCount > 0 && results?.length > 0 && !isSecond) {
            return ['KOC đang làm lại theo yêu cầu của bạn.', dateDeadLine(expectedDay)];
        }

        if (!!isSecond) {
            return ['KOC đã gửi lại file/link công việc.', 'Bạn có thể Hoàn tất đơn hàng để thanh toán cho KOC.', dateDeadLine(expectedDay)];
        }
    }

    if (role == ROLE_CONTANT[0]) {
        if (requestRedoCount == 0 && results?.length == 0) {
            return ['Gửi link hoặc file công việc đến nhãn hàng.', dateDeadLine(expectedDay)];
        }

        if (requestRedoCount == 0 && results?.length > 0) {
            return ['Chờ nhãn hàng kiểm duyệt kết quả công việc.', 'Nhãn hàng có 01 lần yêu cầu chỉnh sửa.', dateDeadLine(expectedDay)];
        }

        if (requestRedoCount > 0 && results?.length > 0 && !isSecond) {
            return ['Nhãn hàng yêu cầu làm lại.', dateDeadLine(expectedDay)];
        }

        if (!!isSecond) {
            return ['Chờ nhãn hàng kiểm duyệt kết quả công việc và thanh toán.', dateDeadLine(expectedDay)];
        }
    }
};

export const pending = 'WAITING_CONFIRM';
export const inProcess = 'IN_PROGRESS';
export const complete = 'COMPLETED';

//Define history
const DEPOSIT = 'DEPOSIT'; // "DEPOSIT", "Nạp tiền"
const WITHDRAW = 'WITHDRAW'; // "WITHDRAW", "Rút tiền"
const PAYMENT = 'PAYMENT'; // "PAYMENT", "Thanh toán cho đơn hàng"
const REFUND = 'REFUND'; // "REFUND", "Hoàn tiền cho đơn hàng"
const TEMPORARY = 'TEMPORARY'; // "TEMPORARY", "Tạm giữ tiền"
const REFERRAL = 'REFERRAL'; // "REFERRAL", "Tiền thưởng giới thiệu"

export const colorRed = [WITHDRAW, PAYMENT, TEMPORARY];
export const colorBlue = [REFERRAL, DEPOSIT, REFUND];

export const defineTitleType = {
    DEPOSIT: 'Nạp tiền',
    WITHDRAW: 'Rút tiền',
    PAYMENT: 'Thanh toán cho đơn hàng',
    REFUND: 'Hoàn tiền cho đơn hàng',
    TEMPORARY: 'Tạm giữ tiền',
    REFERRAL: 'Tiền thưởng giới thiệu'
};

export const checkTextColor = (type) => {
    if (!type) return;

    if (colorRed.includes(type)) {
        return 'text-primary';
    }

    if (colorBlue.includes(type)) {
        return 'text-blue-400';
    }
};
