import { IBuyer, TPayment } from '../../types';
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

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!this.address) errors.address = 'Необходимо указать адрес';
    return errors;
  }
}