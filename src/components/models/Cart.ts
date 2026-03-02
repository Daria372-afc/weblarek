import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Cart {
  private items: IProduct[] = [];
  private events: EventEmitter;

  constructor(events: EventEmitter) {
  this.events = events;
}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct) {
    if (!this.items.find(p => p.id === product.id)) {
      this.items.push(product);

       this.events.emit('basket:changed');
    }
  }

  removeItem(product: IProduct) {
    this.items = this.items.filter(p => p.id !== product.id);
     this.events.emit('basket:changed');
  }

  clear() {
    this.items = [];
     this.events.emit('basket:changed');
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