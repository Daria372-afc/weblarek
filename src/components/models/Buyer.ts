import { IBuyer, TPayment, TBuyerErrors } from '../../types';
import { EventEmitter } from '../base/Events';

export class Buyer {
  private payment: TPayment | null = null;
  private address: string = '';
  private email: string = '';
  private phone: string = '';
  private events: EventEmitter;

  constructor(events: EventEmitter) {
    this.events = events;
  }

  setData(data: Partial<IBuyer>) {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;

    this.events.emit('buyer:changed');
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clear() {
    this.payment = null;
    this.address = '';
    this.email = '';
    this.phone = '';

    this.events.emit('buyer:changed');
  }

    validate(): TBuyerErrors {
  const errors: TBuyerErrors = {};

  if (!this.payment) {
    errors.payment = 'Необходимо выбрать способ оплаты';
  }

  if (!this.address) {
    errors.address = 'Необходимо указать адрес';
  }

  if (!this.email) {
    errors.email = 'Необходимо указать email';
  }

  if (!this.phone) {
    errors.phone = 'Необходимо указать телефон';
  }

  return errors;
}
}