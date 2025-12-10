export interface Province {
    code: number;
    name: string;
    division_type: string;
    codename: string;
    phone_code: number;
}

export interface District {
    code: number;
    name: string;
    division_type: string;
    codename: string;
    province_code: number;
}

export interface Ward {
    code: number;
    name: string;
    division_type: string;
    codename: string;
    district_code: number;
}

const BASE_URL = 'https://provinces.open-api.vn/api';

export const locationService = {
    // Lấy danh sách tất cả tỉnh/thành phố
    async getProvinces(): Promise<Province[]> {
        try {
            const response = await fetch(`${BASE_URL}/?depth=1`);
            if (!response.ok) throw new Error('Failed to fetch provinces');
            return response.json();
        } catch (error) {
            console.error('Error fetching provinces:', error);
            return [];
        }
    },

    // Lấy danh sách quận/huyện theo mã tỉnh
    async getDistricts(provinceCode: number): Promise<District[]> {
        try {
            const response = await fetch(`${BASE_URL}/p/${provinceCode}?depth=2`);
            if (!response.ok) throw new Error('Failed to fetch districts');
            const data = await response.json();
            return data.districts || [];
        } catch (error) {
            console.error('Error fetching districts:', error);
            return [];
        }
    },

    // Lấy danh sách phường/xã theo mã quận/huyện
    async getWards(districtCode: number): Promise<Ward[]> {
        try {
            const response = await fetch(`${BASE_URL}/d/${districtCode}?depth=2`);
            if (!response.ok) throw new Error('Failed to fetch wards');
            const data = await response.json();
            return data.wards || [];
        } catch (error) {
            console.error('Error fetching wards:', error);
            return [];
        }
    },

    // Tìm mã code từ tên (Hỗ trợ việc hiển thị lại dữ liệu khi edit)
    async findCodesByName(provinceName: string, districtName: string, wardName?: string) {
        try {
            // 1. Tìm province code
            const provinces = await this.getProvinces();
            const province = provinces.find(p => p.name === provinceName);
            if (!province) return null;

            // 2. Tìm district code
            const districts = await this.getDistricts(province.code);
            const district = districts.find(d => d.name === districtName);
            if (!district) return { provinceCode: province.code };

            // 3. Tìm ward code (nếu có)
            let wardCode = undefined;
            if (wardName) {
                const wards = await this.getWards(district.code);
                const ward = wards.find(w => w.name === wardName);
                if (ward) wardCode = ward.code;
            }

            return {
                provinceCode: province.code,
                districtCode: district.code,
                wardCode
            };
        } catch (error) {
            console.error('Error finding location codes:', error);
            return null;
        }
    }
};
