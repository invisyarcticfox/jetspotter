export type ADSBdb = {
  response: {
    aircraft: {
      type: string
      icao_type: string
      manufacturer: string
      mode_s: string
      registration: string
      registered_owner_country_iso_name: string
      registered_owner_country_name: string
      registered_owner_operator_flag_code: string
      registered_owner: string
    }
  }
}

export type ADSBdbRes = {
  type: string
  registration: string
  country: string
  operator: string
}