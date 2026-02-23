import './scss/styles.scss';

import { API_URL, CDN_URL, categoryMap } from './utils/constants';
import { IProduct } from './types';
import { Products } from './components/base/Models/Products';
import { Cart } from './components/base/Models/Cart';
import { Buyer } from './components/base/Models/Buyer';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/WebLarekApi';

const cartModel = new Cart();
const buyerModel = new Buyer();

// ----------------------
// API
// ----------------------
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// ----------------------
// 1. Продукты
// ----------------------
const productsModel = new Products();

// Сначала показываем локальные данные
productsModel.setProducts(apiProducts.items);

// Контейнер для галереи
const gallery = document.querySelector<HTMLElement>('.gallery');

// Функция рендеринга карточек
function renderProducts(products: IProduct[]) {
  gallery?.replaceChildren(); // очищаем галерею

  products.forEach(product => {
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    if (!template) return;

    const cardFragment = template.content.cloneNode(true) as DocumentFragment;
    const card = cardFragment.firstElementChild as HTMLElement;
    if (!card) return;

    const title = card.querySelector<HTMLElement>('.card__title');
    const category = card.querySelector<HTMLElement>('.card__category');
    const price = card.querySelector<HTMLElement>('.card__price');
    const image = card.querySelector<HTMLImageElement>('.card__image');

    if (title) title.textContent = product.title;

if (category) {
  category.textContent = product.category;

  const categoryClass = categoryMap[product.category as keyof typeof categoryMap];
  if (categoryClass) {
    category.classList.add(categoryClass);
  }
}

if (price) {
  if (product.price !== null) {
    if (product.price >= 10000) {
      price.textContent = `${product.price.toLocaleString('ru-RU')} синапсов`;
    } else {
      price.textContent = `${product.price} синапсов`;
    }
  } else {
    price.textContent = 'Бесценно';
  }
}

if (image) {
  image.src = `${CDN_URL}${product.image}`;
  image.alt = product.title;
}


    // Клик на карточку открывает модалку
    card.addEventListener('click', () => openProductModal(product));

    // Добавляем карточку в галерею
    gallery?.appendChild(card);
  });
}

// Сначала рендерим локальные данные
renderProducts(productsModel.getProducts());

// Затем подгружаем с API
webLarekApi.getProducts()
  .then(apiProducts => {
    productsModel.setProducts(apiProducts);
    renderProducts(apiProducts); // обновляем карточки на странице
  })
  .catch(err => console.error('Ошибка при загрузке товаров с API:', err));

console.log('Все товары:', productsModel.getProducts());
console.log('Товар по id 1:', productsModel.getProductById('1'));

// ----------------------
// Модалка
// ----------------------
const modal = document.getElementById('modal-container') as HTMLElement;
const modalContent = modal?.querySelector('.modal__content') as HTMLElement;
const modalClose = modal?.querySelector('.modal__close') as HTMLButtonElement;

// Функция открытия модалки с товаром
function openProductModal(product: IProduct) {
  if (!modalContent) return;

  const template = document.getElementById('card-preview') as HTMLTemplateElement;
  if (!template) return;

  modalContent.innerHTML = ''; // очищаем старый контент

  const cardFragment = template.content.cloneNode(true) as DocumentFragment;
  const card = cardFragment.firstElementChild as HTMLElement;
  if (!card) return;

  const title = card.querySelector<HTMLElement>('.card__title');
  const category = card.querySelector<HTMLElement>('.card__category');
  const price = card.querySelector<HTMLElement>('.card__price');
  const description = card.querySelector<HTMLElement>('.card__text');
  const image = card.querySelector<HTMLImageElement>('.card__image');
  const addButton = card.querySelector<HTMLButtonElement>('.card__button');

if (title) title.textContent = product.title;

if (category) {
  category.textContent = product.category;

  category.classList.remove(
    'card__category_soft',
    'card__category_hard',
    'card__category_button',
    'card__category_additional',
    'card__category_other'
  );

  const categoryClass = categoryMap[product.category as keyof typeof categoryMap];
  if (categoryClass) {
    category.classList.add(categoryClass);
  }
}

if (price) {
  if (product.price !== null) {
    if (product.price >= 10000) {
      price.textContent = `${product.price.toLocaleString('ru-RU')} синапсов`;
    } else {
      price.textContent = `${product.price} синапсов`;
    }
  } else {
    price.textContent = 'Бесценно';
  }
}

  if (description) description.textContent = product.description;

  if (image) {
  image.src = `${CDN_URL}${product.image}`;
  image.alt = product.title;
}

  // Кнопка "В корзину"
  if (addButton) {
  if (product.price === null) {
    addButton.textContent = 'Недоступно';
    addButton.disabled = true;
  } else {
    addButton.disabled = false;

    //  Проверяем есть ли товар в корзине
    if (cartModel.hasItem(product.id)) {
      addButton.textContent = 'Удалить из корзины';
    } else {
      addButton.textContent = 'Купить';
    }

    addButton.addEventListener('click', () => {
      if (cartModel.hasItem(product.id)) {
        cartModel.removeItem(product);
      } else {
        cartModel.addItem(product);
      }

      updateCartUI();

      modal?.classList.remove('modal_active');
      modalContent.innerHTML = '';
    });
  }
}

  modalContent.appendChild(card);
  modal.classList.add('modal_active'); // показываем модалку
}

// Закрытие модалки
modalClose?.addEventListener('click', () => {
  modal?.classList.remove('modal_active');
  modalContent.innerHTML = '';
});


// ----------------------
// Открытие корзины
// ----------------------

const basketButton = document.querySelector<HTMLButtonElement>('.header__basket');

basketButton?.addEventListener('click', () => {
  openBasketModal();
});

function openBasketModal() {
  if (!modal || !modalContent) return;

  const template = document.getElementById('basket') as HTMLTemplateElement;
  if (!template) return;

  modalContent.innerHTML = '';

  const fragment = template.content.cloneNode(true) as DocumentFragment;
  const basketElement = fragment.firstElementChild as HTMLElement;
  if (!basketElement) return;

  const basketList = basketElement.querySelector('.basket__list');
  const basketTotal = basketElement.querySelector('.basket__price');
  const orderButton = basketElement.querySelector('.basket__button') as HTMLButtonElement;

  const items = cartModel.getItems();

  // Если корзина пустая
  if (items.length === 0) {
    if (basketList) {
      basketList.innerHTML = '<p>Корзина пуста</p>';
    }

    if (basketTotal) {
      basketTotal.textContent = '0 синапсов';
    }

    orderButton.disabled = true;
  }

  // Если есть товары
  else {
    items.forEach((product, index) => {
      const itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
      if (!itemTemplate) return;

      const itemFragment = itemTemplate.content.cloneNode(true) as DocumentFragment;
      const item = itemFragment.firstElementChild as HTMLElement;
      if (!item) return;

      const title = item.querySelector('.card__title');
      const price = item.querySelector('.card__price');
      const indexElement = item.querySelector('.basket__item-index');
      const deleteButton = item.querySelector('.basket__item-delete');

      if (title) title.textContent = product.title;
      if (price) price.textContent = `${product.price} синапсов`;
      if (indexElement) indexElement.textContent = String(index + 1);

      deleteButton?.addEventListener('click', () => {
        cartModel.removeItem(product);
        updateCartUI();
        openBasketModal();
      });

      basketList?.appendChild(item);
    });

    if (basketTotal) {
      basketTotal.textContent = `${cartModel.getTotalPrice()} синапсов`;
    }

    orderButton.disabled = false;
  
    orderButton.addEventListener('click', () => {
  openOrderStepOne();
});
  }

  modalContent.appendChild(basketElement);
  modal.classList.add('modal_active');
}


// ----------------------
// 2. Корзина
// ----------------------
console.log('Товары в корзине:', cartModel.getItems());
console.log('Общая стоимость:', cartModel.getTotalPrice());
console.log('Есть ли товар с id 1?', cartModel.hasItem('1'));
console.log('Корзина после удаления:', cartModel.getItems());
console.log('Корзина после очистки:', cartModel.getItems());

// ----------------------
// 3. Покупатель
// ----------------------
buyerModel.setData({ email: 'test@mail.com' });
buyerModel.setData({ phone: '+7 777 777 77 77' });

console.log('Данные покупателя:', buyerModel.getData());
console.log('Ошибки валидации:', buyerModel.validate());

buyerModel.clear();
console.log('Данные после очистки:', buyerModel.getData());

// ----------------------
// UI корзины
// ----------------------
const basketCounter = document.querySelector<HTMLSpanElement>('.header__basket-counter');

function updateCartUI() {
  if (basketCounter) {
    basketCounter.textContent = `${cartModel.getItemsCount()}`;
  }
}


function openOrderStepOne() {
  if (!modal || !modalContent) return;

  const template = document.getElementById('order') as HTMLTemplateElement;
  if (!template) return;

  modalContent.innerHTML = '';

  const fragment = template.content.cloneNode(true) as DocumentFragment;
  const form = fragment.querySelector('form') as HTMLFormElement;

  const addressInput = form.querySelector<HTMLInputElement>('input[name="address"]');
  const nextButton = form.querySelector<HTMLButtonElement>('.order__button');
  const errorSpan = form.querySelector('.form__errors');
  const paymentButtons = form.querySelectorAll<HTMLButtonElement>('.order__buttons .button');

  let selectedPayment: 'card' | 'cash' | null = null;

  paymentButtons.forEach(button => {
    button.addEventListener('click', () => {
      paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
      button.classList.add('button_alt-active');

      selectedPayment = button.name as 'card' | 'cash';
      validate();
    });
  });

  addressInput?.addEventListener('input', validate);

  function validate() {
    if (!addressInput?.value.trim()) {
      errorSpan!.textContent = 'Необходимо указать адрес';
      nextButton!.disabled = true;
      return;
    }

    if (!selectedPayment) {
      errorSpan!.textContent = 'Выберите способ оплаты';
      nextButton!.disabled = true;
      return;
    }

    errorSpan!.textContent = '';
    nextButton!.disabled = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    buyerModel.setData({
      payment: selectedPayment!,
      address: addressInput!.value
    });

    openOrderStepTwo();
  });

  modalContent.appendChild(form);
}


function openOrderStepTwo() {
  if (!modal || !modalContent) return;

  const template = document.getElementById('contacts') as HTMLTemplateElement;
  if (!template) return;

  modalContent.innerHTML = '';

  const fragment = template.content.cloneNode(true) as DocumentFragment;
  const form = fragment.querySelector('form') as HTMLFormElement;

  const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
  const phoneInput = form.querySelector<HTMLInputElement>('input[name="phone"]');
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const errorSpan = form.querySelector('.form__errors');

  function validate() {
    if (!emailInput?.value.trim()) {
      errorSpan!.textContent = 'Укажите email';
      submitButton!.disabled = true;
      return;
    }

    if (!phoneInput?.value.trim()) {
      errorSpan!.textContent = 'Укажите телефон';
      submitButton!.disabled = true;
      return;
    }

    errorSpan!.textContent = '';
    submitButton!.disabled = false;
  }

  emailInput?.addEventListener('input', validate);
  phoneInput?.addEventListener('input', validate);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    buyerModel.setData({
      email: emailInput!.value,
      phone: phoneInput!.value
    });

    openSuccessModal();
  });

  modalContent.appendChild(form);
}


function openSuccessModal() {
  if (!modal || !modalContent) return;

  const template = document.getElementById('success') as HTMLTemplateElement;
  if (!template) return;

  modalContent.innerHTML = '';

  const fragment = template.content.cloneNode(true) as DocumentFragment;

  const description = fragment.querySelector('.order-success__description');
  const closeButton = fragment.querySelector('.order-success__close');

  if (description) {
    description.textContent = `Списано ${cartModel.getTotalPrice()} синапсов`;
  }

  closeButton?.addEventListener('click', () => {
    cartModel.clear();
    buyerModel.clear();
    updateCartUI();
    modal.classList.remove('modal_active');
  });

  modalContent.appendChild(fragment);
}