import { IEvents } from '../base/Events';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';

export class CardBasket extends Component<IProduct> {
  protected title: HTMLElement;
  protected price: HTMLElement;
  protected deleteButton: HTMLButtonElement;
  protected indexElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.title = ensureElement<HTMLElement>('.card__title', container);
    this.price = ensureElement<HTMLElement>('.card__price', container);
    this.deleteButton = ensureElement<HTMLButtonElement>(
      '.basket__item-delete',
      container
    );
    this.indexElement = ensureElement<HTMLElement>(
      '.basket__item-index',
      container
    );

    this.deleteButton.addEventListener('click', () => {
      const id = this.container.dataset.id;
      if (id) {
        this.events.emit('basket:remove', { id });
      }
    });
  }

  render(data: IProduct & { index: number }): HTMLElement {
    this.container.dataset.id = data.id;

    this.title.textContent = data.title;
    this.price.textContent =
      data.price !== null ? `${data.price} синапсов` : 'Недоступно';
    this.indexElement.textContent = String(data.index);

    return this.container;
  }
}