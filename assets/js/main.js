const query = (selector) => document.querySelector(selector);

function openCart() {
  const cartOverlay = query('#cart-drawer-overlay');
  const cartDrawerContent = query('#cart-drawer-content');
  if (!cartOverlay || !cartDrawerContent) return;
  cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
  cartOverlay.classList.add('opacity-100');
  cartDrawerContent.classList.remove('-translate-x-full');
  cartDrawerContent.classList.add('translate-x-0');
}

function closeCart() {
  const cartOverlay = query('#cart-drawer-overlay');
  const cartDrawerContent = query('#cart-drawer-content');
  if (!cartOverlay || !cartDrawerContent) return;
  cartOverlay.classList.remove('opacity-100');
  cartOverlay.classList.add('opacity-0', 'pointer-events-none');
  cartDrawerContent.classList.remove('translate-x-0');
  cartDrawerContent.classList.add('-translate-x-full');
}

function updateCartTotal() {
  const cartItemsContainer = query('#cart-items-container');
  const cartCounterEl = query('#cart-counter');
  const cartTotalEl = query('#cart-total-price');

  const count = cartItemsContainer ? cartItemsContainer.children.length : 0;
  if (cartCounterEl) cartCounterEl.textContent = String(count || 0);

  if (cartTotalEl) {
    const total = Array.from(cartItemsContainer?.children || []).reduce((sum, item) => {
      const priceValue = Number(item.dataset.price || 0);
      return sum + priceValue;
    }, 0);

    cartTotalEl.textContent = `${Number.isFinite(total) && total > 0 ? total.toLocaleString('fa-IR') : cartTotalEl.textContent} تومان`;
  }
}

