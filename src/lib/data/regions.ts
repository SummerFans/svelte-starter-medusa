import { sdk } from "../config"

export const listRegions = async () => {

  return sdk.client
    .fetch<{ regions: any }>(`/store/regions`, {
      method: "GET",
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
    .catch(err=>{
      console.error(err)
    })
}