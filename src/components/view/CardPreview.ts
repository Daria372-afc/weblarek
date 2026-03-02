import { IEvents } from '../base/Events';
import { Card } from './Card';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export class CardPreview extends Card {
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.button = ensureElement<HTMLButtonElement>(
      '.card__button',
      this.container
    );
  }

  render(data: IProduct & { inBasket: boolean }): HTMLElement {
    this.container.dataset.id = data.id;

    this.titleValue = data.title;
    this.priceValue = data.price;
    this.imageValue = data.image;
    this.categoryValue = data.category;

    if (data.price === null) {
      this.button.disabled = true;
      this.button.textContent = 'Недоступно';
    } else if (data.inBasket) {
      this.button.disabled = false;
      this.button.textContent = 'Удалить из корзины';
    } else {
      this.button.disabled = false;
      this.button.textContent = 'В корзину';
    }

    this.button.onclick = () => {
      if (data.inBasket) {
        this.events.emit('card:remove', { id: data.id });
      } else {
        this.events.emit('card:add', { id: data.id });
      }
    };

    return this.container;
  }
}