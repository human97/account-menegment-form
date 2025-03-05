<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAccountStore } from '@/stores/accountStore';
import type { Account } from '@/types/account';
import { ACCOUNT_TYPES, ERROR_MESSAGES } from '@/constants'; 

const props = defineProps<{
  account: Account
}>();

const accountStore = useAccountStore();

accountStore.validateAccount(props.account);

const isUnique = computed(() => accountStore.isLoginUnique(props.account));

const removeAccount = () => {
  accountStore.removeAccount(props.account.id);
};

const handleLabelBlur = () => {
  const labelInput = props.account.labelInput || '';
  const newLabel = labelInput
    .split(';')
    .map(text => ({ text: text.trim() }))
    .filter(item => item.text.length > 0);

  accountStore.updateAccountLabel(props.account.id, newLabel);
};

const isLoginError = computed(() => !props.account.isValid && (!props.account.login || !isUnique.value));
const loginErrorMessage = computed(() => {
  if (!props.account.isValid && !props.account.login) return ERROR_MESSAGES.EMPTY_LOGIN;
  if (!isUnique.value) return ERROR_MESSAGES.LOGIN_EXISTS;
  return '';
});

const isPasswordError = computed(() => !props.account.isValid && props.account.type === 'Локальная' && (!props.account.password || props.account.password.length === 0));

const passwordErrorMessage = computed(() => isPasswordError.value ? ERROR_MESSAGES.EMPTY_PASSWORD : '');
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
        :items="ACCOUNT_TYPES" 
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
        :error="isLoginError"
        :error-messages="loginErrorMessage"
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
        :error="isPasswordError"
        :error-messages="passwordErrorMessage"
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