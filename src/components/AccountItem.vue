<script setup lang="ts">
import { useAccountStore } from '@/stores/accountStore';

const props = defineProps({
  account: {
    type: Object,
    required: true,
  },
});

const accountStore = useAccountStore();

accountStore.validateAccount(props.account);

const isUnique = accountStore.isLoginUnique(props.account);

const removeAccount = () => {
  accountStore.removeAccount(props.account.id);
  localStorage.setItem('accounts', JSON.stringify(accountStore.accounts));
};

const handleLabelBlur = () => {
  const newLabel = props.account.labelInput
    .split(';')
    .map(text => ({ text: text.trim() }))
    .filter(item => item.text.length > 0);

  accountStore.updateAccountLabel(props.account.id, newLabel);
  localStorage.setItem('accounts', JSON.stringify(accountStore.accounts));
};
</script>

<template>
  <v-row>
    <v-col cols="2">
      <v-text-field 
        v-model.trim="account.labelInput" 
        label="Метка"  
        persistent-hint 
        maxlength="50"
        @blur="handleLabelBlur"
      ></v-text-field>
    </v-col>

    <v-col cols="2">
      <v-select 
        v-model="account.type" 
        :items="['LDAP', 'Локальная']" 
        label="Тип записи" 
        @update:model-value="accountStore.validateAccount(account)"
        :disabled="account.isValid"
      ></v-select>
    </v-col>

    <v-col cols="3">
      <v-text-field 
        v-model.trim="account.login" 
        label="Логин" 
        maxlength="100" 
        @blur="accountStore.validateAccount(account)"
        :error="!account.isValid && (!account.login || !accountStore.isLoginUnique(account))"
        :error-messages="!account.isValid && !account.login.trim() ? 'Логин не может быть пустым' : !accountStore.isLoginUnique(account) ? 'Логин уже существует' : ''"
        :disabled="account.isValid"
      ></v-text-field>
    </v-col>

    <v-col cols="3" v-if="account.type === 'Локальная'">
      <v-text-field 
        v-model.trim="account.password" 
        label="Пароль" 
        :type="account.showPassword ? 'text' : 'password'" 
        maxlength="100" 
        @blur="accountStore.validateAccount(account)"
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
        @click="removeAccount"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>