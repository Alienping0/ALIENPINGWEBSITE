document.addEventListener("DOMContentLoaded", () => {
  // Single, improved notification function
  function showNotification(message, type = "info", duration = 5000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute("role", "alert");
    notification.setAttribute("aria-live", "assertive");

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3"};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: 'Inter', sans-serif;
      font-weight: 500;
      max-width: 300px;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      opacity: 0;
    `;

    document.body.appendChild(notification);

    // Trigger reflow to enable animation
    void notification.offsetWidth;

    // Animate in
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";

    // Remove after duration
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, duration);
  }

  // Mobile Navigation Toggle
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      navToggle.setAttribute("aria-expanded", navMenu.classList.contains("active"));

      // Animate hamburger menu
      const spans = navToggle.querySelectorAll("span");
      if (spans.length >= 3) {
        if (navMenu.classList.contains("active")) {
          spans[0].style.transform = "rotate(45deg) translate(5px, 6px)";
          spans[1].style.opacity = "0";
          spans[2].style.transform = "rotate(-45deg) translate(5px, -6px)";
        } else {
          spans.forEach((span) => {
            span.style.transform = "none";
            span.style.opacity = "1";
          });
        }
      }
    });
  }

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        const spans = navToggle.querySelectorAll("span");
        spans.forEach((span) => {
          span.style.transform = "none";
          span.style.opacity = "1";
        });
      }
    });
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Tokenomics Chart - Using Chart.js from CDN
  const ctx = document.getElementById("tokenomicsChart");
  if (ctx && typeof Chart !== 'undefined') {
    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Mods", "Marketing", "Community Rewards", "Dev wallet"],
        datasets: [
          {
            data: [2, 2, 2, 14],
            backgroundColor: [
              "#FFD700", // Gold
              "#FF5722", // Orange
              "#4CAF50", // Green
              "#9C27B0", // Purple
              //"#E0E0E0",  Light Gray for "COMING SOON"
            ],
            borderWidth: 0,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        cutout: "70%",
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}%`,
            },
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleFont: {
              family: "Orbitron",
            },
            bodyFont: {
              family: "Inter",
            },
            padding: 12,
            cornerRadius: 8,
          },
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 2000,
          easing: "easeOutQuart",
        },
      },
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all FAQ items
      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("active");
        faqItem.setAttribute("aria-expanded", "false");
      });

      // If the clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add("active");
        item.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Newsletter Form
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      const submitButton = this.querySelector('button[type="submit"]');

      // Basic email validation
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification("Please enter a valid email address.", "error");
        emailInput.focus();
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Subscribing...";

      try {
        // Using FormSubmit.co service
        const response = await fetch("https://formsubmit.co/ajax/emmanuelabara265@gmail.com", {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            _subject: "New Newsletter Subscription",
            _template: "table" // Makes the email look nicer
          })
        });

        const result = await response.json();
        
        if (response.ok) {
          showNotification("Thank you for subscribing!", "success");
          emailInput.value = "";
        } else {
          throw new Error(result.message || "Subscription failed");
        }
      } catch (error) {
        console.error("Error:", error);
        showNotification(error.message || "Subscription failed. Please try again.", "error");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Subscribe";
      }
    });
  }

  // Animate roadmap progress bars on scroll
  const roadmapItems = document.querySelectorAll(".roadmap-item");
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressFill = entry.target.querySelector(".progress-fill");
        if (progressFill) {
          progressFill.style.width = progressFill.dataset.width || progressFill.style.width;
        }
        entry.target.classList.add("animate");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  roadmapItems.forEach((item) => {
    const progressFill = item.querySelector(".progress-fill");
    if (progressFill) {
      const width = progressFill.style.width;
      progressFill.style.width = "0%";
      progressFill.dataset.width = width;
    }
    item.classList.add("fade-in");
    observer.observe(item);
  });

  // Animate elements on scroll
  const animatedElements = document.querySelectorAll(".feature-card, .social-card, .token-info-card, .faq-item");
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  animatedElements.forEach((el) => {
    el.classList.add("fade-in");
    fadeObserver.observe(el);
  });

  // Add animation styles
  const style = document.createElement("style");
  style.textContent = `
    .fade-in {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in-visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .roadmap-item {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .roadmap-item.animate {
      opacity: 1;
      transform: translateY(0);
    }
    
    .roadmap-item:nth-child(2) {
      transition-delay: 0.2s;
    }
    
    .roadmap-item:nth-child(3) {
      transition-delay: 0.4s;
    }
    
    .roadmap-item:nth-child(4) {
      transition-delay: 0.6s;
    }
    
    .feature-card:nth-child(2), .token-info-card:nth-child(2), .social-card:nth-child(2) {
      transition-delay: 0.1s;
    }
    
    .feature-card:nth-child(3), .token-info-card:nth-child(3), .social-card:nth-child(3) {
      transition-delay: 0.2s;
    }
    
    .feature-card:nth-child(4), .token-info-card:nth-child(4), .social-card:nth-child(4) {
      transition-delay: 0.3s;
    }
    
    .feature-card:nth-child(5), .token-info-card:nth-child(5), .social-card:nth-child(5) {
      transition-delay: 0.4s;
    }
    
    .feature-card:nth-child(6), .token-info-card:nth-child(6), .social-card:nth-child(6) {
      transition-delay: 0.5s;
    }
  `;
  document.head.appendChild(style);

  // Parallax effect for hero elements
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll(".main-logo, .hero-title");

    parallaxElements.forEach((element) => {
      const speed = 0.3;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // Header scroll effect
  let lastScrollTop = 0;
  const header = document.querySelector(".header");

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      header.style.background = "rgba(0, 0, 0, 0.95)";
      header.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.5)";
    } else {
      header.style.background = "rgba(0, 0, 0, 0.8)";
      header.style.boxShadow = "none";
    }

    if (scrollTop > lastScrollTop && scrollTop > 300) {
      // Scrolling down
      header.style.transform = "translateY(-100%)";
    } else {
      // Scrolling up
      header.style.transform = "translateY(0)";
    }

    lastScrollTop = scrollTop;
  });
});
