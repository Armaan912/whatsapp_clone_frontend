<template>
  <div id="app">
    <Navbar v-if="showNavbar" />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';

const route = useRoute();
const showNavbar = computed(() => !['/login', '/signup'].includes(route.path));
</script>

<style>
body {
  font-family: Arial, sans-serif;
}
</style>
