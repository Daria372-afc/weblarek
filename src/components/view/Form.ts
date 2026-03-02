import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errors: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container
    );

    this.errors = ensureElement<HTMLElement>(
      '.form__errors',
      container
    );

    container.addEventListener('input', () => {
      const formData = new FormData(container);
      const data = Object.fromEntries(formData.entries());
      this.events.emit('form:change', data);
    });

    container.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.onSubmit();
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errorMessages(value: string) {
    this.errors.textContent = value;
  }

  protected abstract onSubmit(): void;
}