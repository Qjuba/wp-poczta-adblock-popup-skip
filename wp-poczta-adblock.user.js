// ==UserScript==
// @name      WP Poczta - Adblock
// @version   9
// @include   https://poczta.wp.pl/*
// @grant     none
// ==/UserScript==

function waitForButton(text, callback) {
  const observer = new MutationObserver(() => {
    const btn = Array.from(document.querySelectorAll('button'))
      .find(btn => btn.innerText === text);
    if (btn) {
      observer.disconnect();
      callback(btn);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

waitForButton('Rozumiem ryzyko, przechodzę do poczty', btn => {
  btn.click();
  console.log(`Przycisk 'Rozumiem ryzyko, przechodzę do poczty' został kliknięty`);
});

function hideAdDivs() {
  const adClasses = ['pt_2', 'pb_2', 'pl_4', 'pr_2', 'bg-c_white', 'min-h_unset'];

  function checkAndHide() {
    // 1. Ukrywanie standardowych banerów reklamowych
    document.querySelectorAll('div').forEach(div => {
      const cn = div.className;
      if (typeof cn === 'string' && adClasses.every(cls => cn.includes(cls))) {
        div.style.setProperty('display', 'none', 'important');
        console.log('Reklama ukryta (baner):', cn);
      }
    });

    // 2. Ukrywanie sponsorowanych wiadomości 'Whatever / WP'
    document.querySelectorAll('div.flex-sh_1.trunc_true').forEach(div => {
      if (div.textContent.includes('/WP')) {
        const mainContainer = div.closest('div.group.d_flex.flex-d_column') || div.closest('div.cursor_pointer');
        
        if (mainContainer && mainContainer.style.display !== 'none') {
          mainContainer.style.setProperty('display', 'none', 'important');
          console.log('Ukryto całą reklamę /WP:', mainContainer);
        }
      }
    });

    // 3. Ukrywanie wiersza na podstawie diva textStyle_bodyBoldMd z napisem "Poczta"
    document.querySelectorAll('div.textStyle_bodyBoldMd').forEach(div => {
      if (div.textContent.trim() === 'Poczta' || div.textContent.includes('Poczta')) {
        const mainContainer = div.closest('div.group.d_flex.flex-d_column') || div.closest('div.cursor_pointer');
        
        if (mainContainer && mainContainer.style.display !== 'none') {
          mainContainer.style.setProperty('display', 'none', 'important');
          console.log('Ukryto reklamę z napisem Poczta:', mainContainer);
        }
      }
    });

    // 4. Ukrywanie kontenerów z klasą print-hide-tactic_removed
    document.querySelectorAll('div[class*="print-hide-tactic_removed"]').forEach(div => {
      if (div.style.display !== 'none') {
        div.style.setProperty('display', 'none', 'important');
        console.log('Ukryto kontener tactic_removed:', div);
      }
    });

    // 5. Ukrywanie bocznych/dolnych kaset reklamowych h_168px
    document.querySelectorAll('div[class*="h_168px"]').forEach(div => {
      if (div.style.display !== 'none') {
        div.style.setProperty('display', 'none', 'important');
        console.log('Ukryto kontener h_168px:', div);
      }
    });
  }

  checkAndHide();
  const observer = new MutationObserver(checkAndHide);
  observer.observe(document.body, { childList: true, subtree: true });
}

hideAdDivs();
