<script setup lang="ts">
import { SignIn } from "@clerk/vue";
import "../style.css";

const baseUrl = import.meta.env.VITE_CLERK_REDIRECT_URL || 'http://localhost:5173';
const signUpUrl = `${baseUrl}/sign-up`;
</script>

<template>
  <main class="flex w-full mt-[-3%]">
    <div class="flex flex-col w-full h-screen">
      <img src="../../public/pump.jpeg" alt="background" class="background-image">
      <div class="flex gap-[10px] pl-[30px] w-full top-0 justify-start"
        style="background-color: white; color: black; font-weight: 700;">
        <h3>+</h3>
        <h3>PumpMaster</h3>
      </div>
      <div class="flex justify-center items-center pt-[10%]">
        <SignIn :routing="'path'" :path="'/sign-in'" :sign-up-fallback-redirect-url="signUpUrl" :sign-up-url="signUpUrl"
          :sign-up-force-redirect-url="signUpUrl" />
      </div>
    </div>
  </main>
</template>