// アニメーション用のヘルパー関数
function animateSlide(slide) {
    const elements = slide.querySelectorAll('.transform');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.transform = 'translateY(0)';
            el.style.opacity = '1';
        }, 150 + (index * 100));
    });
}

// Swiperの初期化
const mainSwiper = new Swiper('.mainSwiper', {
    loop: true,
    effect: 'fade',
    speed: 1000,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + ' !w-16 !h-1 !rounded-none bg-white/30 hover:bg-white transition-all duration-300"></span>';
        },
    },
    on: {
        init: function () {
            this.slides.forEach(slide => {
                const elements = slide.querySelectorAll('.transform');
                elements.forEach(el => {
                    el.style.transform = 'translateY(20px)';
                    el.style.opacity = '0';
                });
            });
            
            // 最初のスライドのアニメーションを開始
            const activeSlide = this.slides[this.activeIndex];
            animateSlide(activeSlide);
        },
        slideChangeTransitionStart: function () {
            const elements = document.querySelectorAll('.swiper-slide-active .transform');
            elements.forEach(el => {
                el.style.transform = 'translateY(20px)';
                el.style.opacity = '0';
            });
        },
        slideChangeTransitionEnd: function () {
            const activeSlide = this.slides[this.activeIndex];
            animateSlide(activeSlide);
        }
    }
});

// スクロールアニメーション
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInOnScroll = () => {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', fadeInOnScroll);
fadeInOnScroll(); // 初期表示時にも実行

// ヘッダーのスクロール制御
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// モーダル制御
const modalTriggers = document.querySelectorAll('[data-modal]');
const modals = document.querySelectorAll('.modal');

modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const modalId = trigger.dataset.modal;
        const modal = document.querySelector(`#${modalId}`);
        
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// モバイルメニューの制御
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    // メニューが開いているときはスクロールを無効化
    document.body.style.overflow = mobileMenu.classList.contains('hidden') ? '' : 'hidden';
});

// メニューリンクをクリックしたらメニューを閉じる
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
    });
});

// 画像の遅延読み込み
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});

// 予約モーダル制御
const reservationButton = document.getElementById('reservation-button');
const reservationModal = document.getElementById('reservation-modal');
const closeModal = document.getElementById('close-modal');

reservationButton.addEventListener('click', () => {
    reservationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', () => {
    reservationModal.classList.remove('active');
    document.body.style.overflow = '';
});

// モーダルの外側をクリックしたら閉じる
reservationModal.addEventListener('click', (e) => {
    if (e.target === reservationModal) {
        reservationModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reservationModal.classList.contains('active')) {
        reservationModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// カレンダー機能の実装
class Calendar {
    constructor() {
        this.date = new Date();
        this.currentMonth = document.getElementById('current-month');
        this.calendarDays = document.getElementById('calendar-days');
        this.selectedDateInput = document.getElementById('selected-date');
        this.prevMonthBtn = document.getElementById('prev-month');
        this.nextMonthBtn = document.getElementById('next-month');
        this.timeSlots = document.querySelectorAll('.space-y-2 button');
        this.selectedDate = null;
        this.selectedTimeSlot = null;
    }

    init() {
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        this.prevMonthBtn.addEventListener('click', () => {
            this.date.setMonth(this.date.getMonth() - 1);
            this.render();
        });

        this.nextMonthBtn.addEventListener('click', () => {
            this.date.setMonth(this.date.getMonth() + 1);
            this.render();
        });

        // 時間選択のイベントリスナー
        this.timeSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                this.timeSlots.forEach(s => s.classList.remove('border-[#00B4D8]', 'bg-gray-50'));
                slot.classList.add('border-[#00B4D8]', 'bg-gray-50');
                this.selectedTimeSlot = slot.textContent;
            });
        });
    }

    render() {
        const year = this.date.getFullYear();
        const month = this.date.getMonth();
        const today = new Date();
        
        // 月表示を更新
        this.currentMonth.textContent = `${year}年 ${month + 1}月`;
        
        // カレンダーをクリア
        this.calendarDays.innerHTML = '';
        
        // 月の最初の日の曜日を取得
        const firstDay = new Date(year, month, 1).getDay();
        
        // 月の最後の日を取得
        const lastDate = new Date(year, month + 1, 0).getDate();
        
        // 前月の空白を追加
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            this.calendarDays.appendChild(emptyDay);
        }
        
        // 日付を生成
        for (let i = 1; i <= lastDate; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = i;
            
            const currentDate = new Date(year, month, i);
            
            // 過去の日付を無効化
            if (currentDate < today) {
                dayElement.classList.add('disabled');
            } else {
                dayElement.addEventListener('click', () => this.selectDate(currentDate, dayElement));
            }
            
            // 今日の日付をハイライト
            if (currentDate.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }
            
            this.calendarDays.appendChild(dayElement);
        }
    }

    selectDate(date, element) {
        // 以前の選択を解除
        const previousSelected = this.calendarDays.querySelector('.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        
        // 新しい日付を選択
        element.classList.add('selected');
        this.selectedDate = date;
        
        // 時間選択エリアの日付を更新
        const dateLabel = document.querySelector('.text-sm.text-gray-600');
        dateLabel.textContent = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日の時間を表示しています`;
    }
}

// DOMの読み込み完了後にカレンダーを初期化
document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.getElementById('calendar-days');
    if (calendarElement) {
        const calendar = new Calendar();
        calendar.init();
    }
});

// 言語切り替え機能
const translations = {
    ja: {
        resorts: 'リゾート',
        activities: 'アクティビティ',
        contact: 'お問い合わせ',
        mainTitle: 'Maldives Travel',
        subTitle: '弊社でご予約いただき、<br>モルディブの特別プランを<br>お楽しみください',
        contactBtn: 'お問い合わせはこちら',
        villaTitle: '最高級の水上ヴィラ',
        villaSubTitle: 'プライベートな贅沢な空間で<br>特別なひとときを',
        viewResorts: 'リゾートを見る',
        activitiesTitle: 'マリンアクティビティ',
        activitiesSubTitle: '世界最高のダイビングスポットで<br>特別な体験を',
        viewActivities: 'アクティビティを見る',
        momentTitle: '至福のひととき',
        momentSubTitle: '美しいサンセットと共に<br>特別な思い出を',
        consultPlan: 'プランを相談する',
        // 他の翻訳を追加
    },
    en: {
        resorts: 'Resorts',
        activities: 'Activities',
        contact: 'Contact',
        mainTitle: 'Maldives Travel',
        subTitle: 'Book with us and enjoy<br>our special plans in Maldives',
        contactBtn: 'Contact Us',
        villaTitle: 'Luxury Water Villas',
        villaSubTitle: 'Experience special moments<br>in a private luxurious space',
        viewResorts: 'View Resorts',
        activitiesTitle: 'Marine Activities',
        activitiesSubTitle: 'Special experiences at<br>world-class diving spots',
        viewActivities: 'View Activities',
        momentTitle: 'Blissful Moments',
        momentSubTitle: 'Create special memories<br>with beautiful sunsets',
        consultPlan: 'Consult Plan',
        // 他の翻訳を追加
    }
};

// 言語切り替えの初期化
document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('.lang-btn');
    const currentLang = localStorage.getItem('language') || 'ja';
    
    // 初期言語を設定
    setLanguage(currentLang);
    
    // 言語ボタンのクリックイベント
    langButtons.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setLanguage(lang);
            
            // アクティブなボタンを更新
            langButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll(`[data-lang="${lang}"]`).forEach(b => b.classList.add('active'));
            
            // 言語設定を保存
            localStorage.setItem('language', lang);
        });
    });
});

// 言語を設定する関数
function setLanguage(lang) {
    // メニューリンクの更新
    document.querySelectorAll('[href="#resorts"]').forEach(el => el.textContent = translations[lang].resorts);
    document.querySelectorAll('[href="#activities"]').forEach(el => el.textContent = translations[lang].activities);
    document.querySelectorAll('[href="#contact"]').forEach(el => el.textContent = translations[lang].contact);
    
    // スライドコンテンツの更新
    const slides = document.querySelectorAll('.swiper-slide');
    slides.forEach((slide, index) => {
        const content = slide.querySelector('.max-w-3xl');
        if (!content) return;
        
        switch(index) {
            case 0:
                content.querySelector('h1 span').textContent = translations[lang].mainTitle;
                content.querySelector('p').innerHTML = translations[lang].subTitle;
                content.querySelector('a').textContent = translations[lang].contactBtn;
                break;
            case 1:
                content.querySelector('h2 span').textContent = translations[lang].villaTitle;
                content.querySelector('p').innerHTML = translations[lang].villaSubTitle;
                content.querySelector('a').textContent = translations[lang].viewResorts;
                break;
            case 2:
                content.querySelector('h2 span').textContent = translations[lang].activitiesTitle;
                content.querySelector('p').innerHTML = translations[lang].activitiesSubTitle;
                content.querySelector('a').textContent = translations[lang].viewActivities;
                break;
            case 3:
                content.querySelector('h2 span').textContent = translations[lang].momentTitle;
                content.querySelector('p').innerHTML = translations[lang].momentSubTitle;
                content.querySelector('a').textContent = translations[lang].consultPlan;
                break;
        }
    });
    
    // その他の要素の翻訳を追加
} 