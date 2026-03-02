import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { TPayment } from '../../types';

export class OrderForm extends Form<unknown> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;
  protected selectedPayment: TPayment | null = null;

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
        this.paymentButtons.forEach(btn =>
          btn.classList.remove('button_alt-active')
        );

        button.classList.add('button_alt-active');

        this.selectedPayment = button.name as TPayment;

        this.events.emit('form:change', {
          payment: this.selectedPayment,
          address: this.addressInput.value
        });
      });
    });

    // Ввод адреса
    this.addressInput.addEventListener('input', () => {
      this.events.emit('form:change', {
        payment: this.selectedPayment,
        address: this.addressInput.value
      });
    });
  }

  protected onSubmit(): void {
    this.events.emit('order:next');
  }
}