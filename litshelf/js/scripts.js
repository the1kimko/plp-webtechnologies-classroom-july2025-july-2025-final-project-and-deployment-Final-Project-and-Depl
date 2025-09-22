// Navigation: Toggle mobile menu
document.querySelector('.menu-toggle').addEventListener('click', () => {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
  // Accessibility: Update ARIA attribute
  const isExpanded = navLinks.classList.contains('active');
  document.querySelector('.menu-toggle').setAttribute('aria-expanded', isExpanded);
});

// Sticky Header Effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  header.classList.toggle('sticky', window.scrollY > 0);
});

// Smooth Scrolling for In-Page Anchor Links
document.querySelectorAll('.nav-links a, .footer a').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    // Only apply smooth scrolling to in-page anchors (starting with #)
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = targetId ? document.querySelector(`#${targetId}`) : document.body;
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // For cross-page links (e.g., books.html), allow default navigation
  });
});

// Books Page: Book Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const bookCards = document.querySelectorAll('.book-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('data-category');
    // Update active button styling
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    bookCards.forEach(card => {
      if (category === 'all' || card.getAttribute('data-category') === category) {
        card.style.display = 'block';
        card.classList.add('fade-in');
      } else {
        card.style.display = 'none';
        card.classList.remove('fade-in');
      }
    });
  });
});

// Books Page: Dynamic Search
function initBookSearch() {
  const booksSection = document.querySelector('.books');
  if (!booksSection) return;

  // Add search input
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  searchContainer.innerHTML = `
    <input type="text" id="book-search" placeholder="Search books..." aria-label="Search books">
  `;
  booksSection.insertBefore(searchContainer, booksSection.querySelector('.filters'));

  const searchInput = document.getElementById('book-search');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    bookCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const author = card.querySelector('p').textContent.toLowerCase();
      if (title.includes(query) || author.includes(query)) {
        card.style.display = 'block';
        card.classList.add('fade-in');
      } else {
        card.style.display = 'none';
        card.classList.remove('fade-in');
      }
    });
  });
}

// Contact Page: Form Validation and Local Storage
function validateForm() {
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  const formMessage = document.getElementById('form-message');

  if (!name || !email || !message) return; // Ensure elements exist

  if (!name.value || !email.value || !message.value) {
    formMessage.textContent = 'Please fill out all fields.';
    formMessage.style.color = 'red';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    formMessage.textContent = 'Please enter a valid email.';
    formMessage.style.color = 'red';
    return;
  }

  // Save form data to localStorage
  const formData = {
    name: name.value,
    email: email.value,
    message: message.value,
    timestamp: new Date().toISOString()
  };
  const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
  submissions.push(formData);
  localStorage.setItem('formSubmissions', JSON.stringify(submissions));

  formMessage.textContent = 'Message sent successfully!';
  formMessage.style.color = 'green';
  name.value = '';
  email.value = '';
  message.value = '';

  // Auto-clear success message after 3 seconds
  setTimeout(() => {
    formMessage.textContent = '';
  }, 3000);
}

// Gallery Page: Lightbox Effect
function initGalleryLightbox() {
  const gallerySection = document.querySelector('.gallery');
  if (!gallerySection) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close">&times;</span>
      <img src="" alt="Gallery image">
      <p></p>
    </div>
  `;
  document.body.appendChild(lightbox);

  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('p');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      lightboxImg.src = item.querySelector('img').src;
      lightboxCaption.textContent = item.querySelector('p').textContent;
      lightbox.classList.add('active');
    });
  });

  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });
}

// Scroll Animation for Book Cards and Gallery Items
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.book-card, .gallery-item').forEach(item => {
  observer.observe(item);
});

// Add Animation Styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .book-card, .gallery-item {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .book-card.animate, .gallery-item.animate {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-in {
    animation: fadeIn 0.3s ease-in;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .lightbox {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    justify-content: center;
    align-items: center;
    z-index: 2000;
  }
  .lightbox.active {
    display: flex;
  }
  .lightbox-content {
    position: relative;
    max-width: 80%;
    max-height: 80%;
    text-align: center;
  }
  .lightbox-content img {
    max-width: 100%;
    max-height: 60vh;
    border-radius: 10px;
  }
  .lightbox-content p {
    color: white;
    margin-top: 1rem;
    font-weight: 500;
  }
  .lightbox-close {
    position: absolute;
    top: -20px;
    right: -20px;
    font-size: 2rem;
    color: white;
    cursor: pointer;
    transition: color 0.3s;
  }
  .lightbox-close:hover {
    color: #ffd700;
  }
`;
document.head.appendChild(styleSheet);

// Initialize Page-Specific Features
document.addEventListener('DOMContentLoaded', () => {
  initBookSearch();
  initGalleryLightbox();
});