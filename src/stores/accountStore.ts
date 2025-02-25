import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'

interface Account {
  id: string
  label: { text: string }[]
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

  const updateAccountLabel = (id: string, label: { text: string }[]) => {
    const account = accounts.value.find((acc) => acc.id === id)
    if (account) {
    account.label = label
    }
  }

  onMounted(() => {
    const savedAccounts = localStorage.getItem('accounts')
    if (savedAccounts) {
      accounts.value = JSON.parse(savedAccounts)
    }
  })

  return { accounts, addAccount, removeAccount, updateAccountLabel }
})
