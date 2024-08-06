<template>
  <div>
    <h1>Editar libros</h1>
    <form @submit.prevent="submitForm" v-if="form">

      
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
        <label for="genero">Genero:</label>
        <select id="generoId" v-model="form.generoId" :class="{ 'is-invalid': errors.genero }" @change="setMascotas()">
          <option :value="genero.id" v-for="(genero, index) in generoList" :key="`generoId-${index}`">{{ genero.nombre }}
          </option>
        </select>
        <div v-if="errors.genero" class="invalid-feedback">{{ errors.genero }}</div>
      </div>
      <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
  </div>
</template>
  
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'LibroqEdit',
  data() {
    return {
      veterinarioList: [],
      generoList: [],
      mascotaList: [],
      
      errors: {}
    };
  },
  props:['item'],
  methods: {
    ...mapActions(['increment']),
    validateForm() {
      this.errors = {};

      if (!this.form.titulo) {
        this.errors.titulo = 'El titulo es obligatorio.';
      }

      if (!this.form.autor) {
        this.errors.autor = 'El autor es obligatorio.';
      }

      if (!this.form.paginas) {
        this.errors.paginas = 'La paginas es obligatorio.';
      }

      if (!this.form.genero) {
        this.errors.genero = 'La genero es obligatorio.';
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
      this.axios.patch(this.baseUrl + "/libros/"+this.item.id, this.form)
        .then(function (response) {
          if (response.status == '200') {
            vm.$emit('on-update', response.data);
          }
          vm.itemList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    getList() {
            const vm = this;
            this.axios.get(this.baseUrl + "/libros?_expand=genero&q=" + this.textToSearch)
                .then(function (response) {
                    vm.itemList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
    
    getLibroList() {
      const vm = this;
      this.axios.get(this.baseUrl + "/libros")
        .then(function (response) {
          vm.veterinarioList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    getGeneroList() {
      const vm = this;
      this.axios.get(this.baseUrl + "/generos")
        .then(function (response) {
          vm.generoList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    setMascotas(){
      const vm = this;
            this.axios.get(this.baseUrl + "/mascotas?generoId=" + this.form.generoId)
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
    },
    form(){
      return Object.assign({},this.item);
    }
  },
  mounted() {
    this.getGeneroList();
    this.getLibroList();
  },
}
</script>
  
<style scoped></style>
  