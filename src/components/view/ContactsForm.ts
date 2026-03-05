import { Form } from './Form';
import { ensureElement } from '../../utils/utils';

export class ContactsForm extends Form<unknown> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: any) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container
    );

    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container
    );
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  protected onSubmit(): void {
    this.events.emit('order:submit');
  }
}