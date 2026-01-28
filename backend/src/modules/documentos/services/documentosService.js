const fs = require('fs')
const path = require('path')

function getDocsDir() {
  // backend/src -> backend -> ProjetoFinal -> docs
  return path.join(__dirname, '../../../..', 'docs')
}

function listDocs() {
  const docsDir = getDocsDir()
  if (!fs.existsSync(docsDir)) return []

  const allowed = new Set(['.pdf', '.md', '.txt'])

  const entries = fs
    .readdirSync(docsDir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((name) => allowed.has(path.extname(name).toLowerCase()))
    .map((name) => {
      const full = path.join(docsDir, name)
      const st = fs.statSync(full)
      return {
        name,
        sizeBytes: st.size,
        modifiedAt: st.mtime.toISOString(),
        url: `/docs/${encodeURIComponent(name)}`
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return entries
}

module.exports = {
  getDocsDir,
  listDocs
}
