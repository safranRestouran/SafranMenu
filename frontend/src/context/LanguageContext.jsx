import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  UZ: {
    // Landing Page
    landing_menu: "Menyuni Ko'rish",
    landing_call: "Telefon Qilish",
    landing_location: "Joylashuv (Manzil)",
    landing_bot: "Telegram Bot",
    landing_instagram: "Instagram Profil",
    landing_daily: "Har kuni",
    landing_description: "Milliy Taomlar Restorani",

    // Menu Page
    menu_title: "Bizning Menyu",
    menu_select_cat: "Kategoriyani tanlang",
    menu_back: "Ortga",
    menu_no_products: "Hozircha taomlar mavjud emas",
    menu_no_products_desc: "Tez orada yangi taomlar qo'shiladi",
    menu_search_placeholder: "Taomlarni qidirish...",

    // Categories
    cat_mangal: "Mangal",
    cat_milliy_taomlar: "Milliy Taomlar",
    cat_ichimliklar: "Ichimliklar",
    cat_shirinliklar: "Shirinliklar",
    cat_salatlar: "Salatlar",

    // Cart
    cart_title: "Savat",
    cart_empty: "Savat bo'sh",
    cart_total: "Jami",
    cart_clear: "Tozalash",
    cart_close: "Yopish",
    cart_add_success: "Savatga qo'shildi",
  },
  RU: {
    // Landing Page
    landing_menu: "Посмотреть меню",
    landing_call: "Позвонить",
    landing_location: "Локация (Адрес)",
    landing_bot: "Телеграм бот",
    landing_instagram: "Профиль Instagram",
    landing_daily: "Ежедневно",
    landing_description: "Ресторан национальной кухни",

    // Menu Page
    menu_title: "Наше меню",
    menu_select_cat: "Выберите категорию",
    menu_back: "Назад",
    menu_no_products: "Блюда пока отсутствуют",
    menu_no_products_desc: "Новые блюда будут добавлены в ближайшее время",
    menu_search_placeholder: "Поиск блюд...",

    // Categories
    cat_mangal: "Мангал",
    cat_milliy_taomlar: "Национальные блюда",
    cat_ichimliklar: "Напитки",
    cat_shirinliklar: "Десерты",
    cat_salatlar: "Салаты",

    // Cart
    cart_title: "Корзина",
    cart_empty: "Корзина пуста",
    cart_total: "Итого",
    cart_clear: "Очистить",
    cart_close: "Закрыть",
    cart_add_success: "Добавлено в корзину",
  },
  EN: {
    // Landing Page
    landing_menu: "View Menu",
    landing_call: "Call Now",
    landing_location: "Location (Address)",
    landing_bot: "Telegram Bot",
    landing_instagram: "Instagram Profile",
    landing_daily: "Daily",
    landing_description: "National Cuisine Restaurant",

    // Menu Page
    menu_title: "Our Menu",
    menu_select_cat: "Select a category",
    menu_back: "Back",
    menu_no_products: "No dishes available yet",
    menu_no_products_desc: "New dishes will be added soon",
    menu_search_placeholder: "Search dishes...",

    // Categories
    cat_mangal: "Grill",
    cat_milliy_taomlar: "National Dishes",
    cat_ichimliklar: "Drinks",
    cat_shirinliklar: "Desserts",
    cat_salatlar: "Salads",

    // Cart
    cart_title: "Cart",
    cart_empty: "Cart is empty",
    cart_total: "Total",
    cart_clear: "Clear",
    cart_close: "Close",
    cart_add_success: "Added to cart",
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('safran-lang') || 'UZ');

  useEffect(() => {
    localStorage.setItem('safran-lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
