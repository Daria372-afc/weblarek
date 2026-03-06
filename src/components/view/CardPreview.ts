import { IEvents } from '../base/Events';
import { Card } from './Card';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';
import { categoryMap } from '../../utils/constants';

export class CardPreview extends Card {
  protected button: HTMLButtonElement;
  protected image: HTMLImageElement;
  protected category: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.button = ensureElement<HTMLButtonElement>(
      '.card__button',
      this.container
    );

    this.image = ensureElement<HTMLImageElement>(
      '.card__image',
      this.container
    );

    this.category = ensureElement<HTMLElement>(
      '.card__category',
      this.container
    );

    this.button.addEventListener('click', () => {
  this.events.emit('preview:toggle');
});
  }

  render(data: IProduct & { inBasket: boolean }): HTMLElement {

    this.titleValue = data.title;
    this.priceValue = data.price;

    this.setImage(this.image, `${CDN_URL}${data.image}`, data.title);

    this.category.textContent = data.category;

this.category.className = 'card__category';
const modifier = categoryMap[data.category as keyof typeof categoryMap];

if (modifier) {
  this.category.classList.add(modifier);
}

   if (data.price === null) {
  this.button.disabled = true;
  this.button.textContent = 'Недоступно';
} else if (data.inBasket) {
  this.button.disabled = false;
  this.button.textContent = 'Удалить из корзины';
} else {
  this.button.disabled = false;
  this.button.textContent = 'Купить';
}

    return this.container;
  }
}