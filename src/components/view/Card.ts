import { Component } from '../base/Component';
import { ensureElement, formatPrice } from '../../utils/utils';
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
  const price = formatPrice(value);

  if (value === null) {
    this.price.textContent = price;
  } else {
    this.price.textContent = `${price} синапсов`;
  }
}
}