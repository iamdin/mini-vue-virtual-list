<script setup lang="ts">
import { faker } from '@faker-js/faker'
const data = Array(1000)
  .fill(0)
  .map((_, idx) => ({
    id: idx,
    content: faker.lorem.paragraph(),
  }))
</script>

<template>
  <div class="wrapper">
    <virtual-list :list-data="data" :estimateItemSize="50">
      <template v-slot="item">
        <p class="item">
          <span>{{ item.content }}</span>
        </p>
      </template>
    </virtual-list>
  </div>
</template>

<style scoped>
.wrapper {
  width: 80vw;
  height: 70vh;
}
.item {
  padding: 0.5rem;
  box-sizing: border-box;
  border-bottom: 1px solid rgb(133, 130, 130);
}
</style>
