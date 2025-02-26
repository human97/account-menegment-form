<script setup lang="ts">
import { useAccountStore } from '@/stores/accountStore';
import { nanoid } from 'nanoid';
import AccountList from '@/components/AccountList.vue';

const accountStore = useAccountStore();

const newAccount = () => {
  accountStore.addAccount({
    id: nanoid(),
    label: [],
    type: 'LDAP',
    login: '',
    password: null,
    showPassword: false,
    isValid: false
  });
};
</script>

<template>
  <v-container>
    <v-row cols="12" class="d-flex align-center pa-3">
        <h2>Управление учетными записями</h2>
        <v-btn
          color="primary"
          @click="newAccount"
          class="ml-2"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
    </v-row>
    
    <v-alert
      v-if="accountStore.accounts.length > 0"
      cols="12" 
      type="info" 
      variant="tonal" 
      density="compact"
      class="my-3"
    >
        Для указания нескольких меток одной пары логин/пароль используйте разделитель <strong>;</strong>
    </v-alert>    
    
    <AccountList />
  </v-container>
</template>

<style lang="scss" scoped>
.v-container {
  padding: 20px;
}

.v-text-field.error {
  border: 1px solid red;
}
</style>