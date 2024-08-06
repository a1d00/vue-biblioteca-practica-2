<template>
  <div>
    <h1>Registrar Libro</h1>
    <form @submit.prevent="submitForm">

      <div class="form-group">
        <label for="name">Titulo:</label>
        <input type="text" id="name" v-model="form.titulo" :class="{ 'is-invalid': errors.titulo }"
          placeholder="Ingrese el nombre" />
        <div v-if="errors.titulo" class="invalid-feedback">{{ errors.titulo }}</div>
      </div>
      <div class="form-group">
        <label for="name">Autor:</label>
        <input type="text" id="name" v-model="form.autor" :class="{ 'is-invalid': errors.autor }"
          placeholder="Ingrese el nombre" />
        <div v-if="errors.autor" class="invalid-feedback">{{ errors.autor }}</div>
      </div>
      <div class="form-group">
        <label for="name">Paginas:</label>
        <input type="text" id="name" v-model="form.paginas" :class="{ 'is-invalid': errors.paginas }"
          placeholder="Ingrese el nombre" />
        <div v-if="errors.paginas" class="invalid-feedback">{{ errors.paginas }}</div>
      </div>
      <div class="form-group">
        <label for="cliente">Genero:</label>
        <select id="cliente" v-model="form.generoId" :class="{ 'is-invalid': errors.generoId }" @change="setMascotas ()">
          <option :value="cliente.id" v-for="(cliente, index) in clienteList" :key="`cliente-${index}`">{{ cliente.nombre }}
          </option>
        </select>
        <div v-if="errors.generoId" class="invalid-feedback">{{ errors.generoId }}</div>
      </div>
      <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
  </div>
</template>
  
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'LibroNew',
  data() {
    return {
      libroList: [],
      clienteList: [],
      mascotaList: [],
      autorList: [
        "Vacunación",
        "Revisión cardiológica",
        "Chequeo general",
        "Chequeo dermatológico"
      ],
      form: {
        libroId: null,
        generoId: null,
        titulo: null,
        autor:null,
        paginas:null
      },
      errors: {}
    };
  },
  methods: {
    ...mapActions(['increment']),
    validateForm() {
      this.errors = {};


      if (!this.form.generoId) {
        this.errors.generoId = 'El Cliente es obligatoria.';
      }
      
      if (!this.form.titulo) {
        this.errors.titulo = 'La mascota es obligatorio.';
      }

      if (!this.form.autor) {
        this.errors.autor = 'El autor es obligatorio.';
      }

      if (!this.form.paginas) {
        this.errors.paginas = 'La paginas es obligatorio.';
      }


      return Object.keys(this.errors).length === 0;
    },

    submitForm() {
      if (this.validateForm()) {
        // Enviar los datos al servidor
        this.save();
        // Reiniciar el formulario
        this.form = {
          generoId: null
        };
      }
    },
    save() {
      const vm = this;
      this.axios.post(this.baseUrl + "/libros", this.form)
        .then(function (response) {
          if (response.status == '201') {
            vm.$emit('on-register', response.data);
          }
          vm.itemList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    getVeterinarioList() {
      const vm = this;
      this.axios.get(this.baseUrl + "/libros")
        .then(function (response) {
          vm.libroList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    getClienteList() {
      const vm = this;
      this.axios.get(this.baseUrl + "/generos")
        .then(function (response) {
          vm.clienteList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    setMascotas(){
      const vm = this;
            this.axios.get(this.baseUrl + "/libros?generoId=" + this.form.generoId)
                .then(function (response) {
                    vm.mascotaList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
    }
  },
  computed: {
    // propiedades computadas que dependen de otras propiedades reactivas
    ...mapState(['count']),
    ...mapGetters(['doubleCount', 'getBaseUrl']),
    baseUrl() {
      return this.getBaseUrl
    }
  },
  mounted() {
    this.getClienteList();
    this.getVeterinarioList();
  },
}
</script>
  
<style scoped></style>
  