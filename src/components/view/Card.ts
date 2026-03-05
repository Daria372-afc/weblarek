import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';

export abstract class Card extends Component<IProduct> {
  protected title: HTMLElement;
  protected price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.title = ensureElement<HTMLElement>('.card__title', container);
    this.price = ensureElement<HTMLElement>('.card__price', container);
  }

  set titleValue(value: string) {
    this.title.textContent = value;
  }

  set priceValue(value: number | null) {
    if (value === null) {
      this.price.textContent = 'Бесценно';
    } else {
      const formatted =
        value >= 10000
          ? value.toLocaleString('ru-RU')
          : value.toString();

      this.price.textContent = `${formatted} синапсов`;
    }
  }
}