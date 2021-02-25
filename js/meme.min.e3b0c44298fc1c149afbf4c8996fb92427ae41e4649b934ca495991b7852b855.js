
;
// https://www.30secondsofcode.org/js/s/throttle/

const throttle = (fn, wait) => {
    let inThrottle, lastFn, lastTime;
    return function() {
        const context = this,
              args = arguments;
        if (!inThrottle) {
            fn.apply(context, args);
            lastTime = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFn);
            lastFn = setTimeout(function() {
                if (Date.now() - lastTime >= wait) {
                    fn.apply(context, args);
                    lastTime = Date.now();
                }
            }, Math.max(wait - (Date.now() - lastTime), 0));
        }
    };
};

const delayTime = 420;

;
window.addEventListener(
  'DOMContentLoaded',
  (event) => {
    /**
     * Measure header height for the scrolling fix
     */
    const header = document.querySelector('.header');

    if (header) {
      const headerHeight = window
        .getComputedStyle(header, null)
        .getPropertyValue('height');

      document.documentElement.style.setProperty(
        '--header-height',
        headerHeight
      );

      
    }
  },
  { once: true }
);

;
window.addEventListener("DOMContentLoaded", event => {
    // Create nav toggle icon

    const navToggleLabel = document.querySelector('.nav-toggle');
    const navToggleLabelInner = document.createElement('div');

    navToggleLabelInner.className = 'nav-toggle-inner';
    navToggleLabel.appendChild(navToggleLabelInner);

    for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');

        navToggleLabelInner.appendChild(span);
    }


    // Main function

    const navToggle = document.getElementById('nav-toggle');
    const header = document.querySelector('.header');
    const navCurtain = document.querySelector('.nav-curtain');

    navToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            header.classList.add('open');
            navToggleLabel.classList.add('open');

            header.classList.remove('fade');

            navCurtain.style = 'display: block';
        } else {
            header.classList.remove('open');
            navToggleLabel.classList.remove('open');

            header.classList.add('fade');

            // Cannot remove `display: block` immediately, or CSS animation
            // will failed. The workaround is down below.

            // navCurtain.removeAttribute('style');
        }
    });


    // Fix animation failed caused by removing `display: block`

    navCurtain.addEventListener('animationend', (e) => {
        if (!navToggle.checked) {
            e.target.removeAttribute('style');
        }
    });


    window.addEventListener(
        'scroll',
        throttle(function() {
            // Close nav when window is scrolled by user
            checkInput();
        }, delayTime)
    );


    const maxWidth = window.getComputedStyle(document.documentElement, null).getPropertyValue('--max-width');
    let mediaQuery = window.matchMedia(`(max-width: ${maxWidth})`);

    mediaQuery.addListener(e => {
        if (!e.matches) {
            // We are no longer in responsive mode, close nav
            closeNav(true);
        }
    });


    function checkInput() {
        // https://github.com/reuixiy/hugo-theme-meme/issues/171
        const input = document.getElementById('search-input');
        if (input && input === document.activeElement) {
            return;
        }

        closeNav();
    }

    function closeNav(noFade) {
        if (navToggle.checked) {
            navToggle.checked = false;

            header.classList.remove('open');
            navToggleLabel.classList.remove('open');

            if (noFade) {
                navCurtain.removeAttribute("style");
            }
            else {
                header.classList.add('fade');
            }
        }
    }
}, {once: true});

;
window.addEventListener("DOMContentLoaded", event => {
    const backToTop = document.getElementById('back-to-top');

    if (backToTop !== null) {
        window.addEventListener(
            'scroll',
            throttle(function() {
                window.scrollY > 100 ? backToTop.classList.add('show') : backToTop.classList.remove('show');
            }, delayTime)
        );
    }
}, {once: true});

;
// Reactive Dark Mode
// https://web.dev/prefers-color-scheme/#reacting-on-dark-mode-changes
// https://twitter.com/ChromeDevTools/status/1197175265643745282

const userPrefers = localStorage.getItem('theme');
if (userPrefers === 'dark') {
    changeModeMeta('dark');
} else if (userPrefers === 'light') {
    changeModeMeta('light');
}

window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
    changeMode();
});

window.addEventListener("DOMContentLoaded", event => {
    // Update meta tags and code highlighting
    changeMode();

    // Theme Switcher
    // https://derekkedziora.com/blog/dark-mode

    const themeSwitcher = document.getElementById('theme-switcher');

    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', (e) => {
            e.preventDefault();
            if (getCurrentTheme() == "dark") {
                changeModeMeta('light');
            } else {
                changeModeMeta('dark');
            }
            changeMode();
            storePrefers();
        });
    }
}, {once: true});

// Sync Across Tabs
// https://codepen.io/tevko/pen/GgWYpg

window.addEventListener('storage', function (event) {
    if (event.key !== 'theme') {
      return;
    }

    if (event.newValue === 'dark') {
        changeModeMeta('dark');
    } else {
        changeModeMeta('light');
    }
    changeMode();
});

// Functions

function getCurrentTheme() {
    return JSON.parse(window.getComputedStyle(document.documentElement, null).getPropertyValue("--theme-name"));
}

function changeModeMeta(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

function changeMode() {
    const isDark = getCurrentTheme() === 'dark';

    // Change theme color meta
    const themeColor = isDark ? '#16171d' : '#fff';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);

    

    // Mermaid
    // https://github.com/reuixiy/hugo-theme-meme/issues/205
    if (typeof mermaidConfig !== 'undefined') {
        const mermaids = document.querySelectorAll('.mermaid');

        mermaids.forEach(e => {
            if (e.getAttribute('data-processed')) {
                // Already rendered, clean the processed attributes
                e.removeAttribute('data-processed');
                // Replace the rendered HTML with the stored text
                e.innerHTML = e.getAttribute('data-graph');
            } else {
                // First time, store the text
                e.setAttribute('data-graph', e.textContent);
            }
        });

        if (isDark) {
            mermaidConfig.theme = 'dark';
            mermaid.initialize(mermaidConfig);
            mermaid.init();
        } else {
            mermaidConfig.theme = 'default';
            mermaid.initialize(mermaidConfig);
            mermaid.init();
        }
    }
}

function storePrefers() {
    window.localStorage.setItem('theme', getCurrentTheme());
}

;
// Copy Button for Code Blocks

// References
// 1. https://tomspencer.dev/blog/2018/09/14/adding-click-to-copy-buttons-to-a-hugo-powered-blog/
// 2. https://www.dannyguo.com/blog/how-to-add-copy-to-clipboard-buttons-to-code-blocks-in-hugo/

window.addEventListener("DOMContentLoaded", event => {
    const copyText = '复制';
    const copiedText = '已复制';

    document.querySelectorAll('.post-body > pre').forEach((e) => {
        let div = document.createElement('div');
        e.parentNode.replaceChild(div, e);
        div.appendChild(e);
    });

    function addCopyButtons(clipboard) {
        const divs = document.querySelectorAll('table.lntable, .highlight > pre, .post-body > div > pre');

        divs.forEach((containerEl) => {
            containerEl.parentNode.style.position = 'relative';

            const button = document.createElement('button');
            button.className = 'copy-button';
            button.type = 'button';
            button.innerText = copyText;

            if (containerEl.classList.contains('lntable')) {
                var codeBlock = containerEl.querySelectorAll('.lntd')[1];
            } else {
                var codeBlock = containerEl.querySelector('code');
            }

            button.addEventListener('click', () => {
                clipboard.writeText(codeBlock.innerText).then(() => {
                    /* Chrome doesn't seem to blur automatically,
                       leaving the button in a focused state. */
                    button.blur();

                    button.innerText = copiedText;

                    setTimeout(() => {
                        button.innerText = copyText;
                    }, 1000);
                }).catch((error) => {
                    button.innerText = 'Error';

                    console.error(error);
                });
            });

            containerEl.appendChild(button);

            
                containerEl.parentNode.addEventListener('mouseover', () => {
                    button.style = 'visibility: visible; opacity: 1';
                });

                containerEl.parentNode.addEventListener('mouseout', () => {
                    button.style = 'visibility: hidden; opacity: 0';
                });
            
        });
    }

    if (navigator && navigator.clipboard) {
        addCopyButtons(navigator.clipboard);
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/clipboard-polyfill@2.8.6/dist/clipboard-polyfill.min.js';
        script.defer = true;
        script.onload = function() {
            addCopyButtons(clipboard);
        };

        document.head.appendChild(script);
    }
}, {once: true});

;
function siteTime(){
    window.setTimeout("siteTime()", 1000);
    var seconds = 1000
    var minutes = seconds * 60
    var hours = minutes * 60
    var days = hours * 24
    var years = days * 365
    var today = new Date()
    var todayYear = today.getFullYear()
    var todayMonth = today.getMonth() + 1
    var todayDate = today.getDate()
    var todayHour = today.getHours()
    var todayMinute = today.getMinutes()
    var todaySecond = today.getSeconds()
    var t1 = Date.UTC(2021, 02, 24, 00, 00, 00)
    var t2 = Date.UTC(todayYear,todayMonth,todayDate,todayHour,todayMinute,todaySecond)
    var diff = t2-t1
    var diffYears = Math.floor(diff/years)
    var diffDays = Math.floor((diff/days)-diffYears*365)
    var diffHours = Math.floor((diff-(diffYears*365+diffDays)*days)/hours)
    var diffMinutes = Math.floor((diff-(diffYears*365+diffDays)*days-diffHours*hours)/minutes)
    var diffSeconds = Math.floor((diff-(diffYears*365+diffDays)*days-diffHours*hours-diffMinutes*minutes)/seconds)

    if(diffYears==0){
        document.getElementById("sitetime").innerHTML=" "+diffDays+" 天 "+diffHours+" 小时 "+diffMinutes+" 分钟 "+diffSeconds+" 秒"
    }else{
        document.getElementById("sitetime").innerHTML=" "+diffYears+" 年 "+diffDays+" 天 "+diffHours+" 小时 "+diffMinutes+" 分钟 "+diffSeconds+" 秒"
    }
}
    siteTime()
