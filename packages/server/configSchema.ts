import { z } from '@coko/server'

const schema = z.strictObject({
  tempFolderPath: z.string().optional(),
})

export default schema
