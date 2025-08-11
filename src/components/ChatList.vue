<template>
  <div class="list-group">
    <div 
      v-for="c in contacts" 
      :key="c._id" 
      class="list-group-item list-group-item-action"
      @click="selectContact(c)"
      style="cursor:pointer;">
      <strong>{{ c.username }}</strong><br/>
      <small class="text-muted">{{ c.mobile }}</small>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";

const contacts = ref([]);
const user = JSON.parse(localStorage.getItem("user") || "{}");

const emit = defineEmits(["select-contact"]);

async function loadContacts() {
  const { data } = await api.get("/users");
  contacts.value = data.filter(c => c._id !== (user.id || user._id));
}

function selectContact(contact) {
  emit("select-contact", contact);
}

onMounted(loadContacts);
</script>

