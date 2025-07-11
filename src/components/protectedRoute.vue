<script setup>
import { useAuth } from "@clerk/vue";
import { useRouter } from "vue-router";
import { watchEffect } from "vue";

const { isLoaded, isSignedIn } = useAuth();
const router = useRouter();

watchEffect(() => {

  if (isSignedIn) {
    router.replace("/");
  }
});
</script>

