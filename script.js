// Массив для хранения отзывов
let reviews = [];

document.addEventListener('DOMContentLoaded', function() {
  // Анимация при загрузке
  const animateElements = () => {
    const elements = document.querySelectorAll('.animate-on-load');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100 * index);
    });
  };

  // Плавная прокрутка для якорей
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Инициализация анимации
  animateElements();

  // Подсветка активной ссылки в навигации
  const navLinks = document.querySelectorAll('nav a');
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });


  // Инициализация отзывов
  displayReviews();

  // Обработчики для формы отзыва
  document.querySelector('.btn-review').addEventListener('click', function() {
    document.getElementById('reviewForm').classList.remove('hidden');
    document.querySelector('.no-reviews').classList.add('hidden');
  });

  document.querySelector('.btn-cancel').addEventListener('click', function() {
    document.getElementById('reviewForm').classList.add('hidden');
    document.querySelector('.no-reviews').classList.remove('hidden');
  });

  // Обработка звезд рейтинга
  document.querySelector('.rating-stars').addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const width = rect.width;
    const clickX = e.clientX - rect.left;
    const percent = Math.min(Math.max(clickX / width, 0), 1);
    const rating = Math.round(percent * 5);

    document.getElementById('reviewRating').value = rating;
    document.querySelector('.rating-select').style.width = `${rating * 20}%`;
  });

  // Отправка формы
  document.querySelector('#reviewForm form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('reviewName').value.trim();
    const rating = document.getElementById('reviewRating').value;
    const text = document.getElementById('reviewText').value.trim();

    const review = {
      name: name || 'Анонимный пользователь',
      rating: rating,
      text: text,
      date: new Date().toLocaleDateString('ru-RU')
    };

    // Сохраняем отзыв
    saveReview(review);

    // Очищаем форму
    this.reset();
    document.querySelector('.rating-select').style.width = '100%';

    // Показываем список отзывов
    document.getElementById('reviewForm').classList.add('hidden');
    displayReviews();
  });
});
const reviewBtn = document.querySelector('.btn-review');
    const reviewForm = document.getElementById('reviewForm');
    const cancelBtn = document.querySelector('.btn-cancel');
    const reviewFormElement = document.getElementById('reviewFormElement');
    const ratingStars = document.getElementById('ratingStars').querySelectorAll('span');
    const ratingInput = document.getElementById('reviewRating');
    const publishedReviews = document.getElementById('published-reviews');
    
    // Показать/скрыть форму отзыва
    reviewBtn.addEventListener('click', () => {
        reviewForm.classList.remove('hidden');
    });
    
    cancelBtn.addEventListener('click', () => {
        reviewForm.classList.add('hidden');
    });
    
    // Выбор рейтинга
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            const value = star.getAttribute('data-value');
            ratingInput.value = value;
            
            // Обновляем отображение звезд
            ratingStars.forEach((s, i) => {
                if (i < value) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
        });
    });
    
    // Загрузка отзывов при загрузке страницы
    document.addEventListener('DOMContentLoaded', loadReviews);
    
    // Отправка формы
    reviewFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const review = {
            name: document.getElementById('reviewName').value,
            rating: document.getElementById('reviewRating').value,
            text: document.getElementById('reviewText').value,
            date: new Date().toLocaleDateString()
        };
        
        saveReview(review);
        reviewFormElement.reset();
        reviewForm.classList.add('hidden');
        loadReviews();
    });
    
    // Функция сохранения отзыва
    function saveReview(review) {
        let reviews = [];
        
        // Проверяем, есть ли уже сохраненные отзывы
        if (localStorage.getItem('reviews')) {
            reviews = JSON.parse(localStorage.getItem('reviews'));
        }
        
        reviews.push(review);
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }
    
    // Функция загрузки отзывов
    function loadReviews() {
        if (localStorage.getItem('reviews')) {
            const reviews = JSON.parse(localStorage.getItem('reviews'));
            let html = '';
            
            reviews.forEach(review => {
                html += `
                    <div class="review-item">
                        <div class="review-header">
                            <strong>${review.name}</strong>
                            <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                            <span class="review-date">${review.date}</span>
                        </div>
                        <div class="review-text">${review.text}</div>
                    </div>
                `;
            });
            
            publishedReviews.innerHTML = html;
            updateAverageRating(reviews);
        }
    }
    
    // Обновление среднего рейтинга
    function updateAverageRating(reviews) {
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, review) => acc + parseInt(review.rating), 0);
            const avg = (sum / reviews.length).toFixed(1);
            document.getElementById('averageRating').textContent = avg;
        }
    }
// Функция для отображения отзывов
function displayReviews() {
  const reviewsList = document.getElementById('reviewsList');
  reviewsList.innerHTML = '';

  reviews.forEach(review => {
    const reviewElement = document.createElement('div');
    reviewElement.classList.add('review');

    const nameElement = document.createElement('h4');
    nameElement.classList.add('review-name');
    nameElement.textContent = review.name || 'Анонимный пользователь';

    const ratingElement = document.createElement('div');
    ratingElement.classList.add('review-rating');
    for (let i = 0; i < review.rating; i++) {
      ratingElement.innerHTML += '★';
    }

    const textElement = document.createElement('p');
    textElement.classList.add('review-text');
    textElement.textContent = review.text;

    const dateElement = document.createElement('p');
    dateElement.classList.add('review-date');
    dateElement.textContent = review.date;

    reviewElement.appendChild(nameElement);
    reviewElement.appendChild(ratingElement);
    reviewElement.appendChild(textElement);
    reviewElement.appendChild(dateElement);
    reviewsList.appendChild(reviewElement);
  });

  updateAverageRating();
}

// Функция для сохранения отзыва
function saveReview(review) {
  reviews.push(review);
  updateAverageRating();
}

function updateAverageRating() {
  if (reviews.length === 0) {
    document.getElementById('averageRating').textContent = '0';
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  document.getElementById('averageRating').textContent = averageRating.toFixed(1);
}
   // Инициализация Flatpickr
   flatpickr("#selected-date", {
    dateFormat: "Y-m-d", // Формат даты
    locale: "ru", // Локализация на русский
    minDate: "today" // Ограничение на выбор даты не раньше сегодняшней
});


