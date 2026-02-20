import { IBuyer, TPayment } from '../../../types';

export class Buyer {
  private payment: TPayment | null = null;
  private address: string = '';
  private email: string = '';
  private phone: string = '';

  setData(data: Partial<IBuyer>) {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
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
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!this.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.address) errors.address = 'Введите адрес доставки';
    if (!this.email) errors.email = 'Укажите email';
    if (!this.phone) errors.phone = 'Укажите телефон';
    return errors;
  }
}