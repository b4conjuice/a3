import { useLocalStorage } from '@uidotdev/usehooks'

const COOKIE_KEY = 'a3-cookie'

export default function useAccountCookie() {
  const [cookie, setCookie] = useLocalStorage(COOKIE_KEY, '')
  return {
    cookie,
    setCookie,
  }
}
