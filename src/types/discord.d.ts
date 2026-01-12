export type DiscordEmbedField = { name:string, value:string, inline:boolean }

export type DiscordEmbed = {
  color: string,
  fields: DiscordEmbedField[],
  image: { url:string } | null,
  footer: { text:string }
}

export type DiscordButtons = { name:string, link:string|null, row:number}