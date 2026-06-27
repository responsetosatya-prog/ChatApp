/* ===================================================
   ChatSphere - animation.js
   UI Animations
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    revealOnScroll();

    floatingAnimation();

    animateFeatureCards();

    heroParallax();

});

/* ===========================================
   Scroll Reveal
=========================================== */

function revealOnScroll(){

    const elements = document.querySelectorAll(
        ".feature-card, .step, .cta, .hero-left, .hero-right"
    );

    const observer = new IntersectionObserver((entries)=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);

            }

        });

    },{

        threshold:0.15

    });

    elements.forEach(element=>{

        element.style.opacity = "0";
        element.style.transform = "translateY(60px)";
        element.style.transition = "all .8s ease";

        observer.observe(element);

    });

}

/* ===========================================
   Floating Chat Messages
=========================================== */

function floatingAnimation(){

    const messages = document.querySelectorAll(".message");

    messages.forEach((message,index)=>{

        message.animate(

            [
                { transform:"translateY(0px)" },
                { transform:"translateY(-8px)" },
                { transform:"translateY(0px)" }
            ],

            {
                duration:2500 + (index * 300),
                iterations:Infinity,
                easing:"ease-in-out"
            }

        );

    });

}

/* ===========================================
   Feature Card Hover
=========================================== */

function animateFeatureCards(){

    const cards = document.querySelectorAll(".feature-card");

    cards.forEach(card=>{

        card.addEventListener("mousemove",(e)=>{

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.background =
                `radial-gradient(circle at ${x}px ${y}px,
                rgba(109,93,252,.28),
                rgba(255,255,255,.08))`;

        });

        card.addEventListener("mouseleave",()=>{

            card.style.background =
                "rgba(255,255,255,.08)";

        });

    });

}

/* ===========================================
   Hero Parallax
=========================================== */

function heroParallax(){

    const phone = document.querySelector(".phone-mockup");

    if(!phone) return;

    window.addEventListener("mousemove",(e)=>{

        const x = (window.innerWidth / 2 - e.clientX) / 40;
        const y = (window.innerHeight / 2 - e.clientY) / 40;

        phone.style.transform =
            `rotateY(${x}deg) rotateX(${-y}deg)`;

    });

}

/* ===========================================
   Animated Background Particles
=========================================== */

(function(){

    const count = 35;

    for(let i=0;i<count;i++){

        const particle = document.createElement("div");

        particle.className = "particle";

        particle.style.position = "fixed";
        particle.style.width = Math.random()*6 + 3 + "px";
        particle.style.height = particle.style.width;
        particle.style.borderRadius = "50%";
        particle.style.pointerEvents = "none";
        particle.style.background = "rgba(255,255,255,.25)";
        particle.style.left = Math.random()*100 + "%";
        particle.style.top = Math.random()*100 + "%";
        particle.style.zIndex = "-1";

        particle.animate(

            [
                { transform:"translateY(0px)", opacity:.25 },
                { transform:"translateY(-120px)", opacity:.6 },
                { transform:"translateY(-240px)", opacity:0 }
            ],

            {
                duration:8000 + Math.random()*5000,
                iterations:Infinity,
                delay:Math.random()*3000
            }

        );

        document.body.appendChild(particle);

    }

})();

/* ===========================================
   Hero Fade In
=========================================== */

window.addEventListener("load",()=>{

    document.body.animate(

        [
            { opacity:0 },
            { opacity:1 }
        ],

        {
            duration:900,
            fill:"forwards"
        }

    );

});

/* ===========================================
   Console
=========================================== */

console.log("%c✨ Animations Loaded",
"color:#8A7DFF;font-size:16px;font-weight:bold;");
