/**
 * Example: Fetch and display blocks from the-open-university-combinatorics repository
 *
 * This example demonstrates how to use the block-store package to fetch
 * lumina.json from a GitHub repository and access its contents.
 */

import { createBlockStore } from '../src/store/createBlockStore.js'
import { addLuminaJson } from '../src/slices/addLuminaJson.js'
import { selectAllBlocks } from '../src/slices/selectors/selectAllBlocks.js'
import { selectAllSources } from '../src/slices/selectors/selectAllSources.js'

async function main() {
  // 1. Create the Redux store
  const store = createBlockStore()

  console.log('📦 Fetching lumina.json from GitHub...\n')

  // 2. Dispatch the action to fetch lumina.json
  const resultAction = await store.dispatch(
    addLuminaJson({
      provider: 'github',
      organization: 'luminastudy',
      repository: 'the-open-university-combinatorics',
      // token: undefined // No token needed for public repos
    })
  )

  // 3. Check if the fetch was successful
  if (addLuminaJson.rejected.match(resultAction)) {
    console.error('❌ Failed to fetch:', resultAction.payload)
    return
  }

  console.log('✅ Successfully fetched lumina.json!\n')

  // 4. Get the current state
  const state = store.getState()

  // 5. Access all sources
  const sources = selectAllSources(state)
  console.log(`📚 Total sources: ${sources.length}`)

  if (sources.length > 0) {
    const source = sources[0]
    console.log(`   Provider: ${source.provider}`)
    console.log(`   Repository: ${source.organization}/${source.repository}`)
    console.log(`   Commit SHA: ${source.commitSha}`)
    console.log(`   Added at: ${source.addedAt}\n`)
  }

  // 6. Access all blocks
  const blocks = selectAllBlocks(state)
  console.log(`🧱 Total blocks: ${blocks.length}\n`)

  // 7. Display the first 5 blocks
  console.log('First 5 blocks:\n')
  blocks.slice(0, 5).forEach((block, index) => {
    console.log(`${index + 1}. ${block.title.en_text}`)
    console.log(`   ${block.title.he_text}`)
    console.log(`   ID: ${block.id}`)
    console.log(`   Prerequisites: ${block.prerequisites.length}`)
    console.log(`   Parents: ${block.parents.length}`)
    console.log()
  })

  // 8. Find blocks by criteria
  const rootBlocks = blocks.filter(block => block.parents.length === 0)
  console.log(`\n🌳 Root blocks (no parents): ${rootBlocks.length}`)
  rootBlocks.forEach(block => {
    console.log(`   - ${block.title.en_text}`)
  })

  // 9. Find blocks with prerequisites
  const blocksWithPrerequisites = blocks.filter(
    block => block.prerequisites.length > 0
  )
  console.log(
    `\n📋 Blocks with prerequisites: ${blocksWithPrerequisites.length}/${blocks.length}`
  )
}

main().catch(console.error)
