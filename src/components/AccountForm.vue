<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAccountStore } from '@/stores/accountStore';
import { v4 as uuidv4 } from 'uuid';

const accountStore = useAccountStore();

const newAccount = () => {
  accountStore.addAccount({
    id: uuidv4(),
    label: [],
    type: 'LDAP',
    login: '',
    password: null,
    isValid: false,
    showPassword: false,
  });
};

const isLoginUnique = (account: any) => {
  return !accountStore.accounts.some(
    (acc) => acc.login === account.login && acc.id !== account.id
  );
};

const validateAccount = (account: any) => {
  account.login = account.login.replace(/\s/g, '');
  if (account.password) {
    account.password = account.password.replace(/\s/g, '');
  }

  const isLoginValid = !!account.login;

  const isLoginUniqueValid = isLoginUnique(account);

  const isPasswordValid = account.type !== 'Локальная' || (account.password && account.password.length > 0);

  account.isValid = isLoginValid && isLoginUniqueValid && isPasswordValid;

  if (account.isValid) {
    localStorage.setItem('accounts', JSON.stringify(accountStore.accounts));
  }
};

const saveValidAccounts = () => {
  const validAccounts = accountStore.accounts.filter(account => account.isValid);
  localStorage.setItem('accounts', JSON.stringify(validAccounts));
};

const removeAccount = (id: string) => {
  accountStore.removeAccount(id);

  localStorage.setItem('accounts', JSON.stringify(accountStore.accounts));
};

const handleLabelBlur = (account: any) => {
  const newLabel = account.labelInput
    .split(';')
    .map(text => ({ text: text.trim() }))
    .filter(item => item.text.length > 0);

  accountStore.updateAccountLabel(account.id, newLabel);
  saveValidAccounts(); 
};

watch(() => accountStore.accounts, (newAccounts) => {
  saveValidAccounts();
}, { deep: true });
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
    
    <v-row v-for="account in accountStore.accounts" :key="account.id">
      <v-col cols="2">
        <v-text-field 
          v-model.trim="account.labelInput" 
          label="Метка"  
          persistent-hint 
          maxlength="50"
          @blur="handleLabelBlur(account)"
        ></v-text-field>
      </v-col>

      <v-col cols="2">
        <v-select 
          v-model="account.type" 
          :items="['LDAP', 'Локальная']" 
          label="Тип записи" 
          @update:model-value="validateAccount(account)"
          :disabled="account.isValid"
        ></v-select>
      </v-col>

      <v-col cols="3">
        <v-text-field 
          v-model.trim="account.login" 
          label="Логин" 
          maxlength="100" 
          @blur="validateAccount(account)"
          :error="!account.isValid && (!account.login || !isLoginUnique(account))"
          :error-messages="!account.isValid && !account.login.trim() ? 'Логин не может быть пустым' : !isLoginUnique(account) ? 'Логин уже существует' : ''"
          :disabled="account.isValid"
        ></v-text-field>
      </v-col>

      <v-col cols="3" v-if="account.type === 'Локальная'">
        <v-text-field 
          v-model.trim="account.password" 
          label="Пароль" 
          :type="account.showPassword ? 'text' : 'password'" 
          maxlength="100" 
          @blur="validateAccount(account)"
          :append-icon="account.showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="account.showPassword = !account.showPassword"
          :error="!account.isValid && account.type === 'Локальная' && (!account.password || account.password.length === 0)"
          :error-messages="!account.isValid && account.type === 'Локальная' && (!account.password || account.password.length === 0) ? 'Пароль не может быть пустым' : ''"
          :readonly="account.isValid"
        ></v-text-field>
      </v-col>

      <v-col cols="auto" class="d-flex align-center">
        <v-btn
          color="error"
          @click="removeAccount(account.id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
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