import './scss/styles.scss';

import { API_URL, CDN_URL, categoryMap } from './utils/constants';
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
import { CardBasket } from './components/view/CardBasket';
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
// Templates
// ----------------------

const cardCatalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const basketItemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const successTemplate = document.getElementById('success') as HTMLTemplateElement;

// ----------------------
// Instances
// ----------------------

const previewNode = cardPreviewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
const cardPreview = new CardPreview(previewNode, events);

const orderNode = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
const orderForm = new OrderForm(orderNode, events);

const contactsNode = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
const contactsForm = new ContactsForm(contactsNode, events);

// ----------------------
// События моделей
// ----------------------

// Обновление каталога
events.on('products:changed', () => {
  const cards = productsModel.getProducts().map(product => {

    const node = cardCatalogTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const card = new CardCatalog(node, {
  onClick: () => {
    events.emit('card:select', { id: product.id });
  }
});

card.titleValue = product.title;
card.priceValue = product.price;

(card as any).setImage((card as any).image, `${CDN_URL}${product.image}`, product.title);

(card as any).category.textContent = product.category;
(card as any).category.className = 'card__category';

const modifier = categoryMap[product.category as keyof typeof categoryMap];
if (modifier) {
  (card as any).category.classList.add(modifier);
}

return card.render();
  });

  gallery.catalog = cards;
});

// Выбран товар
events.on('product:selected', () => {
  const product = productsModel.getSelectedProduct();
  if (!product) return;

  const element = cardPreview.render({
    ...product,
    inBasket: cartModel.hasItem(product.id)
  });

  modal.setContent(element);
  modal.open();
});

// Изменение корзины
events.on('basket:changed', () => {
  header.counter = cartModel.getItemsCount();
  renderBasket();
});

// Изменение данных покупателя
events.on('buyer:changed', () => {
  const errors = buyerModel.validate();
  const isValid = !errors.payment && !errors.address;

const buyer = buyerModel.getData();

orderForm.payment = buyer.payment;
orderForm.address = buyer.address;

  let errorText = '';

if (errors.payment) {
  errorText = errors.payment;
}

if (errors.address) {
  errorText = errors.address;
}

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

  const node = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const basketView = new Basket(node, events);

  const items = cartModel.getItems().map((product, index) => {

    const itemNode = basketItemTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const card = new CardBasket(itemNode, {
      onDelete: () => {
        cartModel.removeItem(product);
      }
    });

    card.titleValue = product.title;
    card.priceValue = product.price;
    card.index = index + 1;

return card.render();

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

events.on('preview:toggle', () => {
  const product = productsModel.getSelectedProduct();
  if (!product) return;

  if (cartModel.hasItem(product.id)) {
    cartModel.removeItem(product);
  } else {
    cartModel.addItem(product);
  }

  modal.close();
});

// Начало оформления
events.on('order:start', () => {
  modal.setContent(orderForm.render());
  modal.open();
});

// Изменение данных формы
events.on('form:change', (data: any) => {
  buyerModel.setData(data);
});

// Переход ко второй форме
events.on('order:next', () => {
  modal.setContent(contactsForm.render());
});

// Завершение заказа
events.on('order:submit', async () => {
  try {

    const totalPrice = cartModel.getTotalPrice();
    const buyer = buyerModel.getData();

    await webLarekApi.postOrder({
      payment: buyer.payment as TPayment,
      email: buyer.email,
      phone: buyer.phone,
      address: buyer.address,
      items: cartModel.getItems().map(item => item.id),
      total: totalPrice
    });

    const node = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const description = node.querySelector('.order-success__description');

    if (description) {
      const formatted =
        totalPrice >= 10000
          ? totalPrice.toLocaleString('ru-RU')
          : totalPrice.toString();

      description.textContent = `Списано ${formatted} синапсов`;
    }

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