export const scrollToContactForm = () => {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};
