import { Client, TextChannel } from 'discord.js'
import { config } from '~/config'

export const client = new Client({ intents: [ 'Guilds' ] })

export let jetspotterChannel:TextChannel
let promise:Promise<Client>|null = null

export function login():Promise<Client> {
  if (promise) return promise

  promise = client.login(config.discord.bot.token)
    .then(async () => {
      console.log(`Logged into Discord bot as ${client.user?.username}`)

      const channel = await client.channels.fetch(config.discord.channelId)
      if (!channel || !(channel instanceof TextChannel)) throw new Error('Discord channel is not a guild text channel')

      jetspotterChannel = channel

      return client
    })

  return promise
}