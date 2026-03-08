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

    container.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;

      this.events.emit('form:change', {
        [target.name]: target.value
      });
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

  setErrors(...errors: (string | undefined)[]) {
  const filtered = errors.filter(Boolean) as string[];
  this.errors.textContent = filtered.join(', ');
}

  protected abstract onSubmit(): void;
}