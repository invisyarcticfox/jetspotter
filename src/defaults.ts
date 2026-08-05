export const defaultConf = {
  coords: { lat: '51.477811', lon: '0.0' },
  radius: 15,
  interval: 30,

  discord: {
    method: 'webhook' as 'webhook'|'bot',
    webhookUrl: '',
    bot: { endpoint: '', channelId: '' }
  },

  owm: { apiKey: '' },
  pushover: { user: '', token: '' }
}

export type Config = typeof defaultConf