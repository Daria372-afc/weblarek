import { CDN_URL, categoryMap } from '../../utils/constants';
import { Card } from './Card';
import { ensureElement } from '../../utils/utils';

export class CardCatalog extends Card {
  protected image: HTMLImageElement;
  protected category: HTMLElement;

  constructor(
    container: HTMLElement,
    actions: { onClick: () => void }
  ) {
    super(container);

    this.image = ensureElement<HTMLImageElement>('.card__image', container);
    this.category = ensureElement<HTMLElement>('.card__category', container);

    this.container.addEventListener('click', actions.onClick);
  }

  set imageUrl(value: string) {
  this.setImage(this.image, `${CDN_URL}${value}`, this.title.textContent ?? '');
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