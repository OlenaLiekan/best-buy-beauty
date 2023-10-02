export const flsModules = {};

export let bodyLockStatus = true;
export let bodyLockToggle = (delay = 500) => {
  if (document.documentElement.classList.contains('lock')) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
};
export let bodyUnlock = (delay = 500) => {
  let body = document.querySelector('body');
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll('[data-lp]');
    setTimeout(() => {
      for (let index = 0; index < lock_padding.length; index++) {
        const el = lock_padding[index];
        el.style.paddingRight = '0px';
      }
      body.style.paddingRight = '0px';
      document.documentElement.classList.remove('lock');
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};
export let bodyLock = (delay = 500) => {
  let body = document.querySelector('body');
  if (bodyLockStatus) {
    let lock_padding = document.querySelectorAll('[data-lp]');
    for (let index = 0; index < lock_padding.length; index++) {
      const el = lock_padding[index];
      el.style.paddingRight =
        window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    }
    body.style.paddingRight =
      window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    document.documentElement.classList.add('lock');

    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};

export function menuInit() {
  const subMenu = document.querySelector('.sub-menu');
  if (document.querySelector('.icon-menu')) {
    document.addEventListener('click', function (e) {
      if (bodyLockStatus && e.target.closest('.icon-menu')) {
        window.scrollTo(0, 0);
        bodyLockToggle();
        document.documentElement.classList.toggle('menu-open');
      } else if (
        bodyLockStatus &&
        !e.target.closest('.icon-menu') &&
        !e.target.closest('.menu-button') &&
        !e.target.closest('.list-sub-menu__back') &&
        !e.target.closest('.sub-menu__item')
      ) {
        document.documentElement.classList.remove('menu-open');
        subMenu.classList.remove('sub-menu-open');
        bodyUnlock();
      }
      if (bodyLockStatus && e.target.closest('.icon-menu__text_show')) {
        document.documentElement.classList.remove('menu-open');
        bodyLockToggle();
      }
    });
  }

  if (document.querySelector('.item-menu__link')) {
    document.addEventListener('click', function (e) {
      if (e.target.closest('.menu-button')) {
        subMenu.classList.add('sub-menu-open');
      } else if (e.target.closest('.menu-link')) {
        bodyLockToggle();
        document.documentElement.classList.remove('menu-open');
      }
    });
  }

  if (document.querySelector('.item-sub-menu__link')) {
    document.addEventListener('click', function (e) {
      if (e.target.closest('.icon-menu')) {
        bodyLockToggle();
        subMenu.classList.remove('sub-menu-open');
      } else if (e.target.closest('.list-sub-menu__back')) {
        subMenu.classList.remove('sub-menu-open');
      } else if (e.target.closest('.sub-menu__item')) {
        subMenu.classList.remove('sub-menu-open');
        document.documentElement.classList.remove('menu-open');
        bodyLockToggle();
      }
    });
  }
}

export function menuOpen() {
  bodyLock();
  document.documentElement.classList.add('menu-open');
}
export function menuClose() {
  bodyUnlock();
  document.documentElement.classList.remove('menu-open');
}

export function popupInit() {
  const popupBody = document.querySelector('.popup-cart');

  if (document.querySelector('.button__submit')) {
    document.addEventListener('click', function (e) {
      if (e.target.closest('.button__submit')) {
        popupBody.classList.add('_active');
        popupBody.scrollIntoView();
      }
    });
  }
  if (document.querySelector('.popup-cart')) {
    document.addEventListener('click', function (e) {
      if (e.target.closest('.popup-cart__close')) {
        popupBody.classList.remove('_active');
      }
    });
  }
}

export function scrollTop() {
  document.addEventListener('click', function (e) {
    if (e.target.closest('.scroll-top')) {
      document.documentElement.scrollIntoView();
    }
  });
}

export function popupAuth() {
  const popupHeader = document.querySelector('.popup-header');
  if (document.querySelector('._icon-user_auth')) {
    popupHeader.classList.toggle('_active');
    document.addEventListener('click', function (e) {
      if (!e.target.closest('._icon-user_auth')) {
        popupHeader.classList.remove('_active');
      }
    });
  }
}

export function changeAccessData() {
  const changePasswordForm = document.querySelector('.form-access__body');
  const changePasswordBtn = document.querySelector('.form-access__button');
  changePasswordForm.classList.add('_visible');
  changePasswordBtn.classList.add('_disabled');
  document.addEventListener('click', function (e) {
    if (e.target.closest('.form-access-submit-btn')) {
      changePasswordForm.classList.remove('_visible');
      changePasswordBtn.classList.remove('_disabled');
    }
  });
}

export function changeData() {
  const editDataBtn = document.querySelector('.edit-data-btn');
  const changeDataBtn = document.querySelector('.change-data-btn');
  const inputs = document.querySelectorAll('.form-user-info__input');
  changeDataBtn.classList.add('_visible');
  editDataBtn.classList.add('_hidden');
  Array.from(inputs).forEach(inp => {
    inp.removeAttribute('readOnly');
  });
}

export function onReadonly() {
  const editDataBtn = document.querySelector('.edit-data-btn');
  const changeDataBtn = document.querySelector('.change-data-btn');
  const inputs = document.querySelectorAll('.form-user-info__input');
  Array.from(inputs).forEach(inp => {
    inp.setAttribute('readOnly', 'true');
  });
  changeDataBtn.classList.remove('_visible');
  editDataBtn.classList.remove('_hidden');
}

export function checkedCheckbox() {
  const checkboxLabel = document.querySelector('.checkbox-label');
  checkboxLabel.classList.toggle('_checked');
}

export function camelize(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) => (index === 0 ? word : word[0].toUpperCase() + word.slice(1)))
    .join('');
}
