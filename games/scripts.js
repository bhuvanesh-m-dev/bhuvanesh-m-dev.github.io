// Smooth hover/tap effect for mobile
const cards = document.querySelectorAll('.game-card');
cards.forEach(card => {
  card.addEventListener('touchstart', () => {
    card.classList.add('active');
  });
  card.addEventListener('touchend', () => {
    card.classList.remove('active');
  });
});
// Optionally, add more interactive effects here