function addToCart(productName, price) {
  const cartCounterEl = query('#cart-counter');
  const cartItemsContainer = query('#cart-items-container');
  const targetPrice = Number(price || 0);
  let cartCount = Number(cartCounterEl?.textContent || 0);
  cartCount += 1;
  if (cartCounterEl) cartCounterEl.textContent = String(cartCount);

  if (cartItemsContainer) {
    const itemEl = document.createElement('div');
    itemEl.dataset.price = String(targetPrice);
    itemEl.className = 'flex items-center gap-3 p-2 rounded-xl bg-sand-50 border border-[#F1E9DB] animate-pulse';
    itemEl.innerHTML = `
      <div class="w-16 h-16 rounded-lg bg-[#E8D9C5] flex items-center justify-center text-[#70452D]">
        <i class="fa-solid fa-tree"></i>
      </div>
      <div class="flex-1">
        <div class="font-bold text-xs text-[#2A2421]">${productName}</div>
        <div class="text-[11px] text-[#70452D] font-bold mt-1">${targetPrice.toLocaleString('fa-IR')} تومان</div>
      </div>
      <button class="text-xs text-red-500 hover:text-red-700 p-1" type="button" aria-label="حذف محصول" onclick="this.parentElement.remove(); updateCartTotal();">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    cartItemsContainer.appendChild(itemEl);
    setTimeout(() => itemEl.classList.remove('animate-pulse'), 400);
  }

  updateCartTotal();
  openCart();
}

function toggleFaq(button) {
  const content = button?.nextElementSibling;
  const icon = button?.querySelector('.material-symbols-outlined');
  if (!content || !icon) return;

  const isHidden = content.classList.contains('hidden');
  document.querySelectorAll('#faq-accordion > div').forEach((item) => {
    const faqContent = item.querySelector('div:last-child');
    const faqIcon = item.querySelector('.material-symbols-outlined');
    if (faqContent && !faqContent.classList.contains('hidden')) {
      faqContent.classList.add('hidden');
    }
    if (faqIcon) faqIcon.classList.remove('rotate-180');
  });

  if (isHidden) {
    content.classList.remove('hidden');
    icon.classList.add('rotate-180');
  }
}

function trackOrder() {
  const input = query('#tracking-input');
  const result = query('#tracking-result');
  if (!input || !result) return;
  if (!input.value.trim()) {
    input.focus();
    return;
  }
  result.classList.remove('hidden');
}

function handleFormSubmit() {
  const btn = query('#submit-btn');
  const successMsg = query('#form-success');
  const form = query('#contact-main-form');
  if (!btn || !successMsg || !form) return;

  btn.disabled = true;
  btn.classList.add('opacity-70');

  setTimeout(() => {
    successMsg.classList.remove('hidden');
    btn.disabled = false;
    btn.classList.remove('opacity-70');
    form.reset();
  }, 600);
}

window.addToCart = addToCart;
window.toggleFaq = toggleFaq;
window.trackOrder = trackOrder;
window.handleFormSubmit = handleFormSubmit;
window.updateCartTotal = updateCartTotal;

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const mobileBtn = query('#mobile-menu-btn');
  const mobileNav = query('#mobile-nav-panel');
  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
  }

  const cartToggleBtn = query('#cart-drawer-toggle');
  const cartCloseBtn = query('#cart-close-btn');
  const cartOverlay = query('#cart-drawer-overlay');
  const cartDrawerContent = query('#cart-drawer-content');

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (event) => {
      if (event.target === cartOverlay) closeCart();
    });
  }

  document.body.addEventListener('click', (event) => {
    const addToCartButton = event.target.closest('[data-add-to-cart]');
    if (addToCartButton) {
      const name = addToCartButton.dataset.productName || 'محصول جدید';
      const price = Number(addToCartButton.dataset.productPrice || 0);
      addToCart(name, price);
      return;
    }

    const shopAddButton = event.target.closest('button[aria-label="افزودن به سبد خرید"]');
    if (shopAddButton) {
      const productCard = shopAddButton.closest('.group');
      const productNameEl = productCard?.querySelector('h3');
      const priceEl = productCard?.querySelector('.font-headline-sm');

      const productName = productNameEl?.textContent?.trim() || 'محصول جدید';
      const rawPriceText = priceEl?.textContent?.replace(/[^\d]/g, '') || '0';
      const price = Number(rawPriceText || 0);
      addToCart(productName, price);
      return;
    }

    const wishlistButton = event.target.closest('[data-wishlist]');
    if (wishlistButton) {
      const icon = wishlistButton.querySelector('i');
      if (!icon) return;
      const isFilled = icon.classList.contains('fa-solid');
      icon.classList.toggle('fa-regular', isFilled);
      icon.classList.toggle('fa-solid', !isFilled);
      icon.classList.toggle('text-red-500', !isFilled);
    }
  });

  document.querySelectorAll('.wishlist-btn, [data-wishlist]').forEach((button) => {
    const icon = button.querySelector('i');
    if (!icon) return;
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const isFilled = icon.classList.contains('fa-solid');
      icon.classList.toggle('fa-regular', isFilled);
      icon.classList.toggle('fa-solid', !isFilled);
      icon.classList.toggle('text-red-500', !isFilled);
    });
  });

  const newsletterForm = query('#newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = document.getElementById('newsletter-msg');
      if (message) message.classList.remove('hidden');
      newsletterForm.reset();
      setTimeout(() => {
        if (message) message.classList.add('hidden');
      }, 4000);
    });
  }

  const image = query('[data-hero-image]');
  const eyebrow = query('[data-hero-eyebrow]');
  const caption = query('[data-hero-caption]');
  const current = query('[data-hero-current]');
  const progress = query('[data-hero-progress]');
  const previous = query('[data-hero-prev]');
  const next = query('[data-hero-next]');

  if (image && previous && next) {
    const slides = [
      {
        image: image.src,
        alt: image.alt,
        eyebrow: eyebrow ? eyebrow.textContent : 'ساخت دست هنرمندان شمال ایران',
        caption: caption ? caption.textContent : 'تراش چوب گردو و زیتون کهن',
      },
      {
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0WSb0oFU54cEgzuB-IhZMxGUU_Lqf_2drdih-TMIhDW2nQcz8fEnAO_nwa7msUCja14P_cS-JbeDKLV7Zz7iHS00-2G2Bk-4NyirI0sW80AFP-nur3xMpNCGFIxfwJOg51yURUcP4Npl4SwR2pLpTLa4CZi4J7ZtlaLMbzTegNYxk90zY6psM95-j9gYaZUepzfWtMloCLEZv8j4o_EExhgnIW6FLy8bcyeqCgikc',
        alt: 'مبلمان و دکوراسیون چوبی دست‌ساز',
        eyebrow: 'گرمای چوب در فضای خانه',
        caption: 'طراحی آرام برای زندگی روزمره',
      },
      {
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbUMEo0zJ5P-MXxgdi9tKk6MQkNZZv7x5OxIa-hJXD78TbyAg5Km69ZzvrpLR4RWF3_pmyfb8bN2PaLKaEoraxN3mrEw_LC64vn-bB77MX9-Gmir-WTeIjbc6PxAUAfO0c2RZsCoxxFgy-zeF8-WV0kgx2et2lzklrb_2ZQMleZe6JSCtSnWrMo6e1Tr4qvHfMKEyYed9oL-nomRA6jLkv0StedfbrQBxOQ21PItZe',
        alt: 'ابزار و تخته آشپزخانه چوبی',
        eyebrow: 'ساخته‌شده برای سال‌های طولانی',
        caption: 'ابزار آشپزخانه از چوب طبیعی',
      },
    ];

    const digits = ['۰۱', '۰۲', '۰۳'];
    let active = 0;
    let timer;
    const delay = 6000;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function showSlide(index) {
      active = (index + slides.length) % slides.length;
      const slide = slides[active];
      image.src = slide.image;
      image.alt = slide.alt;
      if (eyebrow) eyebrow.textContent = slide.eyebrow;
      if (caption) caption.textContent = slide.caption;
      if (current) current.textContent = digits[active];
      if (progress) progress.style.height = `${(active + 1) * 33.333}%`;
      image.dataset.activeSlide = String(active);
    }

    function stopRotation() {
      window.clearInterval(timer);
    }

    function startRotation() {
      stopRotation();
      if (!reduceMotion && !document.hidden) {
        timer = window.setInterval(() => showSlide(active + 1), delay);
      }
    }

    previous.addEventListener('click', () => {
      showSlide(active - 1);
      startRotation();
    });

    next.addEventListener('click', () => {
      showSlide(active + 1);
      startRotation();
    });

    const frame = image.closest('.relative.rounded-3xl');
    if (frame) {
      frame.addEventListener('mouseenter', stopRotation);
      frame.addEventListener('mouseleave', startRotation);
      frame.addEventListener('focusin', stopRotation);
      frame.addEventListener('focusout', startRotation);
    }

    document.addEventListener('visibilitychange', startRotation);
    startRotation();
  }

  const priceSlider = query('#priceRange');
  const priceDisplay = query('#priceDisplay');
  const resetFiltersBtn = query('#resetFiltersBtn');

  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener('input', (event) => {
      const value = Number(event.target.value).toLocaleString('fa-IR');
      priceDisplay.textContent = `تا ${value} تومان`;
    });
  }

  if (resetFiltersBtn && priceSlider && priceDisplay) {
    resetFiltersBtn.addEventListener('click', () => {
      priceSlider.value = 1850000;
      priceDisplay.textContent = 'تا ۱,۸۵۰,۰۰۰ تومان';
      document.querySelectorAll('aside input[type="checkbox"]').forEach((checkbox, index) => {
        checkbox.checked = index === 0;
      });
    });
  }

  const trackingForm = query('#tracking-form');
  if (trackingForm) {
    trackingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      trackOrder();
    });
  }

  const contactForm = query('#contact-main-form');
  const submitBtn = query('#submit-btn');
  const successMsg = query('#form-success');

  if (contactForm && submitBtn && successMsg) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      handleFormSubmit();
    });
  }
});

