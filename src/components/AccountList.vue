<script setup lang="ts">
import { useAccountStore } from '@/stores/accountStore';
import AccountItem from '@/components/AccountItem.vue'; 

const accountStore = useAccountStore();

const accounts = accountStore.accounts;
</script>

<template>
  <div>
    <AccountItem 
      v-for="account in accountStore.accounts" 
      :key="account.id" 
      :account="account" 
    />
  </div>
</template>