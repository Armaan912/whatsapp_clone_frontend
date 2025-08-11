<template>
  <div class="p-2 border-top d-flex">
    <input 
      v-model="newMessage" 
      @keyup.enter="send" 
      class="form-control me-2" 
      placeholder="Type a message" />
    <button @click="send" class="btn btn-primary">
      <i class="fa fa-paper-plane"></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["send-message"]);
const newMessage = ref("");

function send() {
  if (newMessage.value.trim()) {
    emit("send-message", newMessage.value);
    newMessage.value = "";
  }
}
</script>


