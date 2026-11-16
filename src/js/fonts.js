/*
   fonts.js: 폰트 조합(preset) 목록과 적용.

   - 쓸 수 있는 조합은 아래 FONT_PRESETS 에 언어별로 적습니다. 새 조합을 시험하려면 한 항목을 더하면 됩니다.
       heading  이름, section 제목, 하단 감사 문구 (필기체 같은 장식 폰트를 넣는 자리)
       display  날짜, 시각, 장소 이름처럼 강조되는 정보
       serif    인사말 본문, 안내 제목
       sans     나머지 본문, button
       google   Google Fonts css2 의 family 파라미터 (https://fonts.google.com 에서 고른 폰트)
       href     Google Fonts가 아닌 곳(Fontshare 등)의 stylesheet 주소. 있으면 google 대신 씁니다.
       css      그 조합에만 필요한 크기, 자간 보정 (선택)
       labelCss 영어 조합만: 영어 label(THE WEDDING DAY 등)에 이 heading 폰트를 쓸 때의 크기, 자간 보정 (선택)

   두 page의 영어 label과 표지 'WEDDING INVITATION' 은 영어 조합의 heading 폰트를 따라갑니다.
   어느 영어 조합을 따를지는 FONT_EN 으로 정해지고, 영어 page 시험 bar에서 고른 조합이 있으면 그것을 따릅니다.
   - 기본 조합은 invitation.conf 의 FONT_KO, FONT_EN 으로 고릅니다. 비우면 목록의 첫 항목입니다.
   - 시험용: 주소 뒤에 ?fonts=1 을 붙이면 화면 아래에 조합 선택 bar가 나옵니다.
     고른 조합은 이 browser tab에서만 유지되고(sessionStorage), 하객 화면에는 영향이 없습니다.
     ?font=<id> 로 특정 조합을 바로 열 수도 있습니다.

   이 파일은 <head> 에서 stylesheet보다 먼저 불러, 첫 화면부터 고른 폰트로 그려지게 합니다.
 */
(function () {
  'use strict';

  var FONT_PRESETS = {
    en: [
      {
        id: 'yellowtail-laila', label: 'Yellowtail + Laila',
        heading: "'Yellowtail', cursive",
        display: "'Laila', serif", serif: "'Laila', serif", sans: "'Laila', sans-serif",
        google: 'family=Yellowtail&family=Laila:wght@300;400;500;600',
        css: '.cover h1,.label-title,footer .thanks-line{letter-spacing:0;text-indent:0;font-weight:400}' +
             '.cover h1{font-size:50px;line-height:1.2}.cover h1 .and{font-size:22px}' +
             '.label-title{font-size:34px;line-height:1.35}footer .thanks-line{font-size:26px}',
        labelCss: 'font-size:20px;letter-spacing:0.02em;text-indent:0;text-transform:none',
      },
      {
        id: 'britney-quicksand', label: 'Britney + Quicksand (Fontshare)',
        heading: "'Britney', cursive",
        display: "'Quicksand', sans-serif", serif: "'Quicksand', sans-serif", sans: "'Quicksand', sans-serif",
        href: 'https://api.fontshare.com/v2/css?f[]=britney@400&f[]=quicksand@300,400,500,600,700&display=swap',
        css: 'body{font-weight:500}' +
             '.cover h1,.label-title,footer .thanks-line{letter-spacing:0.02em;text-indent:0;font-weight:400}' +
             '.cover h1{font-size:46px;line-height:1.2}.label-title{font-size:28px;line-height:1.35}' +
             'footer .thanks-line{font-size:22px}',
        labelCss: 'font-size:17px;letter-spacing:0.08em;text-indent:0.08em',
      },
      {
        id: 'cormorant-jost', label: 'Cormorant Garamond + Jost',
        heading: "'Cormorant Garamond', serif",
        display: "'Cormorant Garamond', serif", serif: "'Cormorant Garamond', serif", sans: "'Jost', sans-serif",
        google: 'family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500',
        css: 'body{font-weight:300}.label-title{font-size:1.35em;font-weight:500}.greeting p{font-size:1.12em}',
        labelCss: 'letter-spacing:0.22em;text-indent:0.22em',
      },
    ],
    ko: [
      {
        id: 'gowun-batang', label: 'Gowun Batang (전체)',
        heading: "'Gowun Batang', serif",
        display: "'Gowun Batang', serif", serif: "'Gowun Batang', serif", sans: "'Gowun Batang', serif",
        google: 'family=Gowun+Batang:wght@400;700',
      },
      {
        id: 'gowun', label: 'Gowun Batang + Gowun Dodum',
        heading: "'Gowun Batang', serif",
        display: "'Gowun Batang', serif", serif: "'Gowun Batang', serif",
        sans: "'Gowun Dodum', 'Apple SD Gothic Neo', sans-serif",
        google: 'family=Gowun+Batang:wght@400;700&family=Gowun+Dodum',
      },
    ],
  };

  var root = document.documentElement;
  var lang = (root.lang || '').toLowerCase().indexOf('en') === 0 ? 'en' : 'ko';
  var list = FONT_PRESETS[lang];
  var KEY = 'wedding-font-' + lang;
  var params = new URLSearchParams(location.search);

  function ss(get, val) {
    try {
      if (get) return sessionStorage.getItem(val);
      sessionStorage.setItem(val[0], val[1]);
    } catch (e) { return null; }
  }
  function find(id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function apply(p) {
    var link = document.getElementById('font-preset-link');
    if (!link) {
      link = document.createElement('link');
      link.id = 'font-preset-link';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = p.href || ('https://fonts.googleapis.com/css2?' + p.google + '&display=swap');

    root.style.setProperty('--heading', p.heading);
    root.style.setProperty('--display', p.display);
    root.style.setProperty('--serif', p.serif);
    root.style.setProperty('--sans', p.sans);

    var st = document.getElementById('font-preset-css');
    if (!st) {
      st = document.createElement('style');
      st.id = 'font-preset-css';
      document.head.appendChild(st);
    }
    st.textContent = p.css || '';
    // 이 script는 main.css 보다 먼저 돌아서, 그대로 두면 보정 CSS가 main.css 에 덮인다.
    // 문서를 다 읽은 뒤 <head> 맨 끝으로 옮겨 main.css 보다 나중에 적용되게 한다.
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { document.head.appendChild(st); }, { once: true });
    } else {
      document.head.appendChild(st);
    }
    root.setAttribute('data-font-active', p.id);
  }

  /* 영어 label(THE WEDDING DAY 등)과 표지 문구는 두 page 모두 영어 조합의 heading 폰트로 그린다. */
  function applyLabel(en) {
    var l2 = document.getElementById('font-label-link');
    var own = lang === 'en';                       // 영어 page는 본문 link가 이미 같은 폰트를 불러온다
    if (!own) {
      if (!l2) {
        l2 = document.createElement('link');
        l2.rel = 'stylesheet';
        l2.id = 'font-label-link';
        document.head.appendChild(l2);
      }
      l2.href = en.href || ('https://fonts.googleapis.com/css2?' + en.google + '&display=swap');
    }
    root.style.setProperty('--label-font', en.heading);
    var ls = document.getElementById('font-label-css');
    if (!ls) {
      ls = document.createElement('style');
      ls.id = 'font-label-css';
    }
    ls.textContent = en.labelCss ? '.label,.cover .small-cap{' + en.labelCss + '}' : '';
    var put = function () { document.head.appendChild(ls); };   // main.css 보다 뒤에 오게 한다
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', put, { once: true });
    else put();
  }

  var current = find(params.get('font')) || find(ss(true, KEY)) ||
                find(root.getAttribute('data-font')) || list[0];
  apply(current);

  if (lang === 'en') {
    applyLabel(current);
  } else {
    var enList = FONT_PRESETS.en, en = null, want = [ss(true, 'wedding-font-en'), root.getAttribute('data-font-en')];
    for (var w = 0; w < want.length && !en; w++) {
      for (var k = 0; k < enList.length; k++) if (enList[k].id === want[w]) en = enList[k];
    }
    applyLabel(en || enList[0]);
  }

  /* 시험용 선택 bar. ?fonts=1 로 한 번 열면 같은 tab에서 page를 옮겨도 계속 보인다. */
  if (params.get('fonts') === '1') ss(false, ['wedding-font-panel', '1']);
  if (ss(true, 'wedding-font-panel') !== '1') return;

  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;display:flex;gap:8px;' +
      'align-items:center;padding:10px 12px;background:rgba(30,30,30,.88);color:#fff;border-radius:14px;' +
      'font:13px/1.3 -apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.3)';
    var sel = document.createElement('select');
    sel.style.cssText = 'flex:1;min-width:0;font:inherit;padding:6px;border-radius:8px;border:0';
    list.forEach(function (p) {
      var o = document.createElement('option');
      o.value = p.id;
      o.textContent = p.label;
      if (p.id === current.id) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', function () {
      current = find(sel.value);
      apply(current);
      if (lang === 'en') applyLabel(current);
      ss(false, [KEY, current.id]);
    });
    var close = document.createElement('button');
    close.type = 'button';
    close.textContent = '✕';
    close.title = '선택 bar 닫기';
    close.style.cssText = 'border:0;background:transparent;color:#fff;font-size:16px;padding:4px 6px;cursor:pointer';
    close.addEventListener('click', function () {
      ss(false, ['wedding-font-panel', '0']);
      bar.remove();
    });
    var tag = document.createElement('span');
    tag.textContent = 'Font';
    tag.style.opacity = '.7';
    bar.append(tag, sel, close);
    document.body.appendChild(bar);
  });
})();
