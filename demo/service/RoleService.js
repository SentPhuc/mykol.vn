import axios from 'axios';
import {BaseService} from './BaseService';

export class RoleService extends BaseService {
    constructor() {
        super('role');
    }
}