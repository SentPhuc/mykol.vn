import axios from 'axios';
import { BaseService } from './BaseService';
import { EMAIL } from '../../src/commons/Constant';

export class ProductsService extends BaseService {
    constructor() {
        super('products');
    }
    /**
     *
     * @param name
     * @param soldCount
     * @param videoCount
     * @param reviewCount
     * @returns axios
     */
    search(data) {
        return axios.post(`${this.baseUrl}`, data, {
            headers: {
                ['Content-Type']: 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*'
            }
        });
    }

    videos(productId, tiktokProfileId) {
        return axios.post(
            `${this.baseUrl}/videos`,
            {
                productId,
                tiktokProfileId
            },
            {
                headers: {
                    ['Content-Type']: 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                }
            }
        );
    }
}
