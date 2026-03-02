import { CDN_URL } from '../../utils/constants';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

export abstract class Card extends Component<IProduct> {
  protected title: HTMLElement;
  protected price: HTMLElement;
  protected image: HTMLImageElement;
  protected category: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.title = ensureElement<HTMLElement>('.card__title', container);
    this.price = ensureElement<HTMLElement>('.card__price', container);
    this.image = ensureElement<HTMLImageElement>('.card__image', container);
    this.category = ensureElement<HTMLElement>('.card__category', container);
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

  set imageValue(value: string) {
  this.setImage(
    this.image,
    `${CDN_URL}${value}`,
    this.title.textContent || ''
  );
}

  set categoryValue(value: string) {
    this.category.textContent = value;

    this.category.className = 'card__category';
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) {
      this.category.classList.add(modifier);
    }
  }
}