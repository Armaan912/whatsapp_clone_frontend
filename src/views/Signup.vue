<template>
  <div class="signup-container">
    <div class="container" style="max-width: 400px;">
      <div class="signup-card">
        <h3 class="mb-4 text-center">Create WhatsApp Account</h3>

        <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
        <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

        <div class="mb-3">
          <label class="form-label">Username</label>
          <input 
            v-model="username" 
            type="text" 
            class="form-control" 
            :class="{ 'is-invalid': v$.username.$error }"
            placeholder="Choose a username" 
            @blur="v$.username.$touch()"
          />
          <div v-if="v$.username.$error" class="invalid-feedback">
            {{ v$.username.$errors[0].$message }}
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Mobile</label>
          <input 
            v-model="mobile" 
            type="text" 
            class="form-control" 
            :class="{ 'is-invalid': v$.mobile.$error }"
            placeholder="Enter your mobile number" 
            @blur="v$.mobile.$touch()"
          />
          <div v-if="v$.mobile.$error" class="invalid-feedback">
            {{ v$.mobile.$errors[0].$message }}
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input 
            v-model="password" 
            type="password" 
            class="form-control" 
            :class="{ 'is-invalid': v$.password.$error }"
            placeholder="Choose a password" 
            @blur="v$.password.$touch()"
          />
          <div v-if="v$.password.$error" class="invalid-feedback">
            {{ v$.password.$errors[0].$message }}
          </div>
        </div>

        <button 
          @click="registerUser" 
          class="btn btn-success w-100 mb-3"
        >
          Create Account
        </button>

        <p class="text-center mb-0">
          Already have an account? <router-link to="/login" class="text-decoration-none">Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
import api from "../api/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const mobile = ref("");
const password = ref("");
const errorMsg = ref("");
const successMsg = ref("");

// Validation rules
const rules = {
  username: { 
    required: helpers.withMessage('Username is required', required),
    minLength: helpers.withMessage('Username must be at least 3 characters', minLength(3))
  },
  mobile: { 
    required: helpers.withMessage('Mobile number is required', required),
    validMobile: helpers.withMessage('Please enter a valid mobile number', 
      helpers.regex(/^[0-9]{10,15}$/))
  },
  password: { 
    required: helpers.withMessage('Password is required', required),
    minLength: helpers.withMessage('Password must be at least 6 characters', minLength(6))
  }
};

const v$ = useVuelidate(rules, { username, mobile, password });

async function registerUser() {
  // Validate before submission
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  try {
    await api.post("/auth/signup", {
      username: username.value,
      mobile: mobile.value,
      password: password.value
    });
    successMsg.value = "Signup successful! Please login.";
    setTimeout(() => router.push("/login"), 1500);
  } catch (err) {
    errorMsg.value = err.response?.data?.message || "Signup failed";
  }
}
</script>

<style scoped>
.signup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.signup-card {
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
