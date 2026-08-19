export type Planespotters = {
  photos: {
    id: string
    thumbnail: {
      src: string
      size: { width: number, height: number }
    }
    thumbnail_large: {
      src: string
      size: { width: number, height: number }
    }
    link: string
    photographer: string
  }[]
}