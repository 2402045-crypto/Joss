<template>
  <div class="profile-container">
    <!-- INFO GENERAL DEL TALLER -->
    <header class="workshop-header">
      <div class="header-content">
        <div class="main-info">
          <div class="workshop-logo">
            <img src="https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&q=80&w=200" alt="Taller" />
          </div>
          <div class="text-details">
            <h1>Taller el chingón</h1>
            <p class="location">📍 AV. constituyentes, Playa del Carmen Q. Roo</p>
            <p class="specialty">Especialistas en cambiarte la suspensión</p>
            
            <div class="actions-row">
              <button class="action-btn"><span class="icon">📞</span> Contactar</button>
              <button class="action-btn"><span class="icon">🔖</span> Guardar</button>
            </div>
          </div>
        </div>

        <!-- Calificación del taller -->
        <div class="rating-box">
          <div class="stars-title">
            <span class="star-big">★</span>
            <div>
              <h3>4.3 estrellas</h3>
              <p>(64 reseñas)</p>
            </div>
          </div>
          <div class="stars-row">★★★★★</div>
          <p class="rating-label">Excelente servicio</p>
        </div>
      </div>
    </header>

    <!-- NAVEGACIÓN POR PESTAÑAS -->
    <nav class="tabs-navbar">
      <button 
        v-for="tab in tabs" 
        :key="tab" 
        :class="['tab-item', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </nav>

    <!-- CONTENIDO DE LAS PESTAÑAS -->
    <div class="tab-content-panel">
      <!-- Sección de Reseñas -->
      <div v-if="activeTab === 'Reseñas'" class="reviews-wrapper">
        
        <div class="reviews-layout">
          
          <!-- Lista de reseñas dinámicas con Likes interactivos -->
          <div class="reviews-list">
            <h2>Reseñas de otros talleres</h2>
            
            <article v-for="(review, index) in reviewsList" :key="index" class="review-card">
              <div class="user-avatar" :class="review.avatarClass">{{ review.initial }}</div>
              <div class="review-body">
                <div class="review-header">
                  <h3>{{ review.name }}</h3>
                  <span class="review-date">{{ review.date }}</span>
                </div>
                <p class="user-meta">{{ review.meta }}</p>
                <div class="stars-indicator">{{ review.stars }}</div>
                <p class="review-text">{{ review.text }}</p>
                
                <!-- BOTONES INTERACTIVOS -->
                <div class="likes-row">
                  <button 
                    @click="handleVote(index, 'like')" 
                    :class="['like-btn', { 'voted-like': review.userVote === 'like' }]"
                  >
                    👍 {{ review.likes }}
                  </button>
                  <button 
                    @click="handleVote(index, 'dislike')" 
                    :class="['like-btn', { 'voted-dislike': review.userVote === 'dislike' }]"
                  >
                    👎 {{ review.dislikes }}
                  </button>
                </div>
              </div>
            </article>
          </div>

          <!-- Formulario para dejar tu reseña -->
          <aside class="leave-review-panel">
            <div class="form-card">
              <h2>Deja tu reseña</h2>
              <div class="rating-input">
                <p>Deja tu calificación</p>
                
                <!-- ESTRELLAS INTERACTIVAS -->
                <div class="interactive-stars">
                  <span 
                    v-for="star in 5" 
                    :key="star" 
                    class="star-clickable"
                    :class="{ filled: star <= userRating }"
                    @click="userRating = star"
                  >
                    ★
                  </span>
                </div>
              </div>
              <div class="textarea-group">
                <label>Escribe tu experiencia</label>
                <textarea placeholder="Cuéntanos sobre tu experiencia....."></textarea>
              </div>
              <button class="submit-review-btn">Publicar reseña</button>
            </div>

            <div class="info-badge">
              <span class="badge-icon">🛡️</span>
              <p>Tu opinión ayuda a otros usuarios a encontrar los mejores talleres de confianza</p>
            </div>
          </aside>

        </div>
      </div>

      <!-- Placeholders para el resto de las pestañas -->
      <div v-else class="placeholder-tab-text">
        Contenido de la sección de {{ activeTab }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tabs = ['Información', 'Servicios', 'Reseñas']
const activeTab = ref('Reseñas') 
const userRating = ref(0)

// Array reactivo para mantener el diseño original pero permitir interactividad
const reviewsList = ref([
  {
    initial: 'J',
    avatarClass: '',
    name: 'Juan Pérez',
    date: 'Hace 2 semanas',
    meta: '3 reseñas',
    stars: '★★★★★',
    text: 'Muy buen servicio. Me arreglaron los frenos en menos de dos horas y el precio fue justo. Los recomiendo totalmente.',
    likes: 12,
    dislikes: 1,
    userVote: null // Puede ser 'like', 'dislike' o null
  },
  {
    initial: 'M',
    avatarClass: 'user-m',
    name: 'María Gómez',
    date: 'Hace 1 mes',
    meta: '1 reseña',
    stars: '★★★★☆',
    text: 'Muy atentos. Solo tardaron un poco más de lo esperado, pero el trabajo quedó excelente.',
    likes: 8,
    dislikes: 0,
    userVote: null
  }
])

// Lógica inteligente para manejar los votos (si ya dio like y da dislike, se cambia automáticamente)
const handleVote = (index, type) => {
  const review = reviewsList.value[index]
  
  if (review.userVote === type) {
    // Si hace click en lo mismo que ya votó, quita el voto
    if (type === 'like') review.likes--
    else review.dislikes--
    review.userVote = null
  } else {
    // Si tenía un voto contrario, lo remueve primero
    if (review.userVote === 'like') review.likes--
    if (review.userVote === 'dislike') review.dislikes--
    
    // Aplica el nuevo voto
    if (type === 'like') review.likes++
    else review.dislikes++
    review.userVote = type
  }
}
</script>

<style scoped>
.profile-container {
  width: 100%;
  max-width: 1250px;
  margin: 0 auto;
  font-family: system-ui, -apple-system, sans-serif;
  background: #f4f6f8;
  padding-bottom: 50px;
}

/* --- INFORMACIÓN GENERAL DEL TALLER --- */
.workshop-header {
  background: #0099b8; 
  color: white;
  padding: 30px;
  border-radius: 0 0 16px 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.main-info {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.workshop-logo {
  width: 150px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.workshop-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-details h1 {
  margin: 0 0 8px 0;
  font-size: 2rem;
}

.location, .specialty {
  margin: 4px 0;
  font-size: 0.95rem;
  opacity: 0.9;
}

.actions-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.action-btn {
  background: white;
  color: #333;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

/* Cuadro de Estrellas */
.rating-box {
  text-align: right;
  min-width: 200px;
}

.stars-title {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.star-big {
  font-size: 2.5rem;
  color: #ff9800;
}

.rating-box h3 {
  margin: 0;
  font-size: 1.4rem;
}

.rating-box p {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.8;
}

.stars-row {
  color: #ff9800;
  font-size: 1.6rem;
  margin: 8px 0 4px;
}

.rating-label {
  font-size: 0.9rem;
  font-weight: 500;
}

/* --- BARRA DE PESTAÑAS (TABS) --- */
.tabs-navbar {
  display: flex;
  justify-content: center;
  background: white;
  border-bottom: 1px solid #dfe4ea;
  padding: 0 20px;
}

.tab-item {
  background: none;
  border: none;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tab-item:hover {
  color: #0099b8;
}

.tab-item.active {
  color: #0d47a1;
  font-weight: 700;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #0099b8;
}

/* --- MAQUETACIÓN DE LAS RESEÑAS --- */
.reviews-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  padding: 0 20px;
  margin-top: 30px; 
}

.reviews-list h2 {
  color: #475569;
  font-size: 1.3rem;
  margin-bottom: 16px;
}

.review-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  gap: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: #2563eb;
  color: white;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-m { background: #10b981; }

.review-body { flex: 1; }

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-header h3 { margin: 0; font-size: 1.1rem; color: #1e293b; }
.review-date { font-size: 0.85rem; color: #94a3b8; }
.user-meta { margin: 2px 0; font-size: 0.85rem; color: #64748b; }
.stars-indicator { color: #ff9800; margin: 6px 0; }
.review-text { color: #334155; line-height: 1.5; margin: 8px 0; }

.likes-row {
  display: flex;
  gap: 12px;
}

.like-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  color: #64748b;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.like-btn:hover {
  background: #e2e8f0;
}

/* Estilos de feedback visual cuando presionas un botón */
.voted-like {
  background: #e0f2fe;
  color: #0284c7;
  border-color: #bae6fd;
  font-weight: bold;
}

.voted-dislike {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
  font-weight: bold;
}

/* FORMULARIO DE DEJAR RESEÑA */
.form-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.form-card h2 { font-size: 1.3rem; margin: 0 0 16px; color: #1e293b; }
.rating-input p { margin: 0 0 4px; font-size: 0.9rem; color: #64748b; }

.interactive-stars {
  font-size: 1.6rem;
  margin-bottom: 16px;
  display: flex;
  gap: 4px;
}

.star-clickable {
  color: #cbd5e1;
  cursor: pointer;
  transition: color 0.15s ease, transform 0.1s ease;
  user-select: none;
}

.star-clickable:hover {
  transform: scale(1.15);
}

.star-clickable.filled {
  color: #ff9800; 
}

.textarea-group {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.textarea-group label { font-size: 0.9rem; color: #64748b; font-weight: 500; }

.textarea-group textarea {
  width: 100%;
  height: 110px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 6px;
  background: #f8fafc;
  resize: none;     
}

.submit-review-btn {
  width: 100%;
  background: #0099b8;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.info-badge {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
}

.badge-icon { font-size: 1.5rem; }
.info-badge p { margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.4; }

.placeholder-tab-text {
  text-align: center;
  padding: 60px;
  color: #64748b;
  font-size: 1.2rem;
}

/* --- ADAPTACIÓN PARA CELULARES Y TABLETS --- */
@media (max-width: 768px) {
  .reviews-layout {
    grid-template-columns: 1fr; /* Pone el formulario de reseñas debajo de la lista */
    padding: 0;
  }
  .main-info, .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  .rating-box {
    text-align: left;
    margin-top: 16px;
  }
  .stars-title {
    justify-content: flex-start;
  }
  .tabs-navbar {
    flex-wrap: wrap; /* Si agregas más pestañas, se acomodan solas */
    padding: 0 10px;
  }
  .tab-item {
    padding: 12px 14px;
    font-size: 0.9rem;
  }
}
</style>