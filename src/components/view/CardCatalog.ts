import { IEvents } from '../base/Events';
import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';

export class CardCatalog extends Card {
  protected image: HTMLImageElement;
  protected category: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.image = ensureElement<HTMLImageElement>('.card__image', container);
    this.category = ensureElement<HTMLElement>('.card__category', container);
  }

  render(data: IProduct): HTMLElement {
    this.titleValue = data.title;
    this.priceValue = data.price;

    this.setImage(this.image, `${CDN_URL}${data.image}`, data.title);

    this.category.textContent = data.category;
    this.category.className = 'card__category';

    const modifier = categoryMap[data.category as keyof typeof categoryMap];
    if (modifier) {
      this.category.classList.add(modifier);
    }

    this.container.onclick = () => {
      this.events.emit('card:select', { id: data.id });
    };

    return this.container;
  }
}