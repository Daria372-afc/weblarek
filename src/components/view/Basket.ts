import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Basket extends Component<unknown> {
  protected list: HTMLElement;
  protected totalPrice: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.list = ensureElement<HTMLElement>('.basket__list', container);
    this.totalPrice = ensureElement<HTMLElement>('.basket__price', container);
    this.orderButton = ensureElement<HTMLButtonElement>(
      '.basket__button',
      container
    );

    this.orderButton.addEventListener('click', () => {
      this.events.emit('order:start');
    });
  }

  set items(elements: HTMLElement[]) {
    this.list.replaceChildren(...elements);

    this.orderButton.disabled = elements.length === 0;
  }

  set total(value: number) {
    const formatted =
      value >= 10000
        ? value.toLocaleString('ru-RU')
        : value.toString();

    this.totalPrice.textContent = `${formatted} синапсов`;
  }
}