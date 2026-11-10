/* Конфигуратор Zeekr 8X: выбор версии, батареи, цвета, дисков и салона
 * с подменой официальных рендеров и вращением 360°. Без зависимостей. */
(function () {
  "use strict";

  var D = window.ZEEKR_8X;
  var root = document.querySelector("[data-cfg]");
  if (!D || !root) return;

  var $ = function (sel, el) { return (el || root).querySelector(sel); };
  var byId = function (list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; };
  var fmt = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  // ---------- состояние ----------
  var state = {
    version: "ultra",
    battery: 70,
    paint: "night-black",
    wheel: "20-guangyao",
    interior: "white-black",
    shot: "front34",
    frame: 0
  };

  // Прочитать конфигурацию из адреса (#v=ultra&b=70&p=...): ссылкой можно поделиться.
  (function readHash() {
    var h = location.hash.replace(/^#/, "");
    if (!h) return;
    h.split("&").forEach(function (kv) {
      var p = kv.split("="), k = p[0], v = decodeURIComponent(p[1] || "");
      if (k === "v" && byId(D.versions, v)) state.version = v;
      if (k === "b" && (v === "55" || v === "70")) state.battery = +v;
      if (k === "p" && byId(D.paints, v)) state.paint = v;
      if (k === "w" && byId(D.wheels, v)) state.wheel = v;
      if (k === "i" && byId(D.interiors, v)) state.interior = v;
    });
  })();

  var version = function () { return byId(D.versions, state.version); };
  var trimsOf = function (vid) { return D.trims.filter(function (t) { return t.version === vid; }); };
  var trim = function () {
    var list = trimsOf(state.version);
    for (var i = 0; i < list.length; i++) if (list[i].battery === state.battery) return list[i];
    return list[list.length - 1];
  };
  var priceFor = function (opt, vid) { return opt.price[vid || state.version]; };
  var isAvail = function (opt, vid) { var p = priceFor(opt, vid); return p !== null && p !== undefined; };
  var firstAvail = function (list, vid) {
    for (var i = 0; i < list.length; i++) if (isAvail(list[i], vid)) return list[i];
    return null;
  };

  // Привести выбор в порядок после смены версии: недоступные опции заменить первыми доступными.
  function normalize() {
    var t = trim();
    state.battery = t.battery;
    ["paint", "wheel", "interior"].forEach(function (k) {
      var list = k === "paint" ? D.paints : k === "wheel" ? D.wheels : D.interiors;
      var cur = byId(list, state[k]);
      if (!cur || !isAvail(cur)) state[k] = firstAvail(list).id;
    });
    if (!shotAllowed(curShot())) state.shot = "dash";
  }
  function shotAllowed(sh) { return !sh.only || sh.only.indexOf(state.interior) !== -1; }
  // Текущий ракурс; после свободного вращения 360° – «внешний» без миниатюры.
  function curShot() { return byId(D.shots, state.shot) || { id: "free", kind: "exterior", label: "360°" }; }

  // ---------- картинки ----------
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  function extSrc(render, frame) {
    return D.paths.exterior.replace("{render}", render).replace("{frame}", pad(frame));
  }
  function intSrc(interior, file) {
    return D.paths.interior.replace("{interior}", interior).replace("{file}", file);
  }
  function currentSrc() {
    var sh = curShot();
    if (sh.kind === "interior") return intSrc(state.interior, sh.file);
    return extSrc(byId(D.paints, state.paint).render, state.frame);
  }

  var cache = {};
  function preload(src) {
    if (cache[src]) return cache[src];
    var img = new Image();
    img.decoding = "async";
    cache[src] = new Promise(function (res) {
      img.onload = function () { res(src); };
      img.onerror = function () { res(src); };
    });
    img.src = src;
    return cache[src];
  }
  // Подгрузить все 36 кадров текущего цвета (для плавного вращения).
  var warmed = {};
  function warmFrames(render) {
    if (warmed[render]) return;
    warmed[render] = true;
    for (var i = 0; i < D.frames; i++) preload(extSrc(render, i));
  }

  // ---------- сцена ----------
  var stage = $(".cfg__stage");
  var layerA = $(".cfg__shot--a"), layerB = $(".cfg__shot--b");
  var front = layerA, back = layerB;
  var token = 0;

  // Плавная смена картинки (кроссфейд). instant – без анимации (для вращения 360°).
  function show(src, instant) {
    var my = ++token;
    if (instant) {
      front.querySelector("img").src = src;
      return;
    }
    stage.classList.add("is-loading");
    preload(src).then(function () {
      if (my !== token) return;
      var img = back.querySelector("img");
      img.src = src;
      img.alt = altText();
      back.classList.add("is-front");
      front.classList.remove("is-front");
      var t = front; front = back; back = t;
      stage.classList.remove("is-loading");
    });
  }

  function altText() {
    var sh = curShot();
    if (sh.kind === "interior") return "Салон Zeekr 8X, " + byId(D.interiors, state.interior).name.toLowerCase();
    return "Zeekr 8X " + version().name + ", цвет " + byId(D.paints, state.paint).name + ", " + sh.label.toLowerCase();
  }

  // Вращение 360°: перетаскивание мышью или пальцем по внешним ракурсам.
  (function drag() {
    var startX = 0, startFrame = 0, active = false, moved = false;
    var step = function () { return Math.max(8, stage.clientWidth / 60); };
    stage.addEventListener("pointerdown", function (e) {
      var sh = curShot();
      if (sh.kind !== "exterior") return;
      active = true; moved = false;
      startX = e.clientX; startFrame = state.frame;
      warmFrames(byId(D.paints, state.paint).render);
    });
    window.addEventListener("pointermove", function (e) {
      if (!active) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4 && !moved) { moved = true; stage.classList.add("is-dragging"); }
      if (!moved) return;
      var f = ((startFrame - Math.round(dx / step())) % D.frames + D.frames) % D.frames;
      if (f !== state.frame) {
        state.frame = f;
        show(currentSrc(), true);
        markShotByFrame();
      }
    });
    var end = function () {
      if (!active) return;
      active = false;
      stage.classList.remove("is-dragging");
    };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  })();

  // Клавиатура на сцене: ←/→ вращают машину.
  stage.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    var sh = curShot();
    if (sh.kind !== "exterior") return;
    e.preventDefault();
    state.frame = (state.frame + (e.key === "ArrowRight" ? 1 : -1) + D.frames) % D.frames;
    warmFrames(byId(D.paints, state.paint).render);
    show(currentSrc(), true);
    markShotByFrame();
  });

  function markShotByFrame() {
    var match = null;
    D.shots.forEach(function (s) { if (s.kind === "exterior" && s.frame === state.frame) match = s; });
    state.shot = match ? match.id : "free"; // свободный ракурс – ни одна миниатюра не активна
    renderThumbs(true);
  }

  // ---------- рендер панели ----------
  function priceLabel(p) {
    if (p === null || p === undefined) return '<span class="cfg__na">не для этой версии</span>';
    if (p === 0) return "входит";
    return "+" + fmt(p) + " ¥";
  }

  function renderVersions() {
    var html = D.versions.map(function (v) {
      var from = Math.min.apply(null, trimsOf(v.id).map(function (t) { return t.priceCny; }));
      return '<button type="button" class="cfg__trim' + (v.id === state.version ? " is-active" : "") +
        '" data-version="' + v.id + '" aria-pressed="' + (v.id === state.version) + '">' +
        '<span class="cfg__trim-name">8X ' + esc(v.name) + "</span>" +
        '<span class="cfg__trim-tag">' + esc(v.tag) + "</span>" +
        '<span class="cfg__trim-price">от ' + fmt(from) + " ¥</span></button>";
    }).join("");
    $("[data-slot=versions]").innerHTML = html;

    var bats = trimsOf(state.version);
    $("[data-slot=battery]").innerHTML = bats.map(function (t) {
      return '<button type="button" class="cfg__seg' + (t.battery === state.battery ? " is-active" : "") +
        '" data-battery="' + t.battery + '" aria-pressed="' + (t.battery === state.battery) + '">' +
        "<b>" + t.battery + " кВт·ч</b><span>" + t.rangeEv + " км на электричестве · " + fmt(t.priceCny) + " ¥</span></button>";
    }).join("");
    $("[data-slot=battery-note]").hidden = bats.length > 1;

    $("[data-slot=version-rows]").innerHTML = version().rows.map(function (r) {
      return '<div class="cfg__row"><dt>' + esc(r.label) + "</dt><dd>" + esc(r.value) + "</dd></div>";
    }).join("");
  }

  function renderPaints() {
    var cur = byId(D.paints, state.paint);
    $("[data-slot=paint-picked]").textContent = cur.name;
    $("[data-slot=paints]").innerHTML = D.paints.filter(function (p) { return isAvail(p); }).map(function (p) {
      return '<button type="button" class="cfg__swatch' + (p.id === state.paint ? " is-active" : "") +
        '" data-paint="' + p.id + '" title="' + esc(p.name) + '" aria-label="' + esc(p.name) + '" aria-pressed="' + (p.id === state.paint) + '">' +
        '<img src="' + p.swatch + '" alt="" width="44" height="44"></button>';
    }).join("");
    var p = priceFor(cur);
    $("[data-slot=paint-note]").innerHTML = esc(cur.note) + " · " + priceLabel(p);
  }

  function wheelIcon(w) {
    var spokes = /lingbo|xingyao/.test(w.id) ? 10 : /aero/.test(w.id) ? 6 : 5;
    var dark = /yaoye|smoked/.test(w.id);
    var rim = dark ? "#1b1f25" : "#b9c0c8", hub = dark ? "#3a4048" : "#e3e7eb";
    var s = '<svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true">' +
      '<circle cx="28" cy="28" r="27" fill="#0b0d10"/><circle cx="28" cy="28" r="21" fill="' + rim + '"/>' +
      '<circle cx="28" cy="28" r="17" fill="#0b0d10"/>';
    for (var i = 0; i < spokes; i++) {
      s += '<rect x="26.6" y="11" width="2.8" height="17" rx="1.2" fill="' + rim + '" transform="rotate(' + (360 / spokes * i) + ' 28 28)"/>';
    }
    if (/^2[12]/.test(w.id) && !/20-/.test(w.id)) s += '<rect x="9" y="22" width="4" height="12" rx="1.5" fill="' + (state.version === "shadow" ? "#ff6a00" : "#d6312b") + '"/>';
    s += '<circle cx="28" cy="28" r="4.5" fill="' + hub + '"/></svg>';
    return s;
  }

  function renderWheels() {
    var cur = byId(D.wheels, state.wheel);
    $("[data-slot=wheel-picked]").textContent = cur.name;
    $("[data-slot=wheels]").innerHTML = D.wheels.filter(function (w) { return isAvail(w); }).map(function (w) {
      return '<button type="button" class="cfg__option' + (w.id === state.wheel ? " is-active" : "") +
        '" data-wheel="' + w.id + '" aria-pressed="' + (w.id === state.wheel) + '">' + wheelIcon(w) +
        '<span class="cfg__option-text"><span class="cfg__option-name">' + esc(w.name) + "</span>" +
        '<span class="cfg__option-note">' + esc(w.note) + "</span></span>" +
        '<span class="cfg__option-price">' + priceLabel(priceFor(w)) + "</span></button>";
    }).join("");
  }

  function renderInteriors() {
    var cur = byId(D.interiors, state.interior);
    $("[data-slot=interior-picked]").textContent = cur.name;
    $("[data-slot=interiors]").innerHTML = D.interiors.filter(function (i) { return isAvail(i); }).map(function (i) {
      return '<button type="button" class="cfg__swatch' + (i.id === state.interior ? " is-active" : "") +
        '" data-interior="' + i.id + '" title="' + esc(i.name) + '" aria-label="' + esc(i.name) + '" aria-pressed="' + (i.id === state.interior) + '">' +
        '<img src="' + i.swatch + '" alt="" width="44" height="44"></button>';
    }).join("");
    $("[data-slot=interior-note]").textContent = state.version === "shadow"
      ? "У Shadow салон только в фирменной чёрно-оранжевой отделке"
      : "Кожа Nappa · все варианты без доплаты";
  }

  function renderThumbs(onlyActive) {
    var box = $("[data-slot=thumbs]");
    var shots = D.shots.filter(shotAllowed);
    if (!onlyActive) {
      var render = byId(D.paints, state.paint).render;
      box.innerHTML = shots.map(function (s) {
        var src = s.kind === "interior" ? intSrc(state.interior, s.file) : extSrc(render, s.frame);
        return '<button type="button" class="cfg__thumb" data-shot="' + s.id + '">' +
          '<img src="' + src + '" alt="" loading="lazy" width="160" height="100"><span>' + esc(s.label) + "</span></button>";
      }).join("");
    }
    Array.prototype.forEach.call(box.children, function (b) {
      var on = b.getAttribute("data-shot") === state.shot;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on);
    });
    stage.classList.toggle("is-ext", curShot().kind === "exterior");
  }

  function renderSummary() {
    var t = trim(), v = version();
    var paint = byId(D.paints, state.paint), wheel = byId(D.wheels, state.wheel), inter = byId(D.interiors, state.interior);
    var extras = [
      { name: "Цвет: " + paint.name, p: priceFor(paint) },
      { name: "Диски: " + wheel.name, p: priceFor(wheel) },
      { name: "Салон: " + inter.name.toLowerCase(), p: priceFor(inter) }
    ];
    var total = t.priceCny + extras.reduce(function (s, e) { return s + (e.p || 0); }, 0);

    $("[data-slot=summary-config]").textContent =
      "8X " + v.name + " " + t.battery + " кВт·ч: " + paint.name.toLowerCase() + ", диски " + wheel.name + ", салон " + inter.name.toLowerCase();
    $("[data-slot=summary-lines]").innerHTML =
      '<div class="cfg__row"><dt>Комплектация 8X ' + esc(v.name) + " " + t.battery + " кВт·ч</dt><dd>" + fmt(t.priceCny) + " ¥</dd></div>" +
      extras.map(function (e) {
        return '<div class="cfg__row"><dt>' + esc(e.name) + "</dt><dd>" + (e.p ? "+" + fmt(e.p) + " ¥" : "входит") + "</dd></div>";
      }).join("");
    $("[data-slot=price]").textContent = fmt(total) + " ¥";

    // Подпись на сцене
    $("[data-slot=stage-name]").textContent = "Zeekr 8X " + v.name;
    $("[data-slot=stage-note]").textContent = paint.name + " · " + wheel.name + " · салон " + inter.name.toLowerCase();

    // Скрытое поле для заявки
    var hidden = root.querySelector("input[name=config]");
    if (hidden) hidden.value = $("[data-slot=summary-config]").textContent + " · " + fmt(total) + " ¥";

    // Адрес страницы с конфигурацией
    var hash = "#v=" + state.version + "&b=" + state.battery + "&p=" + state.paint + "&w=" + state.wheel + "&i=" + state.interior;
    if (history.replaceState) history.replaceState(null, "", hash);
  }

  function renderAll(changedImage) {
    normalize();
    renderVersions();
    renderPaints();
    renderWheels();
    renderInteriors();
    renderThumbs(false);
    renderSummary();
    if (changedImage !== false) show(currentSrc());
  }

  // ---------- события ----------
  root.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b || !root.contains(b)) return;
    var d = b.dataset;
    if (d.version) {
      if (d.version === state.version) return;
      state.version = d.version;
      // Сохраняем батарею, если у новой версии она есть
      var bats = trimsOf(d.version).map(function (t) { return t.battery; });
      if (bats.indexOf(state.battery) === -1) state.battery = bats[bats.length - 1];
      // При смене группы (обычная ↔ Shadow) показываем машину снаружи
      var sh = curShot();
      if (sh.kind === "interior") { state.shot = "front34"; state.frame = 0; }
      renderAll();
    } else if (d.battery) {
      state.battery = +d.battery;
      renderAll(false);
    } else if (d.paint) {
      state.paint = d.paint;
      var s2 = curShot();
      if (s2.kind === "interior") { state.shot = "front34"; state.frame = 0; }
      renderAll();
    } else if (d.wheel) {
      state.wheel = d.wheel;
      renderAll(false);
    } else if (d.interior) {
      state.interior = d.interior;
      state.shot = "dash";
      renderAll();
    } else if (d.shot) {
      var s = byId(D.shots, d.shot);
      state.shot = s.id;
      if (s.kind === "exterior") state.frame = s.frame;
      renderThumbs(true);
      show(currentSrc());
    } else if (d.nav) {
      var shots = D.shots.filter(shotAllowed);
      var idx = -1;
      shots.forEach(function (x, i) { if (x.id === state.shot) idx = i; });
      idx = (idx + (d.nav === "next" ? 1 : -1) + shots.length) % shots.length;
      state.shot = shots[idx].id;
      if (shots[idx].kind === "exterior") state.frame = shots[idx].frame;
      renderThumbs(true);
      show(currentSrc());
    }
  });

  // ---------- форма заявки ----------
  var form = root.querySelector("form.cfg__form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".cfg__form-status");
      var phone = form.querySelector("input[name=phone]").value.replace(/\D/g, "");
      if (phone.length < 7) {
        status.textContent = "Проверьте номер телефона";
        status.className = "cfg__form-status is-error";
        return;
      }
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.source = "Конфигуратор Zeekr 8X";
      data.page = location.href;

      var endpoint = form.getAttribute("data-endpoint");
      var done = function () {
        status.textContent = "Спасибо! Заявка отправлена. Менеджер свяжется с вами.";
        status.className = "cfg__form-status is-ok";
        form.reset();
        renderSummary();
      };
      if (!endpoint) {
        // Обработчик заявок не подключён: укажите URL в data-endpoint у формы.
        console.warn("[zeekr-8x] data-endpoint не задан, заявка:", data);
        done();
        return;
      }
      fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
        .catch(function () {
          status.textContent = "Не удалось отправить. Позвоните нам: +375 (29) 135-88-88";
          status.className = "cfg__form-status is-error";
        });
    });
  }

  renderAll(false);
  // Первая картинка – сразу, без кроссфейда
  front.querySelector("img").src = currentSrc();
  front.classList.add("is-front");
  // После загрузки страницы – подогреть кадры 360° текущего цвета
  window.addEventListener("load", function () { setTimeout(function () { warmFrames(byId(D.paints, state.paint).render); }, 800); });
})();
