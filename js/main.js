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

// コンシェルジュ情報
const concierges = {
    michael: {
        name: 'Michael Thompson',
        title: 'プライベートジェット＆ヨットスペシャリスト',
        specialties: ['プライベートジェット', 'ラグジュアリーヨット', 'VIPサービス'],
        description: 'プライベートジェットやラグジュアリーヨットの手配を含む、完全プライベートな旅をコーディネート。世界中のVIPのお客様の移動と滞在をサポートしてまいりました。'
    },
    sarah: {
        name: 'Sarah Williams',
        title: 'ラグジュアリーリゾートスペシャリスト',
        specialties: ['プライベートアイランド', '美食体験', 'アートツアー'],
        description: '世界中の超高級リゾートやプライベートアイランドでの経験を活かし、美食やアート、文化体験を含む洗練された滞在をご提案いたします。'
    }
};

// コンシェルジュ選択時の処理
function selectConcierge(id) {
    const concierge = concierges[id];
    const bookingSection = document.getElementById('booking-section');
    const conciergeInfo = document.getElementById('selected-concierge-info');
    
    // コンシェルジュ情報を表示
    conciergeInfo.innerHTML = `
        <div class="flex items-center mb-2">
            <span class="font-bold text-lg">${concierge.name}</span>
            <span class="mx-2">|</span>
            <span class="text-gray-600">${concierge.title}</span>
        </div>
        <div class="flex flex-wrap gap-2 mb-2">
            ${concierge.specialties.map(specialty => 
                `<span class="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">${specialty}</span>`
            ).join('')}
        </div>
    `;
    
    // 予約セクションを表示
    bookingSection.classList.remove('hidden');
    
    // スムーズスクロール
    bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// カレンダークラスを拡張
class Calendar {
    constructor() {
        this.date = new Date();
        this.currentMonth = document.getElementById('current-month');
        this.calendarDays = document.getElementById('calendar-days');
        this.selectedDateDisplay = document.getElementById('selected-date-display');
        this.prevMonthBtn = document.getElementById('prev-month');
        this.nextMonthBtn = document.getElementById('next-month');
        this.timeSlots = document.querySelectorAll('.space-y-2 button');
        this.selectedDate = null;
        this.selectedTimeSlot = null;
        this.confirmButton = document.getElementById('confirm-booking');

        // 要素の存在チェック
        if (!this.currentMonth || !this.calendarDays || !this.selectedDateDisplay || 
            !this.prevMonthBtn || !this.nextMonthBtn || !this.confirmButton) {
            console.warn('カレンダーの必要な要素が見つかりません');
            return;
        }
    }

    init() {
        if (!this.currentMonth) return; // 必要な要素がない場合は初期化をスキップ
        this.render();
        this.addEventListeners();
        this.setupTimeSlots();
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

        // 予約確定ボタンのイベントリスナー
        this.confirmButton.addEventListener('click', () => {
            if (!this.selectedDate || !this.selectedTimeSlot) {
                alert('日付と時間を選択してください。');
                return;
            }
            this.confirmBooking();
        });
    }

    setupTimeSlots() {
        this.timeSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                // 以前の選択を解除
                this.timeSlots.forEach(s => {
                    s.classList.remove('border-[#00B4D8]', 'bg-gray-50');
                });
                
                // 新しい時間を選択
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
        
        // 選択された日付を表示
        this.selectedDateDisplay.textContent = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日の時間を表示しています`;
    }

    confirmBooking() {
        const formattedDate = `${this.selectedDate.getFullYear()}年${this.selectedDate.getMonth() + 1}月${this.selectedDate.getDate()}日`;
        const message = `以下の内容で予約を承りました：\n\n日付：${formattedDate}\n時間：${this.selectedTimeSlot}\n\n担当コンシェルジュより改めてご連絡させていただきます。`;
        alert(message);
        
        // 予約後のリセット
        this.selectedDate = null;
        this.selectedTimeSlot = null;
        const previousSelected = this.calendarDays.querySelector('.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        this.timeSlots.forEach(slot => {
            slot.classList.remove('border-[#00B4D8]', 'bg-gray-50');
        });
        this.selectedDateDisplay.textContent = '日付を選択してください';
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
        mainTitle: 'Privé Maldives Travel',
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
        conciergeTitle: 'トラベルコンシェルジュ',
        conciergeSubtitle: '経験豊富なコンシェルジュが、お客様の理想の旅をサポートいたします',
        conciergeA: {
            name: 'Michael Thompson',
            title: 'プライベートジェット＆ヨットスペシャリスト',
            description: 'プライベートジェットやラグジュアリーヨットの手配を含む、完全プライベートな旅をコーディネート。世界中のVIPのお客様の移動と滞在をサポートしてまいりました。'
        },
        conciergeB: {
            name: 'Sarah Williams',
            title: 'ラグジュアリーリゾートスペシャリスト',
            description: '世界中の超高級リゾートやプライベートアイランドでの経験を活かし、美食やアート、文化体験を含む洗練された滞在をご提案いたします。'
        },
        whatsappButton: 'WhatsAppでお問い合わせ',
        conceptTitle: '現地専門家による提案',
        conceptDescription: '20年以上の経験を活かした、他社には真似できない高品質なサービスを提供します。',
        orderMadeTitle: 'オーダーメイドプラン',
        orderMadeDescription: 'お客様のご要望に合わせた、完全カスタマイズの旅行プランをご提案します。',
        bookingTitle: 'ご予約・お問い合わせ',
        name: 'お名前',
        email: 'メールアドレス',
        desiredDate: 'ご希望の旅行時期',
        requests: 'ご要望',
        send: '送信する',
        consultingTime: 'コンサルティング時間',
        timeExtension: '※ご要望に応じて延長も承ります',
        selectTime: 'ご希望の時間帯',
        selectDate: '日付を選択してください',
        otherTime: '※ 上記以外のお時間をご希望の場合は、お申し付けください',
        bookConsulting: 'コンサルティングを予約する',
        scubaDiving: 'スキューバダイビング',
        scubaDesc: '世界最高のダイビングスポット',
        snorkeling: 'シュノーケリング',
        snorkelingDesc: '美しいサンゴ礁と熱帯魚',
        yachtCruise: 'ヨットクルーズ',
        yachtDesc: 'プライベートな海上体験',
        spaTreatment: 'スパトリートメント',
        spaDesc: '最高級のリラクゼーション',
        resortA: 'ラグジュアリーリゾートA',
        resortADesc: '水上ヴィラとプライベートビーチを備えた最高級リゾート',
        resortB: 'プレミアムリゾートB',
        resortBDesc: '世界最高峰のスパとダイニングを提供',
        resortC: 'エクスクルーシブリゾートC',
        resortCDesc: 'プライベートアイランドでの贅沢な滞在',
        viewDetails: '詳細を見る',
        footerDesc: '富裕層向けオーダーメイド旅行提案サービス',
        contactInfo: 'お問い合わせ',
        sns: 'SNS',
        maldivesBeauty: 'モルディブの魅力',
        luxuryStay: 'ラグジュアリーな滞在',
        villaExperience: '水上ヴィラでの贅沢なひととき',
        marineActivity: 'マリンアクティビティ',
        oceanExperience: '美しい海での特別な体験',
        consultThis: 'このコンシェルジュに相談する',
        recommendedResorts: 'おすすめリゾート',
        resort1: 'リゾート1',
        resort2: 'リゾート2',
        resort3: 'リゾート3',
        otherInquiries: 'その他のお問い合わせ',
        inquiryDescription: 'ご質問やご要望がございましたら、下記フォームよりお気軽にお問い合わせください',
        specialties: {
            privateJet: 'プライベートジェット',
            luxuryYacht: 'ラグジュアリーヨット',
            vipService: 'VIPサービス',
            privateIsland: 'プライベートアイランド',
            dining: '美食体験',
            artTour: 'アートツアー'
        }
    },
    en: {
        resorts: 'Resorts',
        activities: 'Activities',
        contact: 'Contact',
        mainTitle: 'Privé Maldives Travel',
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
        conciergeTitle: 'Travel Concierge',
        conciergeSubtitle: 'Our experienced concierges will help you create your ideal journey',
        conciergeA: {
            name: 'Michael Thompson',
            title: 'Private Jet & Yacht Specialist',
            description: 'Coordinating fully private journeys including private jet and luxury yacht arrangements. I have supported VIP clients from around the world with their travel and accommodation needs.'
        },
        conciergeB: {
            name: 'Sarah Williams',
            title: 'Luxury Resort Specialist',
            description: 'Drawing from my experience with ultra-luxury resorts and private islands worldwide, I create sophisticated stays incorporating fine dining, art, and cultural experiences.'
        },
        whatsappButton: 'Contact via WhatsApp',
        conceptTitle: 'Proposal by Local Experts',
        conceptDescription: 'We provide high-quality services that cannot be imitated by others, leveraging over 20 years of experience.',
        orderMadeTitle: 'Custom-Made Plans',
        orderMadeDescription: 'We offer fully customized travel plans tailored to your requirements.',
        bookingTitle: 'Booking & Inquiry',
        name: 'Name',
        email: 'Email',
        desiredDate: 'Desired Travel Date',
        requests: 'Requests',
        send: 'Send',
        consultingTime: 'Consulting Time',
        timeExtension: '* Extension available upon request',
        selectTime: 'Select Time Slot',
        selectDate: 'Please select a date',
        otherTime: '* If you prefer a different time slot, please let us know',
        bookConsulting: 'Book Consultation',
        scubaDiving: 'Scuba Diving',
        scubaDesc: 'World-class diving spots',
        snorkeling: 'Snorkeling',
        snorkelingDesc: 'Beautiful coral reefs and tropical fish',
        yachtCruise: 'Yacht Cruise',
        yachtDesc: 'Private ocean experience',
        spaTreatment: 'Spa Treatment',
        spaDesc: 'Ultimate relaxation',
        resortA: 'Luxury Resort A',
        resortADesc: 'Premium resort featuring water villas and private beaches',
        resortB: 'Premium Resort B',
        resortBDesc: 'World-class spa and dining experience',
        resortC: 'Exclusive Resort C',
        resortCDesc: 'Luxurious stay on a private island',
        viewDetails: 'View Details',
        footerDesc: 'Luxury Custom Travel Service',
        contactInfo: 'Contact Information',
        sns: 'Social Media',
        maldivesBeauty: 'The Beauty of Maldives',
        luxuryStay: 'Luxury Stay',
        villaExperience: 'Luxurious moments in water villa',
        marineActivity: 'Marine Activities',
        oceanExperience: 'Special experiences in beautiful ocean',
        consultThis: 'Consult with this concierge',
        recommendedResorts: 'Recommended Resorts',
        resort1: 'Resort 1',
        resort2: 'Resort 2',
        resort3: 'Resort 3',
        otherInquiries: 'Other Inquiries',
        inquiryDescription: 'If you have any questions or requests, please feel free to contact us using the form below',
        specialties: {
            privateJet: 'Private Jet',
            luxuryYacht: 'Luxury Yacht',
            vipService: 'VIP Service',
            privateIsland: 'Private Island',
            dining: 'Fine Dining',
            artTour: 'Art Tour'
        }
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
    
    // コンシェルジュセクションの翻訳を更新
    const conciergeSection = document.querySelector('section.py-20.bg-white');
    if (conciergeSection) {
        const title = conciergeSection.querySelector('h2');
        const subtitle = conciergeSection.querySelector('p.text-center.text-gray-600');
        if (title) title.textContent = translations[lang].conciergeTitle;
        if (subtitle) subtitle.textContent = translations[lang].conciergeSubtitle;
    }
    
    // コンシェルジュプロフィールの翻訳
    document.querySelectorAll('.bg-white.rounded-xl').forEach(concierge => {
        const img = concierge.querySelector('img');
        const name = concierge.querySelector('h3');
        const title = concierge.querySelector('p.text-gray-600:not(.mb-4)');
        const description = concierge.querySelector('p.text-gray-600.mb-4');
        const tags = concierge.querySelectorAll('.px-2.py-1.bg-gray-100, .px-2.py-1.bg-pink-100, .px-2.py-1.bg-yellow-100');
        const consultButton = concierge.querySelector('button');
        
        if (!img || !name || !title || !description) return;
        
        // 画像のsrc属性が存在するか確認
        const imgSrc = img.getAttribute('src') || '';
        const isConciergeA = imgSrc.includes('img/concierge/ConciergeA.png');
        const isConciergeB = imgSrc.includes('img/concierge/ConciergeB.png');
        
        if (isConciergeA) {
            name.textContent = translations[lang].conciergeA.name;
            title.textContent = translations[lang].conciergeA.title;
            description.textContent = translations[lang].conciergeA.description;
            
            // Update tags for Concierge A
            if (tags.length >= 3) {
                tags[0].textContent = translations[lang].specialties.privateJet;
                tags[1].textContent = translations[lang].specialties.luxuryYacht;
                tags[2].textContent = translations[lang].specialties.vipService;
            }
        } else if (isConciergeB) {
            name.textContent = translations[lang].conciergeB.name;
            title.textContent = translations[lang].conciergeB.title;
            description.textContent = translations[lang].conciergeB.description;
            
            // Update tags for Concierge B
            if (tags.length >= 3) {
                tags[0].textContent = translations[lang].specialties.privateIsland;
                tags[1].textContent = translations[lang].specialties.dining;
                tags[2].textContent = translations[lang].specialties.artTour;
            }
        }

        // Update consultation button
        if (consultButton) {
            consultButton.textContent = translations[lang].consultThis;
        }
    });

    // WhatsAppボタンの更新（もし存在する場合）
    const whatsappButton = document.querySelector('a[href^="https://wa.me"] span');
    if (whatsappButton) {
        whatsappButton.textContent = translations[lang].whatsappButton;
    }

    // コンセプトセクションの翻訳
    const conceptSection = document.querySelector('section.py-12.bg-gray-50');
    if (conceptSection) {
        const titles = conceptSection.querySelectorAll('h3');
        const descriptions = conceptSection.querySelectorAll('p');
        
        titles[0].textContent = translations[lang].conceptTitle;
        descriptions[0].textContent = translations[lang].conceptDescription;
        titles[1].textContent = translations[lang].orderMadeTitle;
        descriptions[1].textContent = translations[lang].orderMadeDescription;
    }
    
    // アクティビティセクションの翻訳
    const activitiesSection = document.querySelector('#activities');
    if (activitiesSection) {
        const activities = activitiesSection.querySelectorAll('.card');
        const translations_map = [
            { title: 'scubaDiving', desc: 'scubaDesc' },
            { title: 'snorkeling', desc: 'snorkelingDesc' },
            { title: 'yachtCruise', desc: 'yachtDesc' },
            { title: 'spaTreatment', desc: 'spaDesc' }
        ];
        
        activities.forEach((activity, index) => {
            if (translations_map[index]) {
                activity.querySelector('h3').textContent = translations[lang][translations_map[index].title];
                activity.querySelector('p').textContent = translations[lang][translations_map[index].desc];
            }
        });
    }
    
    // リゾートセクションの翻訳
    const resortsSection = document.querySelector('#resorts');
    if (resortsSection) {
        // セクションタイトルの翻訳
        const sectionTitle = resortsSection.querySelector('h2');
        if (sectionTitle) {
            sectionTitle.textContent = translations[lang].recommendedResorts;
        }

        // 各リゾートカードの翻訳
        const resortCards = resortsSection.querySelectorAll('.card');
        resortCards.forEach((card, index) => {
            const title = card.querySelector('h3');
            const desc = card.querySelector('p');
            const button = card.querySelector('button');
            
            if (index === 0) {
                if (title) title.textContent = translations[lang].resort1;
                if (desc) desc.textContent = translations[lang].resortADesc;
            } else if (index === 1) {
                if (title) title.textContent = translations[lang].resort2;
                if (desc) desc.textContent = translations[lang].resortBDesc;
            } else if (index === 2) {
                if (title) title.textContent = translations[lang].resort3;
                if (desc) desc.textContent = translations[lang].resortCDesc;
            }
            
            if (button) {
                button.textContent = translations[lang].viewDetails;
            }
        });
    }
    
    // フッターの翻訳
    const footer = document.querySelector('footer');
    if (footer) {
        const sections = footer.querySelectorAll('h3');
        sections[1].textContent = translations[lang].contactInfo;
        sections[2].textContent = translations[lang].sns;
        footer.querySelector('p').textContent = translations[lang].footerDesc;
    }
    
    // 予約モーダルの翻訳
    const reservationModal = document.querySelector('#reservation-modal');
    if (reservationModal) {
        reservationModal.querySelector('h3').textContent = translations[lang].bookingTitle;
        const labels = reservationModal.querySelectorAll('label');
        labels[0].textContent = translations[lang].name;
        labels[1].textContent = translations[lang].email;
        labels[2].textContent = translations[lang].desiredDate;
        labels[3].textContent = translations[lang].requests;
        reservationModal.querySelector('button:last-child').textContent = translations[lang].send;
    }
    
    // 予約セクションの翻訳
    const bookingSection = document.querySelector('#booking-section');
    if (bookingSection) {
        const consultingTimeLabel = bookingSection.querySelector('label.block.text-sm.font-bold.text-gray-700.mb-2');
        if (consultingTimeLabel) consultingTimeLabel.textContent = translations[lang].consultingTime;
        
        const timeExtensionText = bookingSection.querySelector('p.mt-2.text-sm.text-gray-600');
        if (timeExtensionText) timeExtensionText.textContent = translations[lang].timeExtension;
        
        const selectTimeLabel = bookingSection.querySelector('label.block.text-sm.font-bold.text-gray-700.mb-2:nth-child(2)');
        if (selectTimeLabel) selectTimeLabel.textContent = translations[lang].selectTime;
        
        const selectDateText = document.getElementById('selected-date-display');
        if (selectDateText) selectDateText.textContent = translations[lang].selectDate;
        
        const otherTimeText = bookingSection.querySelector('p.mt-4.text-sm.text-gray-600');
        if (otherTimeText) otherTimeText.textContent = translations[lang].otherTime;
        
        const bookButton = document.getElementById('confirm-booking');
        if (bookButton) bookButton.textContent = translations[lang].bookConsulting;

        const bookingTitle = bookingSection.querySelector('h3.text-2xl');
        if (bookingTitle) {
            bookingTitle.textContent = translations[lang].bookingTitle;
        }

        const timeInput = bookingSection.querySelector('input[value="60分"], input[value="60 minutes"]');
        if (timeInput) {
            timeInput.value = lang === 'ja' ? '60分' : '60 minutes';
        }

        const timeSlots = bookingSection.querySelectorAll('.space-y-2 button');
        timeSlots.forEach(slot => {
            const time = slot.textContent.split(' ')[0];
            slot.textContent = `${time} (${lang === 'ja' ? '日本時間' : 'JST'})`;
        });
    }

    // お問い合わせフォームの翻訳
    const contactForm = document.querySelector('#contact .bg-white');
    if (contactForm) {
        const labels = contactForm.querySelectorAll('label');
        labels.forEach((label, index) => {
            if (index === 0) label.textContent = translations[lang].name;
            if (index === 1) label.textContent = translations[lang].email;
            if (index === 2) label.textContent = translations[lang].requests;
        });

        const submitButton = contactForm.querySelector('button');
        if (submitButton) {
            submitButton.textContent = translations[lang].send;
        }
    }

    // ヘッダーのロゴテキスト
    const headerLogo = document.querySelector('header .text-2xl');
    if (headerLogo) {
        headerLogo.textContent = translations[lang].mainTitle;
    }

    // コンシェルジュセクションのタイトル
    const conciergeTitle = document.querySelector('section.py-20.bg-white h2');
    if (conciergeTitle) {
        conciergeTitle.textContent = translations[lang].conciergeTitle;
    }

    // メインビジュアルの画像alt属性を更新
    document.querySelectorAll('.swiper-slide img').forEach(img => {
        if (img.alt === 'モルディブの美しい景色' || img.alt === 'The Beauty of Maldives') {
            img.alt = translations[lang].maldivesBeauty;
        } else if (img.alt === 'ラグジュアリーな水上ヴィラ' || img.alt === 'Luxury Water Villas') {
            img.alt = translations[lang].villaTitle;
        } else if (img.alt === 'マリンアクティビティ' || img.alt === 'Marine Activities') {
            img.alt = translations[lang].activitiesTitle;
        } else if (img.alt === 'サンセットビュー' || img.alt === 'Sunset View') {
            img.alt = translations[lang].momentTitle;
        }
    });

    // 動画ギャラリーセクションの翻訳
    const videoGallery = document.querySelector('section.py-20.bg-white');
    if (videoGallery) {
        const galleryTitle = videoGallery.querySelector('h2');
        if (galleryTitle) {
            galleryTitle.textContent = translations[lang].maldivesBeauty;
        }
        
        const cards = videoGallery.querySelectorAll('.card');
        if (cards.length > 0) {
            const firstCard = cards[0];
            const firstCardTitle = firstCard.querySelector('h3');
            const firstCardDesc = firstCard.querySelector('p');
            if (firstCardTitle) firstCardTitle.textContent = translations[lang].luxuryStay;
            if (firstCardDesc) firstCardDesc.textContent = translations[lang].villaExperience;
            
            if (cards.length > 1) {
                const secondCard = cards[1];
                const secondCardTitle = secondCard.querySelector('h3');
                const secondCardDesc = secondCard.querySelector('p');
                if (secondCardTitle) secondCardTitle.textContent = translations[lang].marineActivity;
                if (secondCardDesc) secondCardDesc.textContent = translations[lang].oceanExperience;
            }
        }
    }

    // その他のお問い合わせセクションの翻訳
    const otherInquiries = document.querySelector('section:last-of-type');
    if (otherInquiries) {
        const title = otherInquiries.querySelector('h2');
        const description = otherInquiries.querySelector('p');
        
        if (title) title.textContent = translations[lang].otherInquiries;
        if (description) description.textContent = translations[lang].inquiryDescription;
    }

    // モルディブの魅力セクションの翻訳
    const maldivesCharm = document.querySelector('section h2.text-3xl');
    if (maldivesCharm) {
        maldivesCharm.textContent = translations[lang].maldivesBeauty;
    }

    // 動画カードの翻訳
    const videoCards = document.querySelectorAll('.card');
    videoCards.forEach(card => {
        const title = card.querySelector('h3');
        const desc = card.querySelector('p');
        
        if (title && title.textContent.includes('ラグジュアリー')) {
            title.textContent = translations[lang].luxuryStay;
            if (desc) desc.textContent = translations[lang].villaExperience;
        } else if (title && title.textContent.includes('マリン')) {
            title.textContent = translations[lang].marineActivity;
            if (desc) desc.textContent = translations[lang].oceanExperience;
        }
    });

    // セクションタイトルの翻訳
    document.querySelectorAll('h2.text-4xl.font-bold.text-center.mb-12.text-gray-800').forEach(title => {
        if (title.textContent === 'アクティビティ') {
            title.textContent = translations[lang].activities;
        } else if (title.textContent === 'モルディブの魅力') {
            title.textContent = translations[lang].maldivesBeauty;
        }
    });

    // コンシェルジュのタグを翻訳
    document.querySelectorAll('.flex.flex-wrap.gap-2.mb-4').forEach(tagContainer => {
        const tags = tagContainer.querySelectorAll('span');
        tags.forEach(tag => {
            switch(tag.textContent) {
                case 'プライベートジェット':
                    tag.textContent = translations[lang].specialties.privateJet;
                    break;
                case 'ラグジュアリーヨット':
                    tag.textContent = translations[lang].specialties.luxuryYacht;
                    break;
                case 'VIPサービス':
                    tag.textContent = translations[lang].specialties.vipService;
                    break;
                case 'プライベートアイランド':
                    tag.textContent = translations[lang].specialties.privateIsland;
                    break;
                case '美食体験':
                    tag.textContent = translations[lang].specialties.dining;
                    break;
                case 'アートツアー':
                    tag.textContent = translations[lang].specialties.artTour;
                    break;
            }
        });
    });

    // 送信ボタンの翻訳
    document.querySelectorAll('button').forEach(button => {
        if (button.textContent.trim() === '送信する') {
            button.textContent = translations[lang].send;
        }
    });
} 