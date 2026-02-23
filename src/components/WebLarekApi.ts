import { 
  IApi, 
  IProduct, 
  IOrder, 
  IProductsResponse, 
  IOrderResponse 
} from '../types';

export class WebLarekApi {
    constructor(private api: IApi) {}

    // Получить список товаров с сервера
    getProducts(): Promise<IProduct[]> {
  return this.api
    .get<IProductsResponse>('/product/')
    .then(response => response.items);
}

    // Отправить заказ на сервер
    postOrder(order: IOrder): Promise<IOrderResponse> {
  return this.api.post<IOrderResponse>('/order/', order);
}
}