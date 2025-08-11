<template>
  <div class="profile-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="profile-card">
            <div class="text-center mb-4">
              <div class="profile-image-container">
                <img
                  :src="getProfileImage()"
                  alt="Profile"
                  class="profile-image-large"
                />
                <button class="edit-photo-btn" @click="editPhoto">
                  <i class="fas fa-camera"></i>
                </button>
              </div>
              <h3 class="mt-3">{{ user.username }}</h3>
              <p class="text-muted">{{ user.mobile }}</p>
            </div>

            <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>
            <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

            <form @submit.prevent="updateProfile">
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input 
                  v-model="formData.username" 
                  type="text" 
                  class="form-control" 
                  placeholder="Enter username"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Bio</label>
                <textarea 
                  v-model="formData.bio" 
                  class="form-control" 
                  rows="3"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label">Mobile</label>
                <input 
                  v-model="formData.mobile" 
                  type="text" 
                  class="form-control" 
                  placeholder="Enter mobile number"
                  disabled
                />
                <small class="text-muted">Mobile number cannot be changed</small>
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-success" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Updating...' : 'Update Profile' }}
                </button>
                <button type="button" class="btn btn-outline-secondary" @click="goBack">
                  Back to Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../api/axios";

const router = useRouter();
const user = ref({});
const formData = ref({
  username: "",
  bio: "",
  mobile: ""
});
const loading = ref(false);
const successMsg = ref("");
const errorMsg = ref("");

onMounted(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    user.value = JSON.parse(userData);
    formData.value = {
      username: user.value.username || "",
      bio: user.value.bio || "",
      mobile: user.value.mobile || ""
    };
  } else {
    router.push("/login");
  }
});

const getProfileImage = () => {
  if (user.value?.profilePic) {
    return user.value.profilePic;
  }
  return "/default-avatar.svg";
};

const editPhoto = () => {
  alert("Photo upload functionality coming soon!");
};

const updateProfile = async () => {
  try {
    loading.value = true;
    errorMsg.value = "";
    successMsg.value = "";

    const { data } = await api.put("/users/profile", {
      username: formData.value.username,
      bio: formData.value.bio
    });

    const updatedUser = { ...user.value, ...data };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    user.value = updatedUser;

    successMsg.value = "Profile updated successfully!";
    
    setTimeout(() => {
      successMsg.value = "";
    }, 3000);

  } catch (err) {
    errorMsg.value = err.response?.data?.message || "Failed to update profile";
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push("/chat");
};
</script>

<style scoped>
.profile-container {
  min-height: calc(100vh - 70px);
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.profile-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.profile-image-container {
  position: relative;
  display: inline-block;
}

.profile-image-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #25D366;
}

.edit-photo-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #25D366;
  border: 2px solid white;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-photo-btn:hover {
  background: #128C7E;
  transform: scale(1.1);
}

.form-label {
  font-weight: 500;
  color: #333;
}

.btn-success {
  background-color: #25D366;
  border-color: #25D366;
  font-weight: 500;
  padding: 0.75rem;
}

.btn-success:hover {
  background-color: #128C7E;
  border-color: #128C7E;
}

.btn-success:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #25D366;
  border-color: #25D366;
  color: white;
}
</style>
