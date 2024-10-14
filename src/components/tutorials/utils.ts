import { Meta, Step } from './models'

export function getMetaData(): Meta[] {
  const context = require.context('@site/tutorials/', true)

  const meta = context
    .keys()
    .filter((key) => key.endsWith('meta.json'))
    .map((key) => {
      const [_, tutorial, file] = key.split('/')

      // If the file is not in a tutorial directory, ignore it
      if (file === undefined) {
        return null
      }

      const meta = context(key)
      meta.id = tutorial
      return meta
    })
    .filter((meta) => meta !== null)
    .map((meta) => Meta.parse(meta))

  return meta
}

// Get the sorted steps for a tutorial with the given id
export function getSteps(id: string): Step[] {
  console.log(id)
  const context = require.context('@site/tutorials/', true)

  // Filter to ones that are in the `tutorialname` dir
  const steps = context
    .keys()
    .filter((key) => key.includes(id) && key.endsWith('md'))
    .map((key) => [key, context(key)])
    .map(([path, mdFile]) =>
      Step.parse({ ...mdFile.frontMatter, path: pathToHistory(path) })
    )

  steps.sort((a, b) => a.position - b.position)

  return steps
}

function pathToHistory(path: string): string {
  let stepPath = path.split('/')
  let [_, tutorial, file] = stepPath
  file = file === 'index.md' ? '' : file.replace('.md', '')

  return `/tutorials/${tutorial}/${file}`
}
