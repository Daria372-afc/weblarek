import { IProduct } from '../../../types';

export class Cart {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct) {
    if (!this.items.find(p => p.id === product.id)) {
      this.items.push(product);
    }
  }

  removeItem(product: IProduct) {
    this.items = this.items.filter(p => p.id !== product.id);
  }

  clear() {
    this.items = [];
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, p) => sum + (p.price ?? 0), 0);
  }

  getItemsCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(p => p.id === id);
  }
}