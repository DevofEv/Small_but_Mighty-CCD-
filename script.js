// Wait for DOM and Chart.js to load
document.addEventListener('DOMContentLoaded', function() {
    // Chart.js Fallback and Registration
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded, showing static content');
        const chartElements = document.querySelectorAll('canvas[id$="Chart"]');
        chartElements.forEach(canvas => {
            const fallback = document.createElement('div');
            fallback.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 400px; background: #f1f5f9; border-radius: 16px; color: #64748b; font-size: 1rem;';
            fallback.textContent = 'Interactive chart loading...';
            if (canvas.parentNode) {
                canvas.parentNode.replaceChild(fallback, canvas);
            }
        });
    } else {
        try {
            Chart.register(ChartDataLabels);
            Chart.defaults.font.family = 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';
            Chart.defaults.color = '#1e293b';
        } catch (error) {
            console.warn('ChartDataLabels plugin not available');
        }

        // Trust Crisis Chart
        const trustChartElement = document.getElementById('trustChart');
        if (trustChartElement) {
            const trustCtx = trustChartElement.getContext('2d');
            new Chart(trustCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Trust Government', 'Don\'t Trust Government'],
                    datasets: [{
                        data: [18, 82],
                        backgroundColor: ['#0ea5e9', '#e2e8f0'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { padding: 20, font: { size: 14, weight: '600' } }
                        },
                        datalabels: {
                            color: 'white',
                            font: { weight: 'bold', size: 18 },
                            formatter: (value) => value + '%'
                        }
                    }
                }
            });
        }

        // Evanston Projects Chart
        const evanstonChartElement = document.getElementById('evanstonChart');
        if (evanstonChartElement) {
            const evanstonCtx = evanstonChartElement.getContext('2d');
            new Chart(evanstonCtx, {
                type: 'bar',
                data: {
                    labels: ['Housing', 'Education', 'Refugee Support', 'Urban Farm', 'Youth Center', 'Small Business', 'Mental Health'],
                    datasets: [{
                        data: [810000, 700000, 645000, 350000, 210000, 150000, 50000],
                        backgroundColor: '#0ea5e9',
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: {
                        legend: { display: false },
                        datalabels: {
                            anchor: 'end',
                            align: 'right',
                            color: '#0f172a',
                            font: { weight: 'bold', size: 12 },
                            formatter: (value) => '$' + (value / 1000) + 'k'
                        }
                    },
                    scales: {
                        x: {
                            ticks: { callback: function(value) { return '$' + (value / 1000) + 'k'; } },
                            grid: { display: false }
                        },
                        y: { grid: { display: false } }
                    }
                }
            });
        }

        // Cambridge Trend Chart
        const cambridgeChartElement = document.getElementById('cambridgeChart');
        if (cambridgeChartElement) {
            const cambridgeCtx = cambridgeChartElement.getContext('2d');
            new Chart(cambridgeCtx, {
                type: 'line',
                data: {
                    labels: ['PB8 (2022)', 'PB9 (2023)', 'PB10 (2024)', 'PB11 (2025)'],
                    datasets: [{
                        label: 'Voter Participation',
                        data: [7500, 8768, 10522, 10110],
                        borderColor: '#0ea5e9',
                        backgroundColor: 'rgba(14, 165, 233, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#0ea5e9',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 3,
                        pointRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        datalabels: {
                            anchor: 'top',
                            align: 'top',
                            color: '#0f172a',
                            font: { weight: 'bold', size: 12 },
                            formatter: (value) => value.toLocaleString()
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { callback: function(value) { return value.toLocaleString(); } },
                            grid: { color: 'rgba(0,0,0,0.1)' }
                        },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    } // End of Chart.js related logic

    // Counter Animation Enhancement (with suffix)
    function animateCounter(element, target, duration = 2000, suffix = '') {
        const start = 0;
        const increment = target / (duration / 16); // Aim for ~60 FPS
        let current = start;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                if (target.toString().includes('.')) {
                    element.textContent = target.toFixed(1) + suffix;
                } else {
                    element.textContent = target.toLocaleString() + suffix;
                }
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString() + suffix;
            }
        }, 16);
    }

    // Progress Bar
    const progressBar = document.querySelector('.progress-bar');
    function updateProgressBar() {
        if (!progressBar) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        ) - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }

    // Floating Navigation
    const floatingNav = document.querySelector('.floating-nav');
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('section[id]');
    function updateFloatingNav() {
        if (!floatingNav) return;
        if (window.pageYOffset > 300) {
            floatingNav.classList.add('visible');
        } else {
            floatingNav.classList.remove('visible');
        }

        let currentSectionIndex = -1;
        const scrollPos = window.pageYOffset + window.innerHeight / 2; // More centered detection

        sections.forEach((section, index) => {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                currentSectionIndex = index;
            }
        });
        
        navDots.forEach((dot, index) => {
            if (index === currentSectionIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Testimonial Slider
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialDots = document.querySelectorAll('.nav-dot-testimonial');

    function showTestimonial(index) {
        if (!testimonials.length || !testimonialDots.length) return;
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (testimonialDots[i]) testimonialDots[i].classList.remove('active');
        });
        
        if (testimonials[index] && testimonialDots[index]) {
            testimonials[index].classList.add('active');
            testimonialDots[index].classList.add('active');
        }
        currentTestimonial = index;
    }

    function nextTestimonial() {
        if (!testimonials.length) return;
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    if (testimonials.length > 0) {
        setInterval(nextTestimonial, 5000); // Auto-advance testimonials
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => showTestimonial(index));
        });
        showTestimonial(0); // Initialize first testimonial
    }

    // Enhanced Intersection Observer (for counters and scroll animations)
    const enhancedObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Adjust rootMargin if needed
    };

    const enhancedObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated'); // For general .animate-on-scroll

                // Animate counters with suffixes
                if (entry.target.hasAttribute('data-counter')) {
                    const target = parseFloat(entry.target.dataset.counter);
                    const suffix = entry.target.dataset.suffix || '';
                    animateCounter(entry.target, target, 2000, suffix);
                    observer.unobserve(entry.target); // Optional: unobserve after animation
                }
                
                // Stagger animations for grouped elements
                if (entry.target.classList.contains('stagger-animation')) {
                    const siblings = entry.target.parentNode.querySelectorAll('.stagger-animation');
                    siblings.forEach((sibling, index) => {
                        setTimeout(() => {
                            sibling.style.transitionDelay = (index * 0.1) + 's';
                            sibling.classList.add('animated');
                        }, index * 100);
                    });
                    // observer.unobserve(entry.target); // Might be too broad if parent is observed
                }
                
                // For .scroll-reveal-* classes (if not handled by checkReveal)
                if (entry.target.classList.contains('scroll-reveal') ||
                    entry.target.classList.contains('scroll-reveal-left') ||
                    entry.target.classList.contains('scroll-reveal-right')) {
                    entry.target.classList.add('revealed');
                    // observer.unobserve(entry.target); // Optional
                }
            }
        });
    }, enhancedObserverOptions);

    document.querySelectorAll('.animate-on-scroll, [data-counter], .scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .stagger-animation').forEach(el => {
        enhancedObserver.observe(el);
    });

    // Tab functionality
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            const targetContent = document.getElementById(tabName);

            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            button.classList.add('active');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
            
    // Smooth scrolling for anchor links (including floating nav)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Scroll Event Listeners
    window.addEventListener('scroll', () => {
        updateProgressBar();
        updateFloatingNav();
        // checkReveal() removed as IntersectionObserver handles this
    });
    
    // Initial calls for functions that depend on scroll position or visibility
    updateProgressBar();
    updateFloatingNav();
    // checkReveal() removed
    
    // Initialize animations on load (for elements already in view)
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        // IntersectionObserver (enhancedObserver) will automatically trigger for elements in view on load.
        // No need to disconnect/re-observe or call checkReveal.
    });
        
}); // End DOMContentLoaded
