<template>
  <div class="perfil-container">

    <div class="perfil-card">

      <div class="perfil-header">

        <img
          src="https://i.pravatar.cc/150?img=12"
          alt="Perfil"
          class="foto-perfil"
        >

        <div class="info-principal">

          <h1>Hana Gonzalez</h1>
          <span class="rol">Cliente</span>

        </div>

      </div>

      <div class="datos">

        <div class="dato">
            <label>Nombre</label>
            <p v-if="!editando">{{usuario.nombre}}</p>

            <input v-else v-model="usuario.nombre" type="text" >
        </div>

        <div class="dato">
          <label>Correo</label>
          <p v-if="!editando">{{ usuario.email }}</p>

          <input v-else v-model="usuario.email" type="email">
        </div>

        <div class="dato">
          <label>Teléfono</label>
          <p v-if="!editando">{{ usuario.telefono }}</p>
          <input v-else v-model="usuario.telefono" type="text">
        </div>

        <div class="dato">
          <label>Fecha de nacimiento</label>
          <p v-if="!editando">{{usuario.fechaNacimiento}}</p>
          <input v-else v-model="usuario.fechaNacimiento" type="date">
        </div>


      </div>

      <button class="editar" @click="editando = !editando">
        {{editando ? 'Guardar cambios' :  '✏ Editar perfil' }}
    
      </button>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";

const editando = ref(false);

const usuario = ref({
    nombre: "Hana Gonzalez",
    email: "vina_mora@gmail.com",
    telefono: "5512345678",
    fechaNacimiento: "1995-05-15",
    
});

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