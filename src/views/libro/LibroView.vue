<template>
    <div>
        <Modal v-model:modelValue="showModalNuevo">
            <LibroNewView @on-register="onRegister()" />
        </Modal>
        <Modal v-model:modelValue="showModalEdit">
            <LibroEditView @on-update="onUpdate()" :item="itemToEdit" />
        </Modal>
        <h1>Lista de Libro</h1>
        {{ this.item }}
        <button @click="showModalNuevo = true" class="btn btn-primary">Nuevo</button>
        <button @click="buscar()" class="btn btn-lith" style="float:right">Buscar</button>
        <input type="search" style="float:right" v-model="textToSearch" @search="buscar()">
        <div style="margin: 20px 0;">
            <h3>Filtros:</h3>
            <form @submit.prevent="filtrar()">


                <label for="veterinario"> Genero: </label>
                <select id="veterinario" v-model="filter.generoId">
                    <option value="">Todos</option>
                    <option :value="veterinario.id" v-for="(veterinario, index) in veterinarioList" :key="`veterinario-${index}`">{{ veterinario.nombre }}
                    </option>
                  </select>
                <button type="submit" class="btn btn-lith">Fitrar</button>
            </form>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Titulo</th>
                    <th>Autor</th>
                    <th>Paginas</th>
                    <th>Categoria</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in itemList" :key="index">
                    <td>{{ 1 + index }}</td>
                    <td>{{ item.titulo }}</td>
                    <td>{{ item.autor}}</td>
                    <td>{{ item.paginas }}</td>
                    <td>{{ item.genero.nombre }}</td>
                    <td>
                        <button @click="edit(item)" class="btn btn-dark" style="margin-right: 15px;">Editar</button>
                        <button @click="Eliminar(item.id)" class="btn btn-danger">Eliminar</button>
                    </td>
                </tr>
            </tbody>
            
        </table>
    </div>
</template>
  
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Modal from '../../components/Modal.vue'
import LibroNewView from './LibroNewView.vue'
import LibroEditView from './LibroEditView.vue'


export default {
    name: 'Cita',
    data() {
        return {
            currentPage: 1,
            totalPages: 100, // Este valor debe ser calculado según tus datos
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            textToSearch: '',
            textToFilter: '',
            itemList: [],
            veterinarioList: [],
            path: '',
            filter: {
                generoId:''
            }
        }
    },
    components: {
        // Registro de componentes que se utilizaran.
        Modal,
        LibroNewView,
        LibroEditView
    },
    methods: {
        // métodos que se pueden llamar desde la plantilla o desde otras partes del componente.
        ...mapActions(['increment']),
        getList() {
            const vm = this;
            this.path = this.baseUrl + "/libros?_order=desc,asc&_expand=genero" + this.textToFilter + "&q=" + this.textToSearch;
            this.axios.get(this.baseUrl + "/libros?_order=desc,asc&_expand=genero" + this.textToFilter + "&q=" + this.textToSearch)
                .then(function (response) {
                    vm.itemList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        getVeterinarioList() {
            const vm = this;
            this.axios.get(this.baseUrl + "/generos")
                .then(function (response) {
                    vm.veterinarioList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        edit(item) {
            this.itemToEdit = Object.assign({}, item);
            this.showModalEdit = true;
        },
        Eliminar(id) {
            console.log(id);
            if (confirm("¿Esta Seguro de eliminar el registro?")) {
                const vm = this;
                this.axios.delete(this.baseUrl + "/libros/" + id)
                    .then(function (response) {
                        vm.getList();
                        vm.$toast.show("Registro eliminado.", "danger");
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            }

        },
        buscar() {
            this.getList();
        },
        filtrar() {
            this.textToFilter = '';
            
            if (this.filter.generoId != null && this.filter.generoId != '') {
                this.textToFilter += "&generoId=" + this.filter.generoId;
            }
            this.getList();
        },
        onRegister(event) {
            this.getList();
            this.showModalNuevo = false;
            this.$toast.show('Registro exitoso', 'success');
        },
        onUpdate(event) {
            this.getList();
            this.showModalEdit = false;
            this.itemToEdit = null;
            this.$toast.show('Edicion exitosa', 'info');
        },
        showToast(message, type) {
            this.$toast.show(message, type);
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
    props: {
        // propiedades que el componente puede recibir.
    },
    mounted() {
        this.getList();
        this.getVeterinarioList();
    },
    emits: [] // los eventos personalizados que el componente puede emitir.
}
</script>
  
<style></style>