<script setup lang="ts">
import { useAccountStore } from '@/stores/accountStore';
import AccountItem from '@/components/AccountItem.vue'; 
import { storeToRefs } from 'pinia';

const accountStore = useAccountStore();

const { accounts } = storeToRefs(accountStore);
</script>

<template>
  <div>
    <AccountItem 
      v-for="account in accounts" 
      :key="account.id" 
      :account="account" 
    />
  </div>
</template>