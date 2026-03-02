import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Products {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;
  private events: EventEmitter;

  constructor(events: EventEmitter) {
  this.events = events;
}

  setProducts(products: IProduct[]) {
    this.products = products;

     this.events.emit('products:changed');
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(p => p.id === id);
  }

  setSelectedProduct(product: IProduct) {
    this.selectedProduct = product;

     this.events.emit('product:selected');
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}