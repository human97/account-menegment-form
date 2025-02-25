import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'

interface Account {
  id: string
  label: string[]
  type: 'LDAP' | 'Локальная'
  login: string
  password: string | null
  isValid?: boolean
}

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>([])

  const addAccount = (account: Account) => {
    accounts.value.push(account)
  }

  const removeAccount = (id: string) => {
    accounts.value = accounts.value.filter((account) => account.id !== id)
  }

  onMounted(() => {
    const savedAccounts = localStorage.getItem('accounts')
    if (savedAccounts) {
      accounts.value = JSON.parse(savedAccounts)
    }
  })

  return { accounts, addAccount, removeAccount }
})
