import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'

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

  const saveToLocalStorage = () => {
    localStorage.setItem('accounts', JSON.stringify(accounts.value))
  }

  const addAccount = (account: Account) => {
    accounts.value.push(account)
      if (account.isValid) {
        saveToLocalStorage()
      }
  }

  const removeAccount = (id: string) => {
    accounts.value = accounts.value.filter((account) => account.id !== id)
    saveToLocalStorage() 
  }

  const updateAccountLabel = (id: string, label: { text: string }[]) => {
    const account = accounts.value.find((acc) => acc.id === id)
    if (account) {
      account.label = label
      saveToLocalStorage() 
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

    if (account.isValid) {
    saveToLocalStorage()
    }
  }

  onMounted(() => {
    const savedAccounts = localStorage.getItem('accounts')
    if (savedAccounts) {
      accounts.value = JSON.parse(savedAccounts)
    }
  })

  return {
    accounts,
    addAccount,
    removeAccount,
    updateAccountLabel,
    isLoginUnique,
    validateAccount,
  }
})
