export interface AccountLabel {
  text: string
}

export type AccountType = 'LDAP' | 'Локальная'

export interface Account {
  id: string
  label: AccountLabel[]
  type: AccountType
  login: string
  password: string | null
  isValid: boolean
  showPassword?: boolean
  labelInput?: string
}
