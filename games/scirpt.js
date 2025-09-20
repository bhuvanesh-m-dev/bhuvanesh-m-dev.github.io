// Redirect user to game URL when card is clicked
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    const url = card.getAttribute('data-url');
    if (url) {
      window.open(url, "_blank"); // opens in new tab
    }
  });
});
