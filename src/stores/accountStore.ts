import { defineStore } from 'pinia'
import { ref, watch, onMounted, computed } from 'vue'

interface Account {
  id: string
  label: { text: string }[]
  type: 'LDAP' | 'Локальная'
  login: string
  password: string | null
  isValid: boolean
  showPassword?: boolean
}

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>([])

  const validAccounts = computed(() => {
    return accounts.value.filter((account) => account.isValid)
  })

  const saveToLocalStorage = () => {
    localStorage.setItem('accounts', JSON.stringify(validAccounts.value))
  }

    watch(
      accounts,
      (newAccounts) => {
        saveToLocalStorage()
      },
      { deep: true }
    )

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

  const isLoginUnique = (account: Account) => {
    return !accounts.value.some(
      (acc) => acc.login === account.login && acc.id !== account.id
    )
  }

  const validateAccount = (account: Account) => {
    
    account.login = account.login.replace(/\s/g, '')
    if (account.password) {
      account.password = account.password.replace(/\s/g, '')
    }

    const isLoginValid = !!account.login

    const isLoginUniqueValid = isLoginUnique(account)

    const isPasswordValid =
      account.type !== 'Локальная' ||
      !!(account.password && account.password.length > 0)

    account.isValid = isLoginValid && isLoginUniqueValid && isPasswordValid
  }

  onMounted(() => {
    const savedAccounts = localStorage.getItem('accounts')
    if (savedAccounts) {
      accounts.value = JSON.parse(savedAccounts)
    }
  })

  return {
    accounts,
    validAccounts,
    addAccount,
    removeAccount,
    updateAccountLabel,
    isLoginUnique,
    validateAccount,
  }
})
