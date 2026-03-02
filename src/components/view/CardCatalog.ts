import { IEvents } from '../base/Events';
import { Card } from './Card';
import { IProduct } from '../../types';

export class CardCatalog extends Card {
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.container.addEventListener('click', () => {
      this.events.emit('card:select', { id: this.container.dataset.id });
    });
  }

  render(data: IProduct): HTMLElement {
    this.container.dataset.id = data.id;

    this.titleValue = data.title;
    this.priceValue = data.price;
    this.imageValue = data.image;
    this.categoryValue = data.category;

    return this.container;
  }
}