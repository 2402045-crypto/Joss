<template>
  <div class="perfil-container">
    <div class="perfil-card">
      
      <div class="perfil-header">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
          <img :src="rutaFotoPrevia" alt="Perfil" class="foto-perfil">
          <input 
            v-if="editando" 
            type="file" 
            accept="image/*" 
            @change="cambiarFoto" 
            style="font-size: 12px; max-width: 200px;" 
          />
        </div>

        <div class="info-principal">
          <h1>{{ usuario.nombre }}</h1>
          <span class="rol">{{ rolNombre }}</span>
        </div>
      </div>

      <div class="datos">
        <div class="dato">
          <label>Nombre</label>
          <p v-if="!editando">{{ usuario.nombre }}</p>
          <input v-else v-model="usuario.nombre" type="text" >
        </div>

        <div class="dato">
          <label>Correo</label>
          <p v-if="!editando">{{ usuario.email }}</p>
          <input v-else v-model="usuario.email" type="email">
        </div>

        <div class="dato">
          <label>Teléfono</label>
          <p v-if="!editando">{{ usuario.telefono || 'No registrado' }}</p>
          <input v-else v-model="usuario.telefono" type="text" placeholder="Ej. 9841234567">
        </div>

        <div class="dato">
          <label>Nueva Contraseña (Opcional)</label>
          <p v-if="!editando">********</p>
          <input v-else v-model="nuevaPassword" type="password" placeholder="Escribe si deseas cambiarla">
        </div>
      </div>

      <button class="editar" @click="toggleEdicion">
        {{ editando ? 'Guardar cambios' : '✏ Editar perfil' }}
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const editando = ref(false);
const nuevaPassword = ref("");
const fotoArchivo = ref(null);

const usuario = ref({
  nombre: "Cargando...",
  email: "",
  telefono: "",
  foto_perfil: null
});

// Avatar gris por defecto
const avatarGris = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
const rutaFotoPrevia = ref(avatarGris);

const rolDelUsuario = localStorage.getItem('usuario_rol');
const rolNombre = computed(() => rolDelUsuario === '2' ? 'Mecánico' : 'Cliente');

const esLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const UPLOADS_URL = esLocal ? 'http://localhost:8080/api/uploads/' : 'https://mecanicweb.free.nf/api/uploads/';

// Cargar los datos al entrar a la vista
onMounted(async () => {
  const idUsuario = localStorage.getItem('usuario_id');
  if (!idUsuario) return;

  const API_URL = esLocal 
    ? `http://localhost:8080/api/obtener_perfil.php?id_usuario=${idUsuario}` 
    : `https://mecanicweb.free.nf/api/obtener_perfil.php?id_usuario=${idUsuario}`;

  try {
    const respuesta = await fetch(API_URL);
    const resultado = await respuesta.json();
    
    if (resultado.status === 'success') {
      usuario.value = resultado.data;
      if (resultado.data.foto_perfil) {
        rutaFotoPrevia.value = UPLOADS_URL + resultado.data.foto_perfil;
      }
    }
  } catch (error) {
    console.error("Error cargando el perfil", error);
  }
});

// Para mostrar la foto nuevecita antes de guardarla
const cambiarFoto = (event) => {
  const file = event.target.files[0];
  if (file) {
    fotoArchivo.value = file;
    rutaFotoPrevia.value = URL.createObjectURL(file); // Previsualización instantánea
  }
};

// Botón de Editar / Guardar
const toggleEdicion = async () => {
  if (!editando.value) {
    // Si no está editando, solo activamos el modo edición
    editando.value = true;
    return;
  }

  // Si YA estaba editando, procedemos a guardar
  const idUsuario = localStorage.getItem('usuario_id');
  const payload = new FormData();
  
  payload.append('id_usuario', idUsuario);
  payload.append('nombre', usuario.value.nombre);
  payload.append('email', usuario.value.email);
  payload.append('telefono', usuario.value.telefono || '');
  payload.append('password', nuevaPassword.value);
  
  if (fotoArchivo.value) {
    payload.append('foto', fotoArchivo.value);
  }

  const API_POST = esLocal 
    ? 'http://localhost:8080/api/actualizar_perfil.php' 
    : 'https://mecanicweb.free.nf/api/actualizar_perfil.php';

  try {
    const respuesta = await fetch(API_POST, {
      method: 'POST',
      body: payload
    });
    
    const resultado = await respuesta.json();
    
    if (resultado.status === 'success') {
      alert("¡Perfil actualizado correctamente!");
      editando.value = false;
      nuevaPassword.value = ""; // Limpiamos el campo de la contraseña
    } else {
      alert("Error al actualizar: " + resultado.message);
    }
  } catch (error) {
    console.error("Hubo un error", error);
    alert("No se pudo conectar con el servidor.");
  }
};
</script>

<style scoped>

.perfil-container{

    display:flex;
    justify-content:center;
    padding:40px 20px;

}

.perfil-card{

    width:100%;
    max-width:800px;
    background:white;
    border-radius:20px;
    padding:35px;
    box-shadow:0 8px 25px rgba(0,0,0,.08);

}

.perfil-header{

    display:flex;
    align-items:center;
    gap:25px;
    margin-bottom:35px;

}

.foto-perfil{

    width:120px;
    height:120px;
    border-radius:50%;
    object-fit:cover;
    border:4px solid #15A5C4;

}

.info-principal h1{

    margin:0;
    color:#102A43;

}

.rol{

    display:inline-block;
    margin-top:8px;
    padding:6px 16px;
    border-radius:30px;
    background:#E7F7FB;
    color:#15A5C4;
    font-weight:bold;

}

.datos{

    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:25px;
    margin-bottom:35px;

}

.dato{

    background:#F8FAFC;
    padding:18px;
    border-radius:12px;

}

.dato label{

    display:block;
    color:#64748B;
    font-size:.9rem;
    margin-bottom:6px;

}

.dato p{

    margin:0;
    color:#102A43;
    font-weight:600;

}
.dato input{

    width:100%;
    padding:10px 12px;
    border:1px solid #D0D7DE;
    border-radius:8px;
    font-size:15px;
    color:#102A43;
    background:white;
    outline:none;
    transition:.3s;

}

.dato input:focus{

    border-color:#15A5C4;
    box-shadow:0 0 0 3px rgba(21,165,196,.15);

}

.editar{

    width:100%;
    border:none;
    background:#15A5C4;
    color:white;
    padding:15px;
    border-radius:12px;
    font-size:16px;
    font-weight:bold;
    cursor:pointer;
    transition:.3s;

}

.editar:hover{

    background:#0092B8;

}

@media(max-width:768px){

.datos{

    grid-template-columns:1fr;

}

.perfil-header{

    flex-direction:column;
    text-align:center;

}

}

</style>