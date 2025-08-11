<template>
  <div class="login-container">
    <div class="container" style="max-width: 400px;">
      <div class="login-card">
        <h3 class="mb-4 text-center">Login to WhatsApp</h3>
        <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

        <div class="mb-3">
          <label class="form-label">Mobile</label>
          <input v-model="mobile" type="text" class="form-control" placeholder="Enter your mobile number" />
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" placeholder="Enter your password" />
        </div>

        <button @click="loginUser" class="btn btn-success w-100 mb-3">Login</button>

        <p class="text-center mb-0">
          No account? <router-link to="/signup" class="text-decoration-none">Sign up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import api from "../api/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const mobile = ref("");
const password = ref("");
const errorMsg = ref("");

async function loginUser() {
  try {
    const { data } = await api.post("/auth/login", {
      mobile: mobile.value,
      password: password.value
    });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    router.push("/chat");
  } catch (err) {
    errorMsg.value = err.response?.data?.message || "Login failed";
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
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

.text-decoration-none {
  color: #25D366;
}

.text-decoration-none:hover {
  color: #128C7E;
}
</style>
