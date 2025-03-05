// constants.ts
import type { AccountType } from '@/types/account'

export const ACCOUNT_TYPES: AccountType[] = ['LDAP', 'Локальная']

export const ERROR_MESSAGES = {
  EMPTY_LOGIN: 'Логин не может быть пустым',
  LOGIN_EXISTS: 'Логин уже существует',
  EMPTY_PASSWORD: 'Пароль не может быть пустым',
}

export const LABEL_HINT =
  'Для указания нескольких меток одной пары логин/пароль используйте разделитель ;'
