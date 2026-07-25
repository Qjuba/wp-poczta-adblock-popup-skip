// ==UserScript==
// @name      WP Poczta - Adblock
// @version   10
// @include   https://poczta.wp.pl/*
// @grant     none
// @run-at    document-start
// ==/UserScript==

(function() {
  'use strict';

  const injectCSS = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      div.pt_2.pb_2.pl_4.pr_2.bg-c_white.min-h_unset,
      div[class*="print-hide-tactic_removed"],
      div[class*="h_168px"] {
        display: none !important;
      }
    `;
    if (document.head) document.head.appendChild(style);
    else document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
  };
  injectCSS();

  let btnClicked = false;
  let updateScheduled = false;

  const runTextChecks = () => {
    updateScheduled = false;

    if (!btnClicked) {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent.includes('Rozumiem ryzyko, przechodzę do poczty')) {
          btn.click();
          btnClicked = true;
          break; 
        }
      }
    }

    const wpDivs = document.querySelectorAll('div.flex-sh_1.trunc_true');
    for (const div of wpDivs) {
      if (div.textContent.includes('/WP')) {
        const parent = div.closest('div.group.d_flex.flex-d_column') || div.closest('div.cursor_pointer');
        if (parent && parent.style.display !== 'none') {
          parent.style.setProperty('display', 'none', 'important');
        }
      }
    }

    const pocztaDivs = document.querySelectorAll('div.textStyle_bodyBoldMd');
    for (const div of pocztaDivs) {
      if (div.textContent.includes('Poczta')) {
        const parent = div.closest('div.group.d_flex.flex-d_column') || div.closest('div.cursor_pointer');
        if (parent && parent.style.display !== 'none') {
          parent.style.setProperty('display', 'none', 'important');
        }
      }
    }
  };

  const observer = new MutationObserver((mutations) => {
    const hasNewNodes = mutations.some(m => m.addedNodes.length > 0);
    if (!hasNewNodes) return;

    if (!updateScheduled) {
      updateScheduled = true;
      requestAnimationFrame(runTextChecks);
    }
  });

  const initObserver = () => {
    observer.observe(document.body, { childList: true, subtree: true });
    runTextChecks();
  };

  if (document.body) {
    initObserver();
  } else {
    document.addEventListener('DOMContentLoaded', initObserver);
  }

})();
