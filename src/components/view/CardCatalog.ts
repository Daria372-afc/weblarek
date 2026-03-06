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
}