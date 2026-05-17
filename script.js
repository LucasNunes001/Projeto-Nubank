const slider = document.querySelector('.services-carousel')

const dots = document.querySelectorAll('.dot')

let isDown = false
let startX
let scrollLeft
let velocity = 0
let momentumID

/* ========================= */
/* DRAG START */
/* ========================= */

slider.addEventListener('mousedown', (e) => {

    isDown = true

    slider.classList.add('dragging')

    startX = e.pageX - slider.offsetLeft

    scrollLeft = slider.scrollLeft

    cancelMomentumTracking()
})

/* ========================= */
/* DRAG END */
/* ========================= */

slider.addEventListener('mouseleave', stopDragging)

slider.addEventListener('mouseup', stopDragging)

function stopDragging() {

    if(!isDown) return

    isDown = false

    slider.classList.remove('dragging')

    beginMomentumTracking()
}

/* ========================= */
/* DRAG MOVE */
/* ========================= */

slider.addEventListener('mousemove', (e) => {

    if(!isDown) return

    e.preventDefault()

    const x = e.pageX - slider.offsetLeft

    const walk = (x - startX) * 0.8

    const prevScroll = slider.scrollLeft

    slider.scrollLeft = scrollLeft - walk

    velocity = slider.scrollLeft - prevScroll
})

/* ========================= */
/* MOMENTUM */
/* ========================= */

function beginMomentumTracking() {

    cancelMomentumTracking()

    momentumID = requestAnimationFrame(momentumLoop)
}

function cancelMomentumTracking() {

    cancelAnimationFrame(momentumID)
}

function momentumLoop() {

    slider.scrollLeft += velocity

    velocity *= 0.95

    if(Math.abs(velocity) > 0.5) {

        momentumID = requestAnimationFrame(momentumLoop)
    }
}

/* ========================= */
/* DOTS NAVIGATION */
/* ========================= */

dots.forEach((dot, index) => {

    dot.addEventListener('click', () => {

        const cardWidth =
            document.querySelector('.service-card').offsetWidth + 24

        const scrollAmount = cardWidth * 3 * index

        smoothScrollTo(
            slider,
            scrollAmount,
            1000
        )

        updateDots(index)
    })
})

/* ========================= */
/* UPDATE DOTS */
/* ========================= */

function updateDots(activeIndex) {

    dots.forEach(dot =>
        dot.classList.remove('active')
    )

    dots[activeIndex].classList.add('active')
}

/* ========================= */
/* AUTO UPDATE DOTS */
/* ========================= */

slider.addEventListener('scroll', () => {

    const maxScroll =
        slider.scrollWidth - slider.clientWidth

    const current = slider.scrollLeft

    if(current < maxScroll / 2) {

        updateDots(0)

    } else {

        updateDots(1)
    }
})

/* ========================= */
/* PREMIUM SMOOTH SCROLL */
/* ========================= */

function smoothScrollTo(
    element,
    target,
    duration
) {

    const start = element.scrollLeft

    const change = target - start

    const startTime = performance.now()

    function animateScroll(currentTime) {

        const elapsed =
            currentTime - startTime

        const progress =
            Math.min(elapsed / duration, 1)

        /* PREMIUM EASING */

        const ease =
            1 - Math.pow(1 - progress, 5)

        element.scrollLeft =
            start + change * ease

        if(progress < 1) {

            requestAnimationFrame(
                animateScroll
            )
        }
    }

    requestAnimationFrame(
        animateScroll
    )
}


/* ========================= */
/* SCROLL REVEAL */
/* ========================= */

const reveals = document.querySelectorAll('.reveal')

const observer = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if(entry.isIntersecting) {

                entry.target.classList.add('active')
            }
        })
    },

    {
        threshold: 0.15
    }
)

reveals.forEach((reveal) => {

    observer.observe(reveal)
})