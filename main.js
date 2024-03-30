
(function() {
    "use strict";

    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }

    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
        let selectEl = select(el, all)
        if (selectEl) {
            if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener))
            } else {
                selectEl.addEventListener(type, listener)
            }
        }
    }

    /**
     * Easy on scroll event listener
     */
    const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
    }

    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
        let position = window.scrollY + 200
        navbarlinks.forEach(navbarlink => {
            if (!navbarlink.hash) return
            let section = select(navbarlink.hash)
            if (!section) return
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                navbarlink.classList.add('active')
            } else {
                navbarlink.classList.remove('active')
            }
        })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)

    /**
     * Scrolls to an element with header offset
     */
    const scrollto = (el) => {
        let header = select('#header')
        let offset = header.offsetHeight

        let elementPos = select(el).offsetTop
        window.scrollTo({
            top: elementPos - offset,
            behavior: 'smooth'
        })
    }

    /**
     * Toggle .header-scrolled class to #header when page is scrolled
     */
    let selectHeader = select('#header')
    if (selectHeader) {
        const headerScrolled = () => {
            if (window.scrollY > 100) {
                selectHeader.classList.add('header-scrolled')
            } else {
                selectHeader.classList.remove('header-scrolled')
            }
        }
        window.addEventListener('load', headerScrolled)
        onscroll(document, headerScrolled)
    }

    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.classList.add('active')
            } else {
                backtotop.classList.remove('active')
            }
        }
        window.addEventListener('load', toggleBacktotop)
        onscroll(document, toggleBacktotop)
    }

    /**
     * Mobile nav toggle
     */
    on('click', '.mobile-nav-toggle', function(e) {
        select('#navbar').classList.toggle('navbar-mobile')
        this.classList.toggle('bi-list')
        this.classList.toggle('bi-x')
    })

    /**
     * Mobile nav dropdowns activate
     */
    on('click', '.navbar .dropdown > a', function(e) {
        if (select('#navbar').classList.contains('navbar-mobile')) {
            e.preventDefault()
            this.nextElementSibling.classList.toggle('dropdown-active')
        }
    }, true)

    /**
     * Scrool with ofset on links with a class name .scrollto
     */
    on('click', '.scrollto', function(e) {
        if (select(this.hash)) {
            e.preventDefault()

            let navbar = select('#navbar')
            if (navbar.classList.contains('navbar-mobile')) {
                navbar.classList.remove('navbar-mobile')
                let navbarToggle = select('.mobile-nav-toggle')
                navbarToggle.classList.toggle('bi-list')
                navbarToggle.classList.toggle('bi-x')
            }
            scrollto(this.hash)
        }
    }, true)

    /**
     * Scroll with ofset on page load with hash links in the url
     */
    window.addEventListener('load', () => {
        if (window.location.hash) {
            if (select(window.location.hash)) {
                scrollto(window.location.hash)
            }
        }
    });

    /**
     * Preloader
     */
    let preloader = select('#preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.remove()
        });
    }

    /**
     * Initiate  glightbox
     */
    const glightbox = GLightbox({
        selector: '.glightbox'
    });

    /**
     * Skills animation
     */
    let skillsContent = select('.skills-content');
    if (skillsContent) {
        new Waypoint({
            element: skillsContent,
            offset: '80%',
            handler: function(direction) {
                let progress = select('.progress .progress-bar', true);
                progress.forEach((el) => {
                    let value = parseFloat(el.getAttribute('aria-valuenow'));
                    let max = parseFloat(el.getAttribute('aria-valuemax'));
                    let percentage = (value / max) * 100;
                    el.style.width = percentage + '%';
                });
            }

        })
    }

    /**
     * Porfolio isotope and filter
     */
    window.addEventListener('load', () => {
        let portfolioContainer = select('.portfolio-container');
        if (portfolioContainer) {
            let portfolioIsotope = new Isotope(portfolioContainer, {
                itemSelector: '.portfolio-item'
            });

            let portfolioFilters = select('#portfolio-flters li', true);

            on('click', '#portfolio-flters li', function(e) {
                e.preventDefault();
                portfolioFilters.forEach(function(el) {
                    el.classList.remove('filter-active');
                });
                this.classList.add('filter-active');

                portfolioIsotope.arrange({
                    filter: this.getAttribute('data-filter')
                });
                portfolioIsotope.on('arrangeComplete', function() {
                    AOS.refresh()
                });
            }, true);
        }

    });

    /**
     * Initiate portfolio lightbox
     */
    const portfolioLightbox = GLightbox({
        selector: '.portfolio-lightbox'
    });

    /**
     * Portfolio details slider
     */
    new Swiper('.portfolio-details-slider', {
        speed: 400,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        }
    });

    /**
     * Animation on scroll
     */
    window.addEventListener('load', () => {
        AOS.init({
            duration: 1000,
            easing: "ease-in-out",
            once: true,
            mirror: false
        });
    });

})()

/*--------------------------------------------------------------
# About Us Page
--------------------------------------------------------------*/
// Function to check if an element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to add animation class when element is in viewport
function addAnimationClass() {
    const valueBoxes = document.querySelectorAll('.value-box');
    valueBoxes.forEach((box, index) => {
        if (isInViewport(box)) {
            box.classList.add('animate-fade-up');
        }
    });
}

// Event listener for scroll event
document.addEventListener('scroll', addAnimationClass);

// Initial check when page loads
addAnimationClass();

//CODE FOR ANIMATION ON CARDS


/*
  ANIMATED GRAPH
 */

document.addEventListener("DOMContentLoaded", function() {
    // Sample data for the first part
    const initialData = [
        { year: 1997 , capacity: 4 },
        { year: 1998 , capacity: 5 },
        { year: 1999 , capacity: 7 },
        { year: 2000 , capacity: 8 },
        { year: 2001 , capacity: 9 },
        { year: 2002 , capacity: 10 },
        { year: 2003 , capacity: 11 },
        { year: 2004, capacity: 13 },
        { year: 2005, capacity: 14 },
        { year: 2006, capacity: 17 },
        { year: 2007, capacity: 22 },
        { year: 2008, capacity: 30 },
        { year: 2009, capacity: 35 },
        { year: 2010, capacity: 50 },
        { year: 2011, capacity: 85 },
        { year: 2012, capacity: 110 },
        { year: 2013, capacity: 150 },
        { year: 2014, capacity: 195 },
        { year: 2015, capacity: 220 },
        { year: 2016, capacity: 280 },
        { year: 2017, capacity: 330 },
        { year: 2018, capacity: 390 },
        { year: 2019, capacity: 415 },
        { year: 2020, capacity: 445 },
        { year: 2021, capacity: 455 },
        { year: 2022, capacity: 480 }
    ];

    // Chart container
    const chart = document.querySelector('.chart');
    const xAxis = document.querySelector('.x-axis');
    const yAxis = document.querySelector('.y-axis');

    // Loop through initial data to create bars and x-axis labels
    initialData.forEach(entry => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = '0'; // Set initial height to 0
        bar.dataset.height = entry.capacity;
        chart.appendChild(bar);

        const label = document.createElement('span');
        label.textContent = entry.year;
        xAxis.appendChild(label);

        // Add some spacing between x-axis labels
        label.style.marginRight = '4px'; // Adjust as needed
    });

    // Animate the initial graph after adding data
    animateGraph();

    // Calculate the maximum value on the y-axis
    const maxYValue = Math.max(...initialData.map(entry => entry.capacity));

    // Add labels to the y-axis
    const yLabels = [0, 100, 200, 300, 400, 500];
    yLabels.forEach(value => {
        const yLabel = document.createElement('span');
        yLabel.textContent = value;
        yLabel.classList.add('y-axis-value');
        yAxis.appendChild(yLabel);

        // Calculate the relative position of the label based on its value
        const relativePosition = (maxYValue - value) / maxYValue * 100;
        yLabel.style.bottom = `${relativePosition}%`;
    });

    // Add label for the y-axis
    const yLabelDescription = document.createElement('span');
    yLabelDescription.textContent = 'Number of Projects';
    yLabelDescription.classList.add('y-axis-title');
    yAxis.appendChild(yLabelDescription);
});


function animateGraph() {
    const bars = document.querySelectorAll('.bar');
    const trendLine = document.querySelector('.trend-line');
    let delay = 0;

    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.height = bar.dataset.height + 'px';
            bar.style.transition = `height 1s ease-in-out ${index * 0.001}s`;
            bar.style.height = bar.dataset.height + 'px';

        }, delay);
        delay += 100; // Adjust animation speed if needed

    });

    setTimeout(() => {
        trendLine.style.opacity = '1';
    }, bars.length * 100); // Adjust delay to start trend line animation
}

// JavaScript
document.addEventListener("DOMContentLoaded", function() {
    animateGraph();
});


// JavaScript for handling the carousel functionality

document.addEventListener("DOMContentLoaded", function() {
    const carousel = document.querySelector('.mission-section .carousel');
    const slides = Array.from(document.querySelectorAll('.mission-section .slide'));
    const totalSlides = slides.length;
    const slideWidth = slides[0].offsetWidth;
    let currentIndex = 0;
    let interval;

    function updateSlideSize() {
        const currentSlide = slides[currentIndex];
        carousel.style.height = `${currentSlide.offsetHeight}px`;
    }

    // function updateSlideWidth() {
    //     const slideWidth = slides[0].offsetWidth;
    //     carousel.style.width = `${slideWidth * slides.length}px`;
    //     goToSlide(currentIndex);
    // }

    function goToSlide(index) {
        const slideWidth = slides[0].offsetWidth;
        carousel.style.transform = `translateX(-${index * slideWidth}px)`;
        currentIndex = index;
        updateDots();
    }

    // Update slide size when the window is resized
    window.addEventListener('resize', function() {
        updateSlideSize();
    });



    function updateDots() {
        const dots = document.querySelectorAll('.mission-section .carousel-dots .dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function goToNextSlide() {
        if (currentIndex === totalSlides - 1) {
            goToSlide(0);
        } else {
            goToSlide(currentIndex + 1);
        }
    }

    function goToPrevSlide() {
        if (currentIndex === 0) {
            goToSlide(totalSlides - 1);
        } else {
            goToSlide(currentIndex - 1);
        }
    }

    function startCarousel() {
        interval = setInterval(goToNextSlide, 3000); // Change slide every 5 seconds
    }

    function stopCarousel() {
        clearInterval(interval);
    }

    // Add event listeners for arrow clicks
    const prevButton = document.querySelector('.mission-section .prev');
    const nextButton = document.querySelector('.mission-section .next');
    prevButton.addEventListener('click', function() {
        goToPrevSlide();
        stopCarousel();
    });

    nextButton.addEventListener('click', function() {
        goToNextSlide();
        stopCarousel();
    });

    // Add event listeners for dots
    const dots = document.querySelectorAll('.mission-section .carousel-dots .dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToSlide(index);
            stopCarousel();
        });
    });

    // Start carousel automatically
    startCarousel();

});
function updateDots() {
    const dots = document.querySelectorAll('.mission-section .carousel-dots .dot');
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}


//Solutions page code

document.addEventListener("DOMContentLoaded", function() {
    const toggleButtons = document.querySelectorAll(".toggle-description");

    toggleButtons.forEach(button => {
        button.addEventListener("click", function() {
            const solutionBox = this.closest('.solution-box'); // Find the closest .solution-box container
            const image = solutionBox.querySelector('.solution-image'); // Query the image element within the solution box
            const description = solutionBox.querySelector('.description'); // Query the description element within the solution box

            // Toggle between displaying the image and the description
            if (image.style.display !== "none") {
                image.style.display = "none";
                description.style.display = "block";
                this.textContent = "× More"; // Change button text to "×" when description is shown
            } else {
                image.style.display = "block";
                description.style.display = "none";
                this.textContent = "+ More"; // Change button text to "+" when image is shown
            }
        });
    });
});

