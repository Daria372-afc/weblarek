import { Card } from './Card';
import { ensureElement } from '../../utils/utils';

export class CardBasket extends Card {
  protected deleteButton: HTMLButtonElement;
  protected indexElement: HTMLElement;

  constructor(
    container: HTMLElement,
    actions: { onDelete: () => void }
  ) {
    super(container);

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

  set index(value: number) {
    this.indexElement.textContent = value.toString();
  }
}