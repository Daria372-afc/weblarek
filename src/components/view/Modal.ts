import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<unknown> {
  protected closeButton: HTMLButtonElement;
  protected content: HTMLElement;
  protected modalContainer: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.modalContainer = ensureElement<HTMLElement>(
      '.modal__container',
      this.container
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      '.modal__close',
      this.container
    );

    this.content = ensureElement<HTMLElement>(
      '.modal__content',
      this.container
    );

    // Закрытие по крестику
    this.closeButton.addEventListener('click', () => {
      this.close();
    });
  }
  
  setContent(node: HTMLElement) {
    this.content.replaceChildren(node);
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.content.replaceChildren();
  }

  render(): HTMLElement {
    return this.container;
  }
}