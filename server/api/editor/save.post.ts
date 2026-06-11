import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

// Dev-only: persists scenario edits from /editor back to scenario/<id>/scenario.json.
export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV === 'production') {
    throw createError({ statusCode: 403, statusMessage: 'Editor saves are dev-only' })
  }

  const { id, scenario, types } = await readBody(event)
  if (!id || !/^[a-z0-9-]+$/.test(id) || scenario?.id !== id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid scenario id' })
  }

  let json = JSON.stringify(scenario, null, 2)
  // compact tilemap rows onto single lines
  json = json.replace(/\[\n(\s+[\d,\n\s]+?)\n\s*\]/g, (_m, inner: string) => '[' + inner.replace(/\s+/g, '') + ']')

  const path = join(process.cwd(), 'scenario', id, 'scenario.json')
  await writeFile(path, json)

  // optional building-type meta updates
  const written: string[] = [`scenario/${id}/scenario.json`]
  for (const t of types ?? []) {
    if (!t?.id || !/^[a-z0-9-]+$/.test(t.id) || t.meta?.id !== t.id) {
      throw createError({ statusCode: 400, statusMessage: `Invalid building type id: ${t?.id}` })
    }
    const typePath = join(process.cwd(), 'scenario', 'building-types', `${t.id}.json`)
    await writeFile(typePath, JSON.stringify(t.meta, null, 2) + '\n')
    written.push(`scenario/building-types/${t.id}.json`)
  }

  return { ok: true, written }
})
