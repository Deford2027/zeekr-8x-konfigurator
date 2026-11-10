/*
 * Данные конфигуратора Zeekr 8X.
 * Цены – официальные розничные (指导价) Zeekr в Китае, 2026 модельный год, юани.
 * Источники: zeekrlife.com (официальный сайт Zeekr), pcauto.com.cn, 12365auto.com.
 * Формат avail: { trimGroupId: доплата в ¥ | null (недоступно) }.
 */
window.ZEEKR_8X = {
  car: "Zeekr 8X",

  // Версии. group – общий набор опций (normal / shadow), от него зависят рендеры.
  versions: [
    {
      id: "max",
      name: "Max",
      group: "normal",
      tag: "Начальная",
      rows: [
        { label: "Моторы", value: "2 мотора, 660 кВт (898 л.с.), 0–100 за 3,7 с" },
        { label: "Диски в базе", value: "20″ «Гуанъяо», шины 255/55 R20" },
        { label: "Экраны", value: "Центральный 16″ + приборная панель 13,02″" },
        { label: "Подвеска", value: "Пневматическая, двухкамерная" }
      ]
    },
    {
      id: "ultra",
      name: "Ultra",
      group: "normal",
      tag: "Берут чаще всего",
      rows: [
        { label: "Моторы", value: "2 мотора, 660 кВт (898 л.с.), 0–100 за 3,7 с" },
        { label: "Диски в базе", value: "20″ «Гуанъяо», шины 255/55 R20" },
        { label: "Экраны", value: "Двойной экран 16″ – водителю и пассажиру" },
        { label: "Салон", value: "Можно заказать 6-местный вариант" }
      ]
    },
    {
      id: "ultra-plus",
      name: "Ultra+",
      group: "normal",
      tag: "Лучшее шасси",
      rows: [
        { label: "Моторы", value: "2 мотора, 660 кВт (898 л.с.), 0–100 за 3,7 с" },
        { label: "Диски в базе", value: "21″ «Шуанъяо» + передние суппорты Brembo" },
        { label: "Подвеска", value: "+ амортизаторы CCD с двумя клапанами, активные стабилизаторы" },
        { label: "Экраны", value: "Двойной экран 16″ – водителю и пассажиру" }
      ]
    },
    {
      id: "shadow",
      name: "Shadow",
      group: "shadow",
      tag: "Спортивная «Яоин»",
      rows: [
        { label: "Моторы", value: "3 мотора, 1030 кВт (1400 л.с.), 0–100 за 2,96 с" },
        { label: "Диски", value: "22″ кованые, шины 275/40 спереди и 315/35 сзади" },
        { label: "Тормоза", value: "Brembo, 6-поршневые оранжевые суппорты" },
        { label: "Кузов", value: "Свой бампер, карбоновый обвес, активное антикрыло" }
      ]
    }
  ],

  // Конкретные комплектации: версия + батарея. Цена – официальная в Китае.
  trims: [
    { id: "max-55",        version: "max",        battery: 55, priceCny: 356800, rangeEv: 320 },
    { id: "max-70",        version: "max",        battery: 70, priceCny: 371800, rangeEv: 410 },
    { id: "ultra-55",      version: "ultra",      battery: 55, priceCny: 376800, rangeEv: 318 },
    { id: "ultra-70",      version: "ultra",      battery: 70, priceCny: 391800, rangeEv: 410 },
    { id: "ultra-plus-55", version: "ultra-plus", battery: 55, priceCny: 411800, rangeEv: 318 },
    { id: "ultra-plus-70", version: "ultra-plus", battery: 70, priceCny: 426800, rangeEv: 410 },
    { id: "shadow-70",     version: "shadow",     battery: 70, priceCny: 500800, rangeEv: 330 }
  ],

  // Цвета кузова. render – имя набора кадров 360° в /img/zeekr-8x/360/.
  // price: { versionId: доплата | null }.
  paints: [
    { id: "night-black", name: "Чёрный «Полярная ночь»", cn: "极夜黑", note: "базовый цвет",
      swatch: "img/zeekr-8x/options/paint-normal-black_new.png", render: "night-black",
      price: { max: 0, ultra: 0, "ultra-plus": 0, shadow: null } },
    { id: "day-white", name: "Белый «Полярный день»", cn: "极昼白", note: "базовый цвет",
      swatch: "img/zeekr-8x/options/paint-normal-white.png", render: "day-white",
      price: { max: 0, ultra: 0, "ultra-plus": 0, shadow: null } },
    { id: "cloud-red", name: "Янтарно-красный", cn: "云珀红", note: "опция, сейчас по акции бесплатно",
      swatch: "img/zeekr-8x/options/paint-normal-red.png", render: "cloud-red",
      price: { max: 0, ultra: 0, "ultra-plus": 0, shadow: null } },
    { id: "moon-grey", name: "Тёмно-серый «Лунное море»", cn: "月海灰", note: "опция, сейчас по акции бесплатно",
      swatch: "img/zeekr-8x/options/paint-normal-darkGrey.png", render: "moon-grey",
      price: { max: 0, ultra: 0, "ultra-plus": 0, shadow: null } },
    { id: "basalt-grey", name: "Светло-серый «Базальт»", cn: "玄武灰", note: "опция, сейчас по акции бесплатно",
      swatch: "img/zeekr-8x/options/paint-normal-lightGrey.png", render: "basalt-grey",
      price: { max: 0, ultra: 0, "ultra-plus": 0, shadow: null } },

    { id: "shadow-black", name: "Чёрный «Полярная ночь»", cn: "极夜黑", note: "базовый цвет Shadow",
      swatch: "img/zeekr-8x/options/paint-shadow-black.png", render: "shadow-black",
      price: { max: null, ultra: null, "ultra-plus": null, shadow: 0 } },
    { id: "hunter-blue", name: "Голубой «Охотник»", cn: "猎空蓝", note: "только Shadow",
      swatch: "img/zeekr-8x/options/paint-shadow-blue.png", render: "hunter-blue",
      price: { max: null, ultra: null, "ultra-plus": null, shadow: 8000 } },
    { id: "matte-grey", name: "Матовый серый «Звёздный»", cn: "哑光星际灰", note: "матовая плёнка, только Shadow",
      swatch: "img/zeekr-8x/options/paint-shadow-grey.png", render: "matte-grey",
      price: { max: null, ultra: null, "ultra-plus": null, shadow: 30000 } }
  ],

  wheels: [
    { id: "20-guangyao", name: "20″ «Гуанъяо»", note: "стандартные диски Max и Ultra",
      price: { max: 0, ultra: 0, "ultra-plus": null, shadow: null } },
    { id: "21-shuangyao", name: "21″ «Шуанъяо»", note: "передние суппорты Brembo, 4 поршня",
      price: { max: 20000, ultra: 20000, "ultra-plus": 0, shadow: null } },
    { id: "21-xingyao", name: "21″ «Синъяо»", note: "передние суппорты Brembo, 4 поршня",
      price: { max: 20000, ultra: 20000, "ultra-plus": null, shadow: null } },
    { id: "21-aero", name: "21″ аэродинамические", note: "передние суппорты Brembo, 4 поршня",
      price: { max: 20000, ultra: 20000, "ultra-plus": null, shadow: null } },
    { id: "22-huiyao", name: "22″ «Хуэйяо»", note: "Brembo + амортизаторы CCD с двумя клапанами",
      price: { max: 35000, ultra: 35000, "ultra-plus": 30000, shadow: null } },
    { id: "22-lingbo", name: "22″ кованые «Линбо»", note: "Brembo 6 поршней, шины разной ширины",
      price: { max: null, ultra: null, "ultra-plus": null, shadow: 0 } },
    { id: "22-lingbo-smoked", name: "22″ кованые «Линбо», тёмные", note: "дымчато-чёрная отделка",
      price: { max: null, ultra: null, "ultra-plus": null, shadow: 2000 } },
    { id: "22-yaoye", name: "Пакет «Яое»: 22″ чёрные", note: "чёрные диски, Brembo, чёрный декор кузова",
      price: { max: 12000, ultra: 12000, "ultra-plus": 12000, shadow: 0 } }
  ],

  interiors: [
    { id: "white-black", name: "Белый с чёрным", cn: "白黑",
      swatch: "img/zeekr-8x/options/trim-white-black.png",
      price: { max: 0, ultra: 0, "ultra-plus": 0, shadow: null } },
    { id: "brown-black", name: "Коричневый с чёрным", cn: "棕黑",
      swatch: "img/zeekr-8x/options/trim-brown-black.png",
      price: { max: 0, ultra: 0, "ultra-plus": 0, shadow: null } },
    { id: "red", name: "Красный «Алая тень»", cn: "赤影红",
      swatch: "img/zeekr-8x/options/trim-red.png",
      price: { max: 0, ultra: 0, "ultra-plus": 0, shadow: null } },
    { id: "black", name: "Полностью чёрный", cn: "纯黑",
      swatch: "img/zeekr-8x/options/trim-black.png",
      price: { max: 0, ultra: 0, "ultra-plus": 0, shadow: null } },
    { id: "black-orange", name: "Чёрный с оранжевым", cn: "黑橙",
      swatch: "img/zeekr-8x/options/trim-black-orange.png",
      price: { max: null, ultra: null, "ultra-plus": null, shadow: 0 } }
  ],

  // Ракурсы. frame – номер кадра официального 360° (0–35).
  shots: [
    { id: "front34", label: "Спереди ¾", kind: "exterior", frame: 0 },
    { id: "side",    label: "Сбоку",     kind: "exterior", frame: 4 },
    { id: "rear34",  label: "Сзади ¾",   kind: "exterior", frame: 9 },
    { id: "front",   label: "Спереди",   kind: "exterior", frame: 32 },
    { id: "dash",    label: "Салон",     kind: "interior", file: "dash" },
    { id: "seats",   label: "Кресла",    kind: "interior", file: "seats", only: ["black-orange"] }
  ],
  frames: 36,
  paths: {
    exterior: "img/zeekr-8x/360/{render}--{frame}.webp",
    interior: "img/zeekr-8x/interior/{interior}--{file}.webp"
  },

  commonSpecs: [
    { label: "Тип", value: "Последовательный гибрид с подзарядкой, полный привод" },
    { label: "Двигатель-генератор", value: "Бензиновый 2.0T, 205 кВт" },
    { label: "Электрика", value: "Архитектура 900 В" },
    { label: "Проекция на стекло", value: "AR-HUD 44″" },
    { label: "Мест", value: "5, у Ultra и Ultra+ можно 6" }
  ]
};
