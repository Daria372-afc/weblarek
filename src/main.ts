import './scss/styles.scss';

import { API_URL } from './utils/constants';
import { TPayment } from './types';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/WebLarekApi';

import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';

import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Basket } from './components/view/Basket';
import { Modal } from './components/view/Modal';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';

// ----------------------
// Инициализация
// ----------------------

const events = new EventEmitter();

const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// ----------------------
// View
// ----------------------

const headerElement = document.querySelector('.header') as HTMLElement;
const header = new Header(headerElement, events);

const galleryElement = document.querySelector('.gallery') as HTMLElement;
const gallery = new Gallery(galleryElement);

const modalElement = document.getElementById('modal-container') as HTMLElement;
const modal = new Modal(modalElement, events);

// ----------------------
// События моделей
// ----------------------

// Обновление каталога
events.on('products:changed', () => {
  const cards = productsModel.getProducts().map(product => {
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    const node = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const card = new CardCatalog(node, events);
    return card.render(product);
  });

  gallery.catalog = cards;
});

// Выбран товар
events.on('product:selected', () => {
  const product = productsModel.getSelectedProduct();
  if (!product) return;

  const template = document.getElementById('card-preview') as HTMLTemplateElement;
  const node = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const card = new CardPreview(node, events);

  const element = card.render({
    ...product,
    inBasket: cartModel.hasItem(product.id)
  });

  modal.setContent(element);
  modal.open();
});

// Изменение корзины
events.on('basket:changed', () => {
  header.counter = cartModel.getItemsCount();

  if (modal.render().classList.contains('modal_active')) {
    renderBasket();
  }
});

// Изменение данных покупателя
events.on('buyer:changed', () => {
  const errors = buyerModel.validate();
  const isValid = Object.keys(errors).length === 0;
  const errorText = Object.values(errors).join(', ');

  const formElement = document.querySelector('#modal-container form');
  if (!formElement) return;

  const submit = formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
  const errorBlock = formElement.querySelector('.form__errors') as HTMLElement;

  if (submit) submit.disabled = !isValid;
  if (errorBlock) errorBlock.textContent = errorText;
});

// ----------------------
// События представлений
// ----------------------

function renderBasket() {
  const template = document.getElementById('basket') as HTMLTemplateElement;
  const node = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const basketView = new Basket(node, events);

  const items = cartModel.getItems().map((product, index) => {
    const itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
    const itemNode = itemTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const title = itemNode.querySelector('.card__title');
    const price = itemNode.querySelector('.card__price');
    const indexElement = itemNode.querySelector('.basket__item-index');
    const deleteButton = itemNode.querySelector('.basket__item-delete');

    if (title) title.textContent = product.title;

    if (price) {
      const formatted =
        product.price !== null && product.price >= 10000
          ? product.price.toLocaleString('ru-RU')
          : product.price?.toString();

      price.textContent =
        product.price !== null
          ? `${formatted} синапсов`
          : 'Бесценно';
    }

    if (indexElement) indexElement.textContent = String(index + 1);

    deleteButton?.addEventListener('click', () => {
      cartModel.removeItem(product);
    });

    return itemNode;
  });

  basketView.items = items;
  basketView.total = cartModel.getTotalPrice();

  modal.setContent(basketView.render());
  modal.open();
}


// Открыть корзину
events.on('basket:open', () => {
  renderBasket();
});

// Выбор карточки
events.on('card:select', (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product) {
    productsModel.setSelectedProduct(product);
  }
});

// Добавление в корзину
events.on('card:add', (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product) {
    cartModel.addItem(product);
    modal.close();
  }
});

// Удаление из корзины
events.on('card:remove', (data: { id: string }) => {
  const product = productsModel.getProductById(data.id);
  if (product) {
    cartModel.removeItem(product);
    modal.close();
  }
});

// Начало оформления
events.on('order:start', () => {
  const template = document.getElementById('order') as HTMLTemplateElement;
  const node = template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;

  const form = new OrderForm(node, events);

  modal.setContent(form.render());
  modal.open();
});

// Изменение данных формы
events.on('form:change', (data: any) => {
  buyerModel.setData(data);
});

// Переход ко второй форме
events.on('order:next', () => {
  const template = document.getElementById('contacts') as HTMLTemplateElement;
  const node = template.content.firstElementChild!.cloneNode(true) as HTMLFormElement;

  const form = new ContactsForm(node, events);
  modal.setContent(form.render());
});

// Завершение заказа
events.on('order:submit', async () => {
  try {
    const totalPrice = cartModel.getTotalPrice(); // сохраняем сумму ДО очистки

    await webLarekApi.postOrder({
      payment: buyerModel.getData().payment as TPayment,
      email: buyerModel.getData().email,
      phone: buyerModel.getData().phone,
      address: buyerModel.getData().address,
      items: cartModel.getItems().map(item => item.id),
      total: totalPrice
    });

    const template = document.getElementById('success') as HTMLTemplateElement;
    const node = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

    // Вставляем корректную сумму
    const description = node.querySelector('.order-success__description');
    if (description) {
      const formatted =
  totalPrice >= 10000
    ? totalPrice.toLocaleString('ru-RU')
    : totalPrice.toString();

description.textContent = `Списано ${formatted} синапсов`;
    }

    // Кнопка "За новыми покупками"
    const closeButton = node.querySelector('.order-success__close');
    closeButton?.addEventListener('click', () => {
      cartModel.clear();
      buyerModel.clear();
      modal.close();
    });

    modal.setContent(node);
    modal.open();

  } catch (error) {
    console.error(error);
  }
});

// ----------------------
// Загрузка товаров
// ----------------------

webLarekApi
  .getProducts()
  .then(products => {
    productsModel.setProducts(products);
  })
  .catch(console.error);
