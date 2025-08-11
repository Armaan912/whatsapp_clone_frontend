<template>
	<div class="chat-container">
		<div class="d-md-none mobile-layout">
			<div
				v-if="sidebarOpen"
				class="sidebar-overlay"
				@click="closeSidebar"
			></div>

			<div class="sidebar-mobile" :class="{ 'sidebar-open': sidebarOpen }">
				<div class="sidebar-header">
					<h5 class="mb-0">Chats</h5>
					<button @click="closeSidebar" class="btn btn-link p-0">
						<i class="fas fa-times"></i>
					</button>
				</div>
				<ChatList @select-contact="selectContact" />
			</div>

			<div class="main-chat-area" :class="{ 'sidebar-open': sidebarOpen }">
				<div class="chat-header">
					<button @click="toggleSidebar" class="btn btn-link menu-btn">
						<i class="fas fa-bars"></i>
					</button>
					<span class="chat-title">
						{{ selectedConversation ? "Chat" : "WhatsApp Web" }}
					</span>

					<button
						v-if="selectedConversation"
						@click="goBackToContacts"
						class="btn btn-link back-btn"
					>
						<i class="fas fa-arrow-left"></i>
					</button>
				</div>

				<div v-if="!selectedConversation" class="welcome-message-mobile">
					<div class="text-center">
						<i class="fab fa-whatsapp text-success" style="font-size: 3rem"></i>
						<h5 class="mt-3">Welcome to WhatsApp Web</h5>
						<p class="text-muted">Select a contact to start chatting</p>
					</div>
				</div>

				<div v-else class="chat-content-mobile">
					<div class="messages-container-mobile" ref="mobileMessagesContainer">
						<div v-if="messages.length === 0" class="text-center text-muted">
							<i
								class="fas fa-comments"
								style="font-size: 2rem; opacity: 0.5"
							></i>
							<p class="mt-2">No messages yet</p>
							<p>Start the conversation!</p>
						</div>
						<MessageWindow
							v-else
							:messages="messages"
							:currentUserId="user.id || user._id"
						/>
					</div>

					<div class="input-container-mobile">
						<MessageInput @send-message="sendMessage" />
					</div>
				</div>
			</div>
		</div>

		<div class="d-none d-md-flex desktop-layout h-100">
			<div class="contact-list-desktop">
				<ChatList @select-contact="selectContact" />
			</div>

			<div class="chat-area-desktop">
				<div v-if="!selectedConversation" class="welcome-message">
					<div class="text-center">
						<i class="fab fa-whatsapp text-success" style="font-size: 4rem"></i>
						<h4 class="mt-3">Welcome to WhatsApp Web</h4>
						<p class="text-muted">Select a contact to start chatting</p>
					</div>
				</div>

				<div v-else class="chat-content-desktop">
					<div class="messages-container" ref="desktopMessagesContainer">
						<div v-if="messages.length === 0" class="no-messages">
							<div class="text-center text-muted">
								<i
									class="fas fa-comments"
									style="font-size: 2rem; opacity: 0.5"
								></i>
								<p class="mt-2">No messages yet</p>
								<p>Start the conversation!</p>
							</div>
						</div>
						<MessageWindow
							v-else
							:messages="messages"
							:currentUserId="user.id || user._id"
						/>
					</div>

					<div class="input-container">
						<MessageInput @send-message="sendMessage" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { io } from "socket.io-client";
import api from "../api/axios";
import ChatList from "../components/ChatList.vue";
import MessageWindow from "../components/MessageWindow.vue";
import MessageInput from "../components/MessageInput.vue";

const socket = ref(null);
const messages = ref([]);
const selectedConversation = ref(null);
const user = JSON.parse(localStorage.getItem("user") || "{}");
const sidebarOpen = ref(false);
const desktopMessagesContainer = ref(null);
const mobileMessagesContainer = ref(null);
const globalMessageStatuses = ref(new Map());
const isViewingConversation = ref(false);

watch(
	messages,
	() => {
		nextTick(() => {
			scrollToBottom();
		});
	},
	{ deep: true }
);

function toggleSidebar() {
	sidebarOpen.value = !sidebarOpen.value;
}

function closeSidebar() {
	sidebarOpen.value = false;
}

async function selectContact(contact) {
	if (selectedConversation.value && socket.value) {
		socket.value.emit("leave_room", selectedConversation.value._id);
		isViewingConversation.value = false;
	}

	selectedConversation.value = null;
	messages.value = [];

	try {
		const { data } = await api.post("/conversations", { userId: contact._id });
		selectedConversation.value = data;
		isViewingConversation.value = true;

		if (socket.value) {
			socket.value.emit("join_room", {
				roomId: data._id,
				userId: user.id || user._id
			});
		}

		const res = await api.get(`/messages/${data._id}`);
		messages.value = res.data;
		
		messages.value.forEach(msg => {
			const globalStatus = globalMessageStatuses.value.get(msg._id);
			if (globalStatus && globalStatus !== msg.status) {
				msg.status = globalStatus;
			} else {
				globalMessageStatuses.value.set(msg._id, msg.status);
			}
		});

		await markExistingMessagesAsRead(data._id);

		nextTick(() => {
			scrollToBottom();
		});

		if (window.innerWidth < 768) {
			closeSidebar();
		}
	} catch (error) {}
}

async function sendMessage(text) {
	if (!selectedConversation.value) return;

	const receiverId = selectedConversation.value.participants.find(
		(id) => id !== (user.id || user._id)
	);

	try {
		const { data } = await api.post("/messages", {
			conversationId: selectedConversation.value._id,
			receiverId,
			text
		});

		const messageWithStatus = { ...data, status: "pending" };
		messages.value.push(messageWithStatus);
		globalMessageStatuses.value.set(data._id, "pending");

		nextTick(() => {
			scrollToBottom();
		});

		socket.value.emit("send_message", data);

		setTimeout(() => {
			updateMessageStatus(data._id, "sent");
		}, 100);
	} catch (err) {}
}

function updateMessageStatus(messageId, status) {
	globalMessageStatuses.value.set(messageId, status);
	
	const messageIndex = messages.value.findIndex((m) => m._id === messageId);
	if (messageIndex !== -1) {
		messages.value[messageIndex].status = status;
	}
}

function getMessageStatus(messageId) {
	return globalMessageStatuses.value.get(messageId) || "sent";
}

function scrollToBottom() {
	if (desktopMessagesContainer.value) {
		desktopMessagesContainer.value.scrollTop =
			desktopMessagesContainer.value.scrollHeight;
	}

	if (mobileMessagesContainer.value) {
		mobileMessagesContainer.value.scrollTop =
			mobileMessagesContainer.value.scrollHeight;
	}
}

function goBackToContacts() {
	if (selectedConversation.value && socket.value) {
		socket.value.emit("leave_room", selectedConversation.value._id);
		isViewingConversation.value = false;
	}
	selectedConversation.value = null;
	messages.value = [];
}

async function markExistingMessagesAsRead(conversationId) {
	if (!socket.value || !conversationId) return;

	try {
		const unreadMessages = messages.value.filter(
			(msg) => msg.receiverId === (user.id || user._id) && msg.status !== "read"
		);

		if (unreadMessages.length > 0) {
			socket.value.emit("mark_messages_read", {
				conversationId: conversationId,
				userId: user.id || user._id
			});
		}
	} catch (error) {}
}

onMounted(() => {
	socket.value = io("https://whatsapp-clone-backend-bf71.onrender.com");
	socket.value.emit("join_room", {
		roomId: user.id || user._id,
		userId: user.id || user._id
	});
	
	const savedStatuses = localStorage.getItem("messageStatuses");
	if (savedStatuses) {
		try {
			const parsed = JSON.parse(savedStatuses);
			parsed.forEach(([id, status]) => {
				globalMessageStatuses.value.set(id, status);
			});
		} catch (e) {}
	}

	socket.value.on("receive_message", (msg) => {
		if (
			selectedConversation.value &&
			msg.conversationId === selectedConversation.value._id
		) {
			const messageExists = messages.value.some((m) => m._id === msg._id);
			if (!messageExists) {
				if (msg.senderId !== (user.id || user._id)) {
					messages.value.push(msg);
					globalMessageStatuses.value.set(msg._id, msg.status || "sent");

					messages.value.sort(
						(a, b) => new Date(a.createdAt) - new Date(b.createdAt)
					);

					nextTick(() => {
						scrollToBottom();
					});

					if (msg.receiverId === (user.id || user._id)) {
						socket.value.emit("message_received", {
							messageId: msg._id,
							conversationId: msg.conversationId,
							receiverId: user.id || user._id
						});

						if (isViewingConversation.value) {
							setTimeout(() => {
								socket.value.emit("mark_messages_read", {
									conversationId: selectedConversation.value._id,
									userId: user.id || user._id
								});
							}, 1000);
						}
					}
				}
			}
		}
	});

	socket.value.on("message_read", (msgId) => {
		updateMessageStatus(msgId, "read");
	});

	socket.value.on("messages_marked_read", (data) => {
		if (data.userId !== (user.id || user._id)) {
			messages.value.forEach((msg) => {
				if (msg.senderId === data.userId && msg.status !== "read") {
					msg.status = "read";
					globalMessageStatuses.value.set(msg._id, "read");
				}
			});
		}
	});

	socket.value.on("message_status_update", (data) => {
		updateMessageStatus(data.messageId, data.status);
	});

	socket.value.on("connect", () => {});
	socket.value.on("disconnect", () => {});
	socket.value.on("connect_error", (error) => {});

	nextTick(() => {
		scrollToBottom();
	});
	
	watch(globalMessageStatuses, (newStatuses) => {
		localStorage.setItem("messageStatuses", JSON.stringify(Array.from(newStatuses.entries())));
	}, { deep: true });
});

onUnmounted(() => {
	if (socket.value) {
		if (selectedConversation.value) {
			socket.value.emit("leave_room", selectedConversation.value._id);
			isViewingConversation.value = false;
		}
		socket.value.disconnect();
	}
});
</script>

<style scoped>
.chat-container {
	height: calc(100vh - 70px);
	overflow: hidden;
}

.desktop-layout {
	height: 100%;
}

.contact-list-desktop {
	width: 350px;
	min-width: 350px;
	border-right: 1px solid #e0e0e0;
	overflow-y: auto;
	background: white;
}

.chat-area-desktop {
	flex: 1;
	display: flex;
	flex-direction: column;
	background: white;
}

.welcome-message {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f8f9fa;
}

.chat-content-desktop {
	flex: 1;
	display: flex;
	flex-direction: column;
	min-height: 0;
}

.messages-container {
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	min-height: 0;
	background: #f0f0f0;
	scroll-behavior: smooth;
}

.input-container {
	flex-shrink: 0;
	border-top: 1px solid #e0e0e0;
	background: white;
	padding: 1rem;
	position: sticky;
	bottom: 0;
}

.mobile-layout {
	height: 100%;
	position: relative;
}

.sidebar-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1000;
	animation: fadeIn 0.3s ease;
}

.sidebar-mobile {
	position: fixed;
	top: 0;
	left: -280px;
	width: 280px;
	height: 100vh;
	background: white;
	z-index: 1001;
	transition: left 0.3s ease;
	box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-mobile.sidebar-open {
	left: 0;
}

.sidebar-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	border-bottom: 1px solid #e0e0e0;
	background: #f8f9fa;
}

.sidebar-header h5 {
	margin: 0;
	color: #333;
}

.sidebar-header .btn-link {
	color: #666;
	font-size: 1.2rem;
}

.main-chat-area {
	height: 100%;
	display: flex;
	flex-direction: column;
	background: white;
	transition: transform 0.3s ease;
	min-height: 0;
}

.main-chat-area.sidebar-open {
	transform: translateX(280px);
}

.chat-header {
	display: flex;
	align-items: center;
	padding: 1rem;
	background: #f8f9fa;
	border-bottom: 1px solid #e0e0e0;
	flex-shrink: 0;
}

.menu-btn {
	color: #007bff;
	font-size: 1.2rem;
	margin-right: 1rem;
	padding: 0.5rem;
}

.back-btn {
	color: #007bff;
	font-size: 1.2rem;
	margin-left: auto;
	padding: 0.5rem;
}

.chat-title {
	font-weight: 600;
	font-size: 1.1rem;
	color: #333;
}

.welcome-message-mobile {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f8f9fa;
	padding: 2rem;
}

.chat-content-mobile {
	flex: 1;
	display: flex;
	flex-direction: column;
	min-height: 0;
}

.messages-container-mobile {
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	min-height: 0;
	background: #f0f0f0;
	scroll-behavior: smooth;
}

.input-container-mobile {
	flex-shrink: 0;
	border-top: 1px solid #e0e0e0;
	background: white;
	padding: 1rem;
	position: sticky;
	bottom: 0;
}

.no-messages {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	min-height: 200px;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@media (max-width: 767.98px) {
	.chat-container {
		height: calc(100vh - 70px);
	}
}

@media (min-width: 768px) {
	.chat-container {
		height: calc(100vh - 70px);
	}
}

.contact-list-desktop,
.sidebar-mobile,
.messages-container,
.messages-container-mobile {
	-webkit-overflow-scrolling: touch;
}

.sidebar-mobile::-webkit-scrollbar,
.messages-container-mobile::-webkit-scrollbar {
	width: 6px;
}

.sidebar-mobile::-webkit-scrollbar-track,
.messages-container-mobile::-webkit-scrollbar-track {
	background: transparent;
}

.sidebar-mobile::-webkit-scrollbar-thumb,
.messages-container-mobile::-webkit-scrollbar-thumb {
	background: #c1c1c1;
	border-radius: 3px;
}

.sidebar-mobile::-webkit-scrollbar-thumb:hover,
.messages-container-mobile::-webkit-scrollbar-thumb:hover {
	background: #a8a8a8;
}
</style>
