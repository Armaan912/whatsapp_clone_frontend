<template>
  <div id="app">
    <Navbar v-if="showNavbar" />
    <router-view />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';

const route = useRoute();

const showNavbar = computed(() => {
  // Don't show navbar on login and signup pages
  return !['/login', '/signup'].includes(route.path);
});
</script>

<style>
body {
  font-family: Arial, sans-serif;
}
</style>
