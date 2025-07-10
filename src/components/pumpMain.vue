<script setup lang="ts">
import { UserButton } from '@clerk/vue'
import { useConvexMutation, useConvexQuery } from '@convex-vue/core'
import { BellIcon } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import { navBarTitles } from "../constant/pumpConstants"
import type { Pump } from '../type/pumpMasteType'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

// Dialog states
const newDialogOpen = ref(false)
const editDialogOpen = ref(false)
const { resetForm } = useForm()
const selectedPump = ref<Pump | null>(null)
const formData = ref({
  pumpName: '',
  type: '',
  area: '',
  flowRate: 0,
  offSet: 0,
  current_pressure: 0,
  latitude: 0,
  longitude: 0,
  max_pressure: 0,
  min_pressure: 0,
})

// Fetch pumps
const pumps = useConvexQuery(api.pumpMaster.getAllPump, {})
const { setValues } = useForm({
  initialValues: {
    pumpName: '',
    type: '',
    area: '',
    flowRate: 0,
    offSet: 0,
    current_pressure: 0,
    latitude: 0,
    longitude: 0,
    max_pressure: 0,
    min_pressure: 0,
  },
})
const searchQuery = ref('');
const filterOption = ref('all');
const showSearch = ref(false);

const filteredPumps = computed(() => {
  const data = pumps.data.value || [];
  if (!searchQuery.value) return data;

  return data.filter((pump: Pump) => {
    const query = searchQuery.value.toLowerCase();
    switch (filterOption.value) {
      case 'name':
        return pump.pumpName.toLowerCase().includes(query);
      case 'area':
        return pump.area?.toLowerCase().includes(query) || false;
      case 'type':
        return pump.type?.toLowerCase().includes(query) || false;
      case 'all':
      default:
        return (
          pump.pumpName.toLowerCase().includes(query) ||
          pump.area?.toLowerCase().includes(query) ||
          pump.type?.toLowerCase().includes(query)
        );
    }
  });
});

// Mutations
const createPump = useConvexMutation(api.pumpMaster.createPump)
const updatePump = useConvexMutation(api.pumpMaster.updatePump)
const deletePump = useConvexMutation(api.pumpMaster.deletePump)

// Create pump
const onCreateSubmit = async () => {
  const payload = JSON.parse(JSON.stringify(formData.value))
  payload.latitude = Number(payload.latitude)
  payload.longitude = Number(payload.longitude)
  payload.max_pressure = Number(payload.max_pressure)
  payload.offSet = Number(payload.offSet)
  await createPump.mutate(payload)
  resetForm()
  newDialogOpen.value = false;
}

// Delete pump
const confirmDelete = async (id: Id<"pumpInfo">) => {
  if (confirm('Are you sure you want to delete this pump?')) {
    await deletePump.mutate({ id })
  }
}

// Open edit dialog
const openEditDialog = (pump: Pump) => {
  selectedPump.value = pump
  setValues({
    pumpName: pump.pumpName,
    type: pump.type,
    area: pump.area,
    latitude: pump.latitude,
    longitude: pump.longitude,
    flowRate: pump.flowRate,
    offSet: pump.offSet,
    current_pressure: pump.current_pressure,
    min_pressure: pump.min_pressure,
    max_pressure: pump.max_pressure,
  })
  formData.value = {
    pumpName: pump.pumpName,
    type: pump.type,
    area: pump.area,
    latitude: pump.latitude,
    longitude: pump.longitude,
    flowRate: pump.flowRate,
    offSet: pump.offSet,
    current_pressure: pump.current_pressure,
    min_pressure: pump.min_pressure,
    max_pressure: pump.max_pressure,
  }
  editDialogOpen.value = true
}

const onUpdateSubmit = async () => {
  const payload = JSON.parse(JSON.stringify(formData.value))
  console.log(payload);
  await updatePump.mutate({
    id: selectedPump.value?._id,
    ...payload,
  })
  resetForm()
  editDialogOpen.value = false;
}

</script>

<template>
  <div class="flex flex-col w-full h-screen bg-gray-100">
    <nav class="bg-gray-800 text-white p-4 flex items-center justify-between gap-4">
      <div class="flex items-center">
        <h2 class="pr-4">+</h2>
        <h2 class="text-xl font-bold">PumpMaster</h2>
        <div class="flex">
          <div v-for="title in navBarTitles || []" :key="title.id" class="p-2 hover:bg-gray-700 rounded cursor-pointer">
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

    <main class="flex-1 p-6 overflow-auto bg-white rounded shadow" style="max-width: 1200px;">
      <div class="flex justify-between">
        <h1 class="text-2xl font-bold mb-4">Pumps</h1>
        <Dialog v-model:open="newDialogOpen">
          <DialogTrigger as-child>
            <Button class="bg-gray-300 text-black h-[40px]">New Pump</Button>
          </DialogTrigger>
          <DialogContent class="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Pump</DialogTitle>
            </DialogHeader>
            <Form @submit="onCreateSubmit()" class="space-y-4">
              <FormField v-slot="{ field }" name="pumpName">
                <FormItem>
                  <FormLabel>Pump Name</FormLabel>
                  <FormControl>
                    <Input v-model="formData.pumpName" placeholder="Pump 12345" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ field }" name="type">
                <FormItem>
                  <FormLabel>Pump Type</FormLabel>
                  <FormControl>
                    <Select v-model="formData.type" placeholder="Select type">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="centrifugal">Centrifugal</SelectItem>
                        <SelectItem value="submersible">Submersible</SelectItem>
                        <SelectItem value="diaphragm">Diaphragm</SelectItem>
                        <SelectItem value="rotary">Rotary</SelectItem>
                        <SelectItem value="peristaltic">Peristaltic</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ field }" name="area">
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <FormControl>
                    <Input v-model="formData.area" placeholder="Area A" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ field }" name="latitude">
                <FormItem>
                  <FormLabel>Latitude / Longitude</FormLabel>
                  <FormControl>
                    <div class="flex gap-2">
                      <Input v-model="formData.latitude" placeholder="34.0522" class="w-1/2" />
                      <Input v-model="formData.longitude" placeholder="-118.2437" class="w-1/2" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ field }" name="offSet">
                <FormItem>
                  <FormLabel>Offset</FormLabel>
                  <FormControl>
                    <Input v-model="formData.offSet" placeholder="3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ field }" name="min_pressure">
                <FormItem>
                  <FormLabel>Reassure Max</FormLabel>
                  <FormControl>
                    <div class="flex gap-2">
                      <Input v-model="formData.max_pressure" placeholder="180" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ field }" name="flowRate">
                <FormItem>
                  <FormLabel>Flow Rate</FormLabel>
                  <FormControl>
                    <Input v-model="formData.flowRate" placeholder="0" type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ field }" name="current_pressure">
                <FormItem>
                  <FormLabel>Current Pressure</FormLabel>
                  <FormControl>
                    <Input v-model="formData.current_pressure" placeholder="0" type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <div class="flex justify-end gap-2">
                <Button type="button" variant="outline" @click="newDialogOpen = false">Cancel</Button>
                <Button type="submit" class="bg-blue-600">Save</Button>
              </div>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div class="flex w-full justify-between items-center mb-6">
        <div class="flex gap-2">
          <button @click="showSearch = !showSearch"
            class="p-2 cursor-pointer rounded-lg border border-gray-300 flex h-[40px] w-[40px] justify-center items-center gap-2 text-gray-600 hover:bg-gray-100">
            <span>🔍</span>
          </button>
          <div v-if="showSearch" class="mt-1 absolute z-10 w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div class="flex items-center p-4 h-[40px]">
              <input v-model="searchQuery" placeholder="Search pumps by name..."
                class="w-full p-2 border-none focus:outline-none" />
              <button @click="showSearch = false" class="ml-2 text-gray-500 hover:text-gray-700">✖</button>
            </div>
            <select v-model="filterOption"
              class="w-[95%] h-[40px] pl-5 pr-4 border-t border-gray-200 focus:outline-none">
              <option value="all">All</option>
              <option value="name">Name</option>
              <option value="area">Area</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pump Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Area</TableHead>
            <TableHead>Latitude</TableHead>
            <TableHead>Longitude</TableHead>
            <TableHead>Flow Rate</TableHead>
            <TableHead>Current Pressure</TableHead>
            <TableHead>Min Pressure</TableHead>
            <TableHead>Max Pressure</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="pump in filteredPumps" :key="pump._id">
            <TableCell>{{ pump.pumpName }}</TableCell>
            <TableCell>{{ pump.type }}</TableCell>
            <TableCell>{{ pump.area }}</TableCell>
            <TableCell>{{ pump.latitude.toFixed(4) }}</TableCell>
            <TableCell>{{ pump.longitude.toFixed(4) }}</TableCell>
            <TableCell>{{ pump.flowRate }}</TableCell>
            <TableCell>{{ pump.current_pressure }}</TableCell>
            <TableCell>{{ pump.min_pressure }}</TableCell>
            <TableCell>{{ pump.max_pressure }}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="outline" class="mr-2">Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem @click="openEditDialog(pump)">Edit</DropdownMenuItem>
                  <DropdownMenuItem @click="confirmDelete(pump._id)" class="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Dialog v-model:open="editDialogOpen">
        <DialogContent class="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Pump</DialogTitle>
          </DialogHeader>
          <div class="space-y-4">
            <h2 class="text-2xl font-bold">{{ selectedPump?.pumpName || 'Pump' }} <span
                class="text-sm text-gray-500">Pump ID {{ selectedPump?._id }}</span></h2>
            <Form @submit=onUpdateSubmit class="space-y-4">
              <FormField v-slot="{ field }" name="pumpName">
                <FormItem>
                  <FormLabel>Pump Name</FormLabel>
                  <FormControl>
                    <Input v-model="formData.pumpName" placeholder="Pump 12345" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ field }" name="type">
                <FormItem>
                  <FormLabel>Pump Type</FormLabel>
                  <FormControl>
                    <Input v-model="formData.type" placeholder="Diaphragm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ field }" name="area">
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <FormControl>
                    <Input v-model="formData.area" placeholder="Area A" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ field }" name="latitude">
                <FormItem>
                  <FormLabel>Latitude / Longitude</FormLabel>
                  <FormControl>
                    <div class="flex gap-2">
                      <Input v-model="formData.latitude" placeholder="34.0522" class="w-1/2" />
                      <Input v-model="formData.longitude" placeholder="-118.2437" class="w-1/2" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ field }" name="offSet">
                <FormItem>
                  <FormLabel>Offset</FormLabel>
                  <FormControl>
                    <Input v-model="formData.offSet" placeholder="3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ field }" name="min_pressure">
                <FormItem>
                  <FormLabel>Reassure Min / Max</FormLabel>
                  <FormControl>
                    <div class="flex gap-2">
                      <Input v-model="formData.min_pressure" placeholder="120" class="w-1/2" />
                      <Input v-model="formData.max_pressure" placeholder="180" class="w-1/2" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ field }" name="flowRate">
                <FormItem>
                  <FormLabel>Flow Rate</FormLabel>
                  <FormControl>
                    <Input v-model="formData.flowRate" placeholder="0" type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ field }" name="current_pressure">
                <FormItem>
                  <FormLabel>Current Pressure</FormLabel>
                  <FormControl>
                    <Input v-model="formData.current_pressure" placeholder="0" type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <div class="flex justify-end gap-2">
                <Button type="button" variant="outline" @click="editDialogOpen = false">Cancel</Button>
                <Button type="submit" class="bg-blue-600">Save</Button>
              </div>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  </div>
</template>