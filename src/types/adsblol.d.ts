export namespace AdsbLol {
  type ReApi = reapi
  type v2 = version2
  type Me = me
}

type reapi = {
  now: number
  aircraft: {
    hex: string
    type: string
    flight?: string
    r?: string
    t?: string
    alt_baro: number|'ground'
    alt_geom?: number
    gs?: number
    tas?: number
    track?: number
    track_rate?: number
    roll?: number
    geom_rate?: number
    squawk?: string
    emergency?: string
    category?: string
    nav_qnh?: number
    nav_altitude_mcp?: number
    lat: number
    lon: number
    nic: number
    rc: number
    seen_pos: number
    version?: number
    nic_baro?: number
    nac_p?: number
    nac_v?: number
    sil?: number
    sil_type?: string
    gva?: number
    sda?: number
    alert?: number
    spi?: number
    mlat: string[]
    tisb: any[]
    messages: number
    seen: number
    rssi: number
    dst: number
    dir: number
    ias?: number
    mach?: number
    wd?: number
    ws?: number
    oat?: number
    tat?: number
    mag_heading?: number
    true_heading?: number
    baro_rate?: number
    nav_heading?: number
    nav_altitude_fms?: number
    nav_modes?: string[]
    dbFlags?: number
    calc_track?: number
  }[]
  resultCount: number
  ptime: number
}
type version2 = {
  ac: {
    hex: string
    type: string
    flight?: string
    r?: string
    t?: string
    alt_baro: number|'ground'
    alt_geom?: number
    gs?: number
    ias?: number
    tas?: number
    mach?: number
    wd?: number
    ws?: number
    oat?: number
    tat?: number
    track?: number
    roll?: number
    mag_heading?: number
    true_heading?: number
    baro_rate?: number
    geom_rate?: number
    squawk?: string
    emergency?: string
    category?: string
    nav_qnh?: number
    nav_altitude_mcp?: number
    nav_heading?: number
    lat: number
    lon: number
    nic: number
    rc: number
    seen_pos: number
    version?: number
    nic_baro?: number
    nac_p?: number
    nac_v?: number
    sil?: number
    sil_type?: string
    gva?: number
    sda?: number
    alert?: number
    spi?: number
    mlat: string[]
    tisb: any[]
    messages: number
    seen: number
    rssi: number
    dst: number
    dir: number
    track_rate?: number
    nav_altitude_fms?: number
    nav_modes?: string[]
    dbFlags?: number
    calc_track?: number
  }[]
  msg: string
  now: number
  total: number
  ctime: number
  ptime: number
}
type me = {
  _motd: any[]
  clients: {
    beast: {
      adsblol_my_url: string
      connected_seconds: number
      ip: string
      kbps: number
      messages_per_second: number
      ms: number
      positions: number
      positions_per_second: number
      uuid: string
    }[]
    mlat: any[]
  }
  global: { aircraft: number, beast: number, mlat: number }
}