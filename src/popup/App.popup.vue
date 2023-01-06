<script setup lang="ts">
import ImageDisplay from '@/components/ImageDisplay.vue'
import OpenExtensionPage from '@/components/OpenExtensionPage.vue';

function closePopup(){
  window.close()
}

</script>

<template>

  <div class="panel">
    <header>
      <img alt="Vue logo" class="logo" src="/icons/icon-neonizer.svg" width="75" height="75" />
      <h1>Icon Neonizer</h1>
    </header>

    <main>
      <ImageDisplay />
      <OpenExtensionPage @opened="closePopup"/>
    </main>
  </div>
</template>
<style scoped>

header {
  display: flex;
}
</style>
