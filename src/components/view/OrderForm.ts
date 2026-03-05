import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { TPayment } from '../../types';

export class OrderForm extends Form<unknown> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: any) {
    super(container, events);

    this.paymentButtons = Array.from(
      container.querySelectorAll('.order__buttons .button')
    ) as HTMLButtonElement[];

    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    );

    // Выбор способа оплаты
this.paymentButtons.forEach(button => {
  button.addEventListener('click', () => {
    this.events.emit('form:change', {
      payment: button.name as TPayment,
      address: this.addressInput.value
    });
  });
});

    // Ввод адреса
    this.addressInput.addEventListener('input', () => {
      this.events.emit('form:change', {
        address: this.addressInput.value
      });
    });
  }

  set payment(value: TPayment | null) {
    this.paymentButtons.forEach(btn => {
      btn.classList.toggle('button_alt-active', btn.name === value);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  protected onSubmit(): void {
    this.events.emit('order:next');
  }
}