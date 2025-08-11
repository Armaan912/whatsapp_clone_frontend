<template>
  <div class="message-window p-3" style="background:#ece5dd;">
    <div v-for="m in messages" :key="m._id" class="mb-2">
      <div :class="m.senderId === currentUserId ? 'text-end' : 'text-start'">
        <div class="message-bubble-container">
          <span 
            class="p-2 rounded message-bubble" 
            :style="{ background: m.senderId === currentUserId ? '#dcf8c6' : '#fff' }">
            {{ m.text }}
            <div class="message-footer">
              <small class="text-muted time">{{ dayjs(m.createdAt).format('HH:mm') }}</small>
              <!-- Status indicators for sent messages -->
              <div v-if="m.senderId === currentUserId" class="status-indicators">
                <i v-if="m.status === 'sent'" class="fas fa-check status-sent"></i>
                <i v-else-if="m.status === 'delivered'" class="fas fa-check-double status-delivered"></i>
                <i v-else-if="m.status === 'read'" class="fas fa-check-double status-read"></i>
                <i v-else-if="m.status === 'pending'" class="fas fa-clock status-pending"></i>
                <i v-else class="fas fa-check status-sent"></i>
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from "dayjs";

const props = defineProps({
  messages: Array,
  currentUserId: String
});
</script>

<style scoped>
.message-window {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.message-window > div:last-child {
  margin-bottom: 0;
}

/* Ensure messages are properly spaced */
.message-window > div {
  margin-bottom: 0.5rem;
}

/* Style for message bubbles */
.message-window .message-bubble {
  display: inline-block;
  max-width: 70%;
  word-wrap: break-word;
  line-height: 1.4;
  position: relative;
}

/* Message footer with time and status */
.message-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
  gap: 0.5rem;
}

.time {
  opacity: 0.7;
  font-size: 0.75rem;
}

/* Status indicators */
.status-indicators {
  display: flex;
  align-items: center;
}

.status-indicators i {
  font-size: 0.75rem;
  margin-left: 0.25rem;
}

.status-sent {
  color: #8e8e8e;
}

.status-delivered {
  color: #34b7f1;
}

.status-read {
  color: #4fc3f7;
}

.status-pending {
  color: #bdbdbd;
}

/* Right-aligned messages (sent by current user) */
.text-end .message-footer {
  flex-direction: row-reverse;
}

.text-end .status-indicators {
  margin-right: 0.25rem;
}
</style>


