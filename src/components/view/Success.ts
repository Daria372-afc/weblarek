import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Success extends Component<{ total: number }> {

  protected description: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.description = ensureElement('.order-success__description', container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('order:success-close');
    });
  }

  set total(value: number) {
    const formatted =
      value >= 10000
        ? value.toLocaleString('ru-RU')
        : value.toString();

    this.description.textContent = `Списано ${formatted} синапсов`;
  }
}