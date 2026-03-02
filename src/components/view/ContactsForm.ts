import { Form } from './Form';

export class ContactsForm extends Form<unknown> {
  protected onSubmit(): void {
    this.events.emit('order:submit');
  }
}