import { IApi, IProduct, IOrder } from '../types';

export class WebLarekApi {
    constructor(private api: IApi) {}

    // Получить список товаров с сервера
    getProducts(): Promise<IProduct[]> {
        return this.api.get<IProduct[]>('/product/');
    }

    // Отправить заказ на сервер
    postOrder(order: IOrder): Promise<object> {
        return this.api.post('/order/', order);
    }
}