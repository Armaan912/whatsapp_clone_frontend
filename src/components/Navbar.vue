<template>
  <nav class="navbar">
    <div class="container-fluid px-3">
      <div class="d-flex justify-content-between align-items-center w-100">
        <div class="navbar-brand">
          <i class="fab fa-whatsapp text-success me-2"></i>
          <span class="brand-text">WhatsApp Web</span>
        </div>

        <div class="user-dropdown ms-auto" v-if="user">
          <button
            class="btn user-dropdown-btn p-1"
            type="button"
            @click="toggleUserDropdown"
          >
            <img
              :src="getProfileImage()"
              alt="Profile"
              class="profile-image"
            />
            <span class="user-name d-none d-md-inline ms-2">{{
              user.username
            }}</span>
            <i class="fas fa-chevron-down ms-1 dropdown-arrow"></i>
          </button>
          
          <div v-if="showUserDropdown" class="user-dropdown-menu">
            <div class="user-dropdown-header">
              <img
                :src="getProfileImage()"
                alt="Profile"
                class="dropdown-profile-image"
              />
              <div class="dropdown-user-info">
                <span class="dropdown-user-name">{{ user.username }}</span>
                <small class="dropdown-user-mobile">{{ user.mobile }}</small>
              </div>
            </div>
            <div class="user-dropdown-divider"></div>
            <button
              class="user-dropdown-item"
              @click="navigateToProfile"
            >
              <i class="fas fa-user"></i> Profile
            </button>
            <div class="user-dropdown-divider"></div>
            <button
              class="user-dropdown-item text-danger"
              @click="handleLogout"
            >
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showUserDropdown = ref(false);
const user = ref(null);

onMounted(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    user.value = JSON.parse(userData);
  }
});

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value;
};

const handleClickOutside = (event) => {
  const dropdown = document.querySelector(".user-dropdown");
  if (dropdown && !dropdown.contains(event.target)) {
    showUserDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const navigateToProfile = () => {
  showUserDropdown.value = false;
  router.push("/profile");
};

const handleLogout = () => {
  showUserDropdown.value = false;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
};

const getProfileImage = () => {
  if (user.value?.profilePic) {
    return user.value.profilePic;
  }
  return "/default-avatar.svg";
};
</script>

<style scoped>
.navbar {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 0.75rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1020;
}

.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  flex-shrink: 0;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #128C7E;
}

.fab.fa-whatsapp {
  font-size: 2rem;
}

.profile-image {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;
}

@media (min-width: 768px) {
  .profile-image {
    width: 40px;
    height: 40px;
  }
}

.user-dropdown {
  position: relative;
  margin-left: auto;
}

.user-dropdown-btn {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: none;
  outline: none;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-dropdown-btn:hover {
  background-color: #f8f9fa;
  border-radius: 8px;
}

.user-dropdown-btn:focus {
  outline: none;
  box-shadow: none;
}

.dropdown-arrow {
  font-size: 0.75rem;
  transition: transform 0.2s ease;
}

.user-dropdown-btn:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.user-name {
  font-size: 0.875rem;
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

@media (min-width: 768px) {
  .user-name {
    font-size: 1rem;
  }
}

.user-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 220px;
  z-index: 1050;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
  margin-top: 0.5rem;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-dropdown-header {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.dropdown-profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
}

.dropdown-user-name {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.dropdown-user-mobile {
  color: #666;
  font-size: 0.8rem;
}

.user-dropdown-item {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  color: #333;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.user-dropdown-item:hover {
  background-color: #f8f9fa;
}

.user-dropdown-item.text-danger {
  color: #dc3545;
}

.user-dropdown-item.text-danger:hover {
  background-color: #fff5f5;
}

.user-dropdown-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 0;
}

@media (max-width: 576px) {
  .brand-text {
    font-size: 1.25rem;
  }
  
  .fab.fa-whatsapp {
    font-size: 1.5rem;
  }
}
</style>
