// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Optional: Animate elements when they come into view
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('.slide-in').forEach(el => observer.observe(el));
