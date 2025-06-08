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
