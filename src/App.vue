<template>
  <Menu>
    <router-link to="/">Home</router-link>
    <router-link to="/genero">Generos</router-link>
    <router-link to="/libro">Libros</router-link>
  </Menu>
  <router-view />
</template>

<script>
import {mapGetters } from 'vuex'
import Menu from './components/Menu.vue'

export default {
  name: 'App',
  data() {
    return {

    }
  },
  components: {
    Menu
  },
  methods: {
  },
  computed: {
    ...mapGetters(['rol'])
  }
}
</script>

<style lang="scss"></style>
