export type PlaneSpotters = {
  photos: {
    id: string
    thumbnail: { src:string, size: { width:number, height:number } }
    thumbnail_large: { src:string, size: { width:number, height:number } }
    link: string
    photographer: string
  }[]
}

export type PlaneSpottersPhoto = {
  thumbnail: { small:string, large:string }
  link: string,
  photographer: string
}