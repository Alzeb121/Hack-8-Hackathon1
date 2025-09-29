/**
 * Patanjali Ayurved - Advanced JavaScript Functionality
 * Modern e-commerce website with advanced features
 */

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoadingScreen();
    initHeader();
    initHeroSlider();
    initSearch();
    initCart();
    initProducts();
    initFilters();
    initNewsletter();
    initTestimonials();
    initScrollAnimations();
    initBackToTop();
    initMobileMenu();
    initDealTimer();
    initProductLoading();
    initThemeToggle();

    // Initialize GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initAdvancedAnimations();
    }
});

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.loading-progress');
    
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 800);
        }
        progressBar.style.width = progress + '%';
    }, 200);
}

// Header Functionality
function initHeader() {
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            console.log('Language changed to:', this.value);
            // Implement language switching logic here
        });
    }
}

// Hero Slider
function initHeroSlider() {
    const heroSlider = new Swiper('.hero-slider', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        speed: 800,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            slideChange: function() {
                const activeSlide = this.slides[this.activeIndex];
                const content = activeSlide.querySelector('.hero-content');

                // Reset animation
                content.classList.remove('animate__animated', 'animate__fadeInUp');

                // Trigger animation
                setTimeout(() => {
                    content.classList.add('animate__animated', 'animate__fadeInUp');
                }, 100);
            }
        }
    });

    // Navigation Swiper
    const navSwiper = new Swiper('.nav-swiper', {
        loop: true,
        allowTouchMove: false,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        speed: 600,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        pagination: {
            el: '.nav-pagination',
            clickable: true,
        },
        on: {
            slideChange: function() {
                // Optional: Add any slide change animations or effects
            }
        }
    });
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.getElementById('search-suggestions');
    let searchTimeout;
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    showSearchSuggestions(query);
                }, 300);
            } else {
                hideSearchSuggestions();
            }
        });
        
        searchInput.addEventListener('focus', function() {
            if (this.value.trim().length > 2) {
                showSearchSuggestions(this.value.trim());
            }
        });
        
        searchInput.addEventListener('blur', function() {
            setTimeout(hideSearchSuggestions, 200);
        });
    }
    
    function showSearchSuggestions(query) {
        // Simulate search suggestions
        const suggestions = [
            'Amla Juice',
            'Chyawanprash',
            'Neem Soap',
            'Aloe Vera Gel',
            'Ashwagandha',
            'Tulsi Tablets'
        ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
        
        if (suggestions.length > 0) {
            searchSuggestions.innerHTML = `
                <div class="suggestion-header">
                    <h4>Search Suggestions</h4>
                </div>
                <ul class="suggestion-list">
                    ${suggestions.map(item => `
                        <li><a href="#" class="suggestion-item">${item}</a></li>
                    `).join('')}
                </ul>
            `;
            searchSuggestions.classList.add('show');
        } else {
            hideSearchSuggestions();
        }
    }
    
    function hideSearchSuggestions() {
        searchSuggestions.classList.remove('show');
    }
}

// Cart Functionality
function initCart() {
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const cartDropdown = document.getElementById('cart-dropdown');
    const cartItems = document.getElementById('cart-items');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    updateCartDisplay();
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.hasAttribute('data-product')) {
            e.preventDefault();
            const productCard = e.target.closest('.product-card') || e.target.closest('.deal-card');
            const product = {
                id: productCard.dataset.productId || e.target.dataset.product || Date.now(),
                name: productCard.querySelector('h3, h4').textContent,
                price: e.target.dataset.price || productCard.querySelector('.current-price').textContent,
                image: productCard.querySelector('img').src,
                quantity: 1
            };

            addToCart(product);

            // Add animation
            e.target.classList.add('added');
            e.target.textContent = 'Added!';
            setTimeout(() => {
                e.target.classList.remove('added');
                e.target.textContent = 'Add to Cart';
            }, 1500);
        }
    });
    
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        
        // Show cart dropdown
        cartDropdown.classList.add('show');
        setTimeout(() => cartDropdown.classList.remove('show'), 3000);
    }
    
    function updateCartDisplay() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('₹', ''));
            return sum + (price * item.quantity);
        }, 0);
        
        cartCount.textContent = totalItems;
        cartTotal.textContent = `₹${totalPrice}`;
        
        if (cartItems) {
            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <h5>${item.name}</h5>
                            <p>${item.price} x ${item.quantity}</p>
                        </div>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('');
            }
        }
    }
}

// Product Data and Loading
function initProducts() {
    const products = [
        {
            id: 1,
            name: "Amla Juice",
            category: "health",
            price: "₹150",
            originalPrice: "₹200",
            image: "https://via.placeholder.com/250x200/4CAF50/ffffff?text=Amla+Juice",
            badge: "Best Seller",
            description: "Pure amla juice for immunity and health"
        },
        {
            id: 2,
            name: "Aloe Vera Gel",
            category: "personal",
            price: "₹120",
            originalPrice: "₹150",
            image: "https://via.placeholder.com/250x200/FF9800/ffffff?text=Aloe+Vera+Gel",
            badge: "New",
            description: "Natural aloe vera gel for skin care"
        },
        {
            id: 3,
            name: "Chyawanprash",
            category: "health",
            price: "₹250",
            originalPrice: "₹300",
            image: "https://via.placeholder.com/250x200/9C27B0/ffffff?text=Chyawanprash",
            badge: null,
            description: "Traditional immunity booster"
        },
        {
            id: 4,
            name: "Neem Tablets",
            category: "health",
            price: "₹180",
            originalPrice: "₹220",
            image: "https://via.placeholder.com/250x200/F44336/ffffff?text=Neem+Tablets",
            badge: null,
            description: "Pure neem tablets for blood purification"
        },
        {
            id: 5,
            name: "Herbal Shampoo",
            category: "personal",
            price: "₹95",
            originalPrice: "₹120",
            image: "https://via.placeholder.com/250x200/2196F3/ffffff?text=Herbal+Shampoo",
            badge: "Popular",
            description: "Natural herbal shampoo for healthy hair"
        },
        {
            id: 6,
            name: "Organic Honey",
            category: "food",
            price: "₹200",
            originalPrice: "₹250",
            image: "https://via.placeholder.com/250x200/FFC107/ffffff?text=Organic+Honey",
            badge: "Organic",
            description: "Pure organic honey for health benefits"
        }
    ];
    
    window.productData = products;
    loadProducts(products);
}

function loadProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-category="${product.category}" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <div class="product-overlay">
                    <button class="quick-view" data-product-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="add-wishlist" data-product-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="current-price">${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">${product.originalPrice}</span>` : ''}
                </div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Product Filters
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('load-more-products');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            const filteredProducts = filter === 'all' 
                ? window.productData 
                : window.productData.filter(product => product.category === filter);
            
            loadProducts(filteredProducts);
            
            // Add animation
            const productsGrid = document.getElementById('products-grid');
            productsGrid.style.opacity = '0';
            setTimeout(() => {
                productsGrid.style.opacity = '1';
            }, 100);
        });
    });
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.textContent = 'Loading...';
            this.disabled = true;
            
            // Simulate loading more products
            setTimeout(() => {
                this.textContent = 'Load More Products';
                this.disabled = false;
                
                // Add more products (in real app, this would be an API call)
                const moreProducts = [
                    {
                        id: 7,
                        name: "Tulsi Drops",
                        category: "health",
                        price: "₹85",
                        originalPrice: "₹110",
                        image: "https://via.placeholder.com/250x200/795548/ffffff?text=Tulsi+Drops",
                        badge: "New",
                        description: "Natural tulsi drops for immunity"
                    },
                    {
                        id: 8,
                        name: "Face Wash",
                        category: "personal",
                        price: "₹65",
                        originalPrice: "₹80",
                        image: "https://via.placeholder.com/250x200/607D8B/ffffff?text=Face+Wash",
                        badge: null,
                        description: "Herbal face wash for glowing skin"
                    }
                ];
                
                const currentProducts = Array.from(document.querySelectorAll('.product-card')).map(card => ({
                    id: card.dataset.productId,
                    name: card.querySelector('h3').textContent,
                    category: card.dataset.category,
                    price: card.querySelector('.current-price').textContent,
                    originalPrice: card.querySelector('.original-price')?.textContent,
                    image: card.querySelector('img').src,
                    badge: card.querySelector('.product-badge')?.textContent,
                    description: card.querySelector('p').textContent
                }));
                
                loadProducts([...currentProducts, ...moreProducts]);
            }, 1500);
        });
    }
}

// Newsletter
function initNewsletter() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('newsletter-email').value;
        const consent = document.getElementById('newsletter-consent').checked;
        
        if (!consent) {
            alert('Please agree to receive promotional emails');
            return;
        }
        
        // Simulate newsletter subscription
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for subscribing! Check your email for confirmation.');
            this.reset();
            submitBtn.textContent = 'Subscribe';
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Testimonials Slider
function initTestimonials() {
    const testimonialsSlider = new Swiper('.testimonials-slider', {
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        speed: 600,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });
}

// Scroll Animations
function initScrollAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.product-card, .category-card, .deal-card, .testimonial-slide').forEach(el => {
        observer.observe(el);
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            if (mainNav.classList.contains('active')) {
                mobileOverlay.style.display = 'block';
                setTimeout(() => mobileOverlay.style.opacity = '1', 10);
            } else {
                mobileOverlay.style.opacity = '0';
                setTimeout(() => mobileOverlay.style.display = 'none', 300);
            }
        });
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('menu-open');
            this.style.opacity = '0';
            setTimeout(() => this.style.display = 'none', 300);
        });
    }
}

// Deal Timer
function initDealTimer() {
    const dealTimer = document.getElementById('deal-timer');
    if (!dealTimer) return;
    
    // Set timer to end of day
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    function updateTimer() {
        const now = new Date();
        const timeLeft = endOfDay - now;
        
        if (timeLeft <= 0) {
            dealTimer.textContent = 'Deal ended';
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        dealTimer.textContent = `Ends in: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Advanced Product Loading
function initProductLoading() {
    // Lazy loading for product images
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });
    
    document.querySelectorAll('.product-card img, .category-card img').forEach(img => {
        imageObserver.observe(img);
    });
}

function initDealProgressAnimation() {
    // Animate progress bars in deals section on load
    gsap.from('.deals-section .progress', {
        width: 0,
        duration: 1.5,
        ease: 'power2.out',
        stagger: 0.2,
        delay: 0.5
    });
}

// Advanced Animations with GSAP
function initAdvancedAnimations() {
    // Hero text animation
    gsap.from('.hero-title', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.5
    });
    
    gsap.from('.hero-subtitle', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.7
    });
    
    gsap.from('.hero-actions', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.9
    });
    
    // Parallax effect for hero background
    gsap.to('.hero-bg img', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // Category cards animation
    gsap.from('.category-card', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.categories-grid',
            start: 'top 95%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Product cards animation
    gsap.from('.product-card', {
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#products-grid',
            start: 'top 95%',
            toggleActions: 'play none none reverse'
        }
    });

    // Initialize deal progress animation
    initDealProgressAnimation();
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Quick View Modal (Enhanced)
function initQuickView() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quick-view')) {
            e.preventDefault();
            const productId = e.target.closest('.quick-view').dataset.productId;
            showQuickView(productId);
        }
    });
}

function showQuickView(productId) {
    const product = window.productData.find(p => p.id == productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-modal">&times;</button>
            <div class="quick-view-body">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="quick-view-info">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <div class="quick-view-price">
                        <span class="current-price">${product.price}</span>
                        ${product.originalPrice ? `<span class="original-price">${product.originalPrice}</span>` : ''}
                    </div>
                    <div class="quick-view-actions">
                        <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                            Add to Cart
                        </button>
                        <button class="btn btn-outline add-wishlist" data-product-id="${product.id}">
                            <i class="fas fa-heart"></i> Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// Initialize quick view
initQuickView();

// Wishlist Functionality
function initWishlist() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-wishlist')) {
            e.preventDefault();
            const productId = e.target.closest('.add-wishlist').dataset.productId;
            toggleWishlist(productId);
        }
    });
    
    function toggleWishlist(productId) {
        const product = window.productData.find(p => p.id == productId);
        if (!product) return;
        
        const existingIndex = wishlist.findIndex(item => item.id == productId);
        
        if (existingIndex > -1) {
            wishlist.splice(existingIndex, 1);
            showNotification('Product removed from wishlist');
        } else {
            wishlist.push(product);
            showNotification('Product added to wishlist');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistDisplay();
    }
    
    function updateWishlistDisplay() {
        const wishlistCount = document.querySelector('.action-item .badge');
        if (wishlistCount) {
            wishlistCount.textContent = wishlist.length;
        }
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    updateWishlistDisplay();
}

    // Debounced resize handler
initWishlist();

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function applyTheme(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
    } else {
        document.body.classList.remove('dark-theme');
        themeIcon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    }
}

// Performance Optimization
function initPerformance() {
    // Debounced resize handler
    const debouncedResize = debounce(function() {
        // Recalculate layouts if needed
        if (typeof Swiper !== 'undefined') {
            document.querySelectorAll('.swiper').forEach(swiper => {
                if (swiper.swiper) {
                    swiper.swiper.update();
                }
            });
        }
    }, 250);

    window.addEventListener('resize', debouncedResize);

    // Throttled scroll handler for performance
    const throttledScroll = throttle(function() {
        // Handle scroll events efficiently
        const scrollTop = window.pageYOffset;

        // Update header state
        if (scrollTop > 100) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    }, 16); // ~60fps

    window.addEventListener('scroll', throttledScroll);
}

// Initialize performance optimizations
initPerformance();

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}