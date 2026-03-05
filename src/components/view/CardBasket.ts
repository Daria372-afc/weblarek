import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';

export class CardBasket extends Component<IProduct> {
  protected title: HTMLElement;
  protected price: HTMLElement;
  protected deleteButton: HTMLButtonElement;
  protected indexElement: HTMLElement;

  constructor(
    container: HTMLElement,
    actions: { onDelete: () => void }
  ) {
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

    this.deleteButton.addEventListener('click', actions.onDelete);
  }

  render(data: IProduct & { index: number }): HTMLElement {

    this.title.textContent = data.title;

    if (data.price === null) {
  this.price.textContent = 'Недоступно';
} else {
  const formatted =
    data.price >= 10000
      ? data.price.toLocaleString('ru-RU')
      : data.price.toString();

  this.price.textContent = `${formatted} синапсов`;
}

    this.indexElement.textContent = String(data.index);

    return this.container;
  }
}