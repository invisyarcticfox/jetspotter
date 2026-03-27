declare namespace NodeJS {
  interface ProcessEnv {
    COORD_LAT: string
    COORD_LON: string
    PUSHOVER_USER_KEY: string
    PUSHOVER_API_KEY: string
    CLOUDFLARE_ACCOUNT_ID: string
    CLOUDFLARE_D1_ID: string
    CLOUDFLARE_D1_API_KEY: string
    OWM_API_KEY: string
  }
}