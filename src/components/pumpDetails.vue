<script setup lang="ts">
import { UserButton } from '@clerk/vue'
import { navBarTitles } from "../constant/pumpConstants"
import { useRoute } from 'vue-router';
const route = useRoute();
const id = route.params.id;
const data: any = route.query.pumpData ? route.query.pumpData : "";
const pumpData = JSON.parse(data)
</script>

<template>
    <div class="flex flex-col w-full h-screen bg-gray-100">
        <nav class="bg-gray-800 text-white p-4 flex items-center justify-between gap-4">
            <div class="flex items-center">
                <h2 class="pr-4">+</h2>
                <h2 class="text-xl font-bold cursor-pointer" @click="$router.push('/')">PumpMaster</h2>
                <div class="flex">
                    <div v-for="title in navBarTitles || []" :key="title.id"
                        class="p-2 hover:bg-gray-700 rounded cursor-pointer">
                        {{ title.title }}
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="relative">
                    <input type="text" placeholder="Search"
                        class="p-2 pl-8 rounded-lg border h-[40px] border-gray-300 bg-white text-black">
                    <span class="absolute left-2 top-2 text-gray-400">🔍</span>
                </div>
                <BellIcon />
                <div>
                    <UserButton />
                </div>
            </div>
        </nav>
        <div class="container mx-auto p-4">
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-2xl font-bold">Pump {{ pumpData.pumpName }}</h1>
                <div class="text-right">
                    <p><span class="text-gray-500">Pump ID:</span> <span class="text-black">{{ id }}</span></p>
                    <p><span class="text-gray-500">Status:</span> <span class="text-black">Operational</span></p>
                    <p><span class="text-gray-500">Last Updated:</span> <span class="text-black">2025-07-11</span></p>
                </div>
            </div>

            <div class="mb-4">
                <h2 class="text-lg font-semibold">Attributes</h2>
                <div class="flex flex-col">
                    <div class="flex justify-between"><span class="text-gray-500">Type:</span>
                        <span class="text-black">{{ pumpData.type }}</span>
                    </div>
                    <div class="flex justify-between"><span class="text-gray-500">Area/Block:</span> <span
                            class="text-black">{{ pumpData.area
                            }}</span></div>
                    <div class="flex justify-between"><span class="text-gray-500">Location (lat/lon):</span> <span
                            class="text-black">{{
                                pumpData.latitude + "/" + pumpData.longitude }}</span></div>
                    <div class="flex justify-between"><span class="text-gray-500">Flow Rate:</span> <span
                            class="text-black">{{ pumpData.flowRate
                            }}</span></div>
                    <div class="flex justify-between"><span class="text-gray-500">Offset:</span> <span
                            class="text-black">{{ pumpData.offSet
                            }}</span></div>
                    <div class="flex justify-between"><span class="text-gray-500">Pressure (Current | Min | Max):</span>
                        <span class="text-black">{{
                            pumpData.current_pressure + "|" + pumpData.min_pressure + "|" + pumpData.max_pressure
                            }}</span>
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <h2 class="text-lg font-semibold">
                </h2>
                <div class="border rounded-lg p-4">
                    <img src="../../public/image.png" class="w-full h-[400px]" />
                </div>
            </div>

            <div>
                <h2 class="text-lg font-semibold">Pressure Over Time</h2>
                <div class="border rounded-lg p-4">
                    <select class="border p-2 rounded mb-2">
                        <option>Select Chart Type</option>
                    </select>
                    <div class="flex justify-between mb-2">
                        <div><span class="text-gray-500">Pressure (PSI):</span> <span class="text-black">{{
                            pumpData.current_pressure }}</span></div>
                        <div><span class="text-gray-500">Last 24 Hours:</span> <span class="text-black">+5%</span></div>
                    </div>
                    <div class="h-64 bg-gray-200 flex items-center justify-center">Chart</div>
                </div>
            </div>
        </div>
    </div>
</template>