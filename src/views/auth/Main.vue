<template>
    <div v-if="currentTab == ''"
        class="bg-[url('/png/login-bg.webp')] max-w-4xl mx-auto flex items-center flex-col justify-center h-screen overflow-hidden w-full bg-cover bg-center bg-no-repeat">
        <img src="/logo.png" class="mb-8 w-56" alt="">
        <img src="/png/dabba.webp" alt="" class="w-72">


        <div class="px-8 w-full">

            <div class="grid grid-cols-2 gap-4 border mt-4">
                <button @click="currentTab = 'login'" class="rounded-lg p-2 bg-white text-custom-primary ">
                    Login
                </button>
                <button @click="currentTab = 'register'" class="rounded-lg border border-white text-white ">
                    Register
                </button>
            </div>

            <div class="flex items-center gap-2 my-4">
                <div class="h-px bg-white/40 w-full "></div>
                <p class="text-white/80">OR</p>
                <div class="h-px bg-white/40 w-full "></div>
            </div>

            <button @click="handleDemoLogin" class="rounded-lg w-full py-2 border border-white text-white ">
                Try Demo
            </button>
        </div>
    </div>
    <div v-else-if="currentTab == 'login'" class="max-w-4xl mx-auto">
        <Login @goBack="currentTab = ''" />
    </div>
    <div v-else-if="currentTab == 'register'" class="max-w-4xl mx-auto">
        <Register @goBack="currentTab = ''" @goTologin="currentTab = 'login'" />
    </div>
</template>

<script setup>
import { makeRequest, setTokenAndRole, setisAuthenticated, getToken, getisAuthenticated } from '@/request/requests';
import { useTickerStore } from '@/stores/ticker';
import { useToastStore } from '@/stores/utils/toast';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Login from './Login.vue';
import Register from './Register.vue';


const toastStore = useToastStore();
const router = useRouter()
const loading = ref(false);
const error = ref(null);
const token = ref(localStorage.getItem('token') || null)
const isAuthenticated = ref(!!token.value);
const currentTab = ref('')


async function handleDemoLogin() {


    loading.value = true;
    error.value = null;

    try {
        const res = await makeRequest("demoLogin", "POST");
        if (!res) {
            error.value = res.error || "Something went wrong";
            toastStore.addToast("Error", error.value, "error", 3000);
            return;
        }

        if (res?.access_token) {
            token.value = `Bearer ${res.access_token}`;
            localStorage.setItem("token", token.value);
            isAuthenticated.value = true;

            // Set token & role
            setTokenAndRole(token.value, "user");

            // Start websocket safely
            setTimeout(() => {
                const rawToken = token.value?.replace("Bearer ", "") || "";
                useTickerStore().startWebSocket(rawToken);
            }, 1000);

            router.push({ name: "watchlist" });
        }
    } catch (err) {
        console.error("Login error:", err);
        error.value = "Unable to login. Please try again.";
        toastStore.addToast("Error", error.value, "error", 3000);
    } finally {
        loading.value = false;
    }
}

</script>

<style lang="scss" scoped></style>