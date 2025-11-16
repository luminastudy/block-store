# @lumina-study/block-store

A Redux Toolkit store for managing `lumina.json` files from GitHub and GitLab repositories. Block types are defined by [`@lumina-study/block-schema`](https://www.npmjs.com/package/@lumina-study/block-schema) (single source of truth).

## Features

- 🔄 **Redux Toolkit Integration**: Modern Redux state management with built-in best practices
- 📋 **Block Schema Compliance**: Uses `@lumina-study/block-schema` as the single source of truth for block types
- 🌐 **Multi-Provider Support**: Fetch lumina.json files from GitHub and GitLab repositories
- 📦 **TypeScript First**: Full TypeScript support with comprehensive type definitions
- 🔍 **Commit Tracking**: Automatically tracks the commit SHA for each lumina.json source
- ✨ **Simple API**: Easy-to-use actions and selectors for managing sources and accessing blocks
- 🧪 **Well Tested**: 24 tests passing with comprehensive coverage

## What is lumina.json?

A `lumina.json` file contains an array of blocks following the [`@lumina-study/block-schema`](https://www.npmjs.com/package/@lumina-study/block-schema) specification. This package manages the retrieval and storage of these files from Git repositories.

## Installation

```bash
npm install @lumina-study/block-store
# or
pnpm add @lumina-study/block-store
# or
yarn add @lumina-study/block-store
```

## Quick Start

### 1. Create the Store

```typescript
import { createBlockStore } from '@lumina-study/block-store'

const store = createBlockStore()
```

### 2. Add a lumina.json Source

```typescript
import { addLuminaJson } from '@lumina-study/block-store'

// Fetch from GitHub
await store.dispatch(
  addLuminaJson({
    provider: 'github',
    organization: 'luminastudy',
    repository: 'my-project',
    token: 'optional-github-token', // For private repos
  })
)

// Fetch from GitLab
await store.dispatch(
  addLuminaJson({
    provider: 'gitlab',
    organization: 'my-group',
    repository: 'my-project',
    token: 'optional-gitlab-token', // For private repos
  })
)
```

### 3. Access Data

```typescript
import {
  selectAllSources,
  selectAllBlocks,
  selectBlockById,
  selectBlocksFromSource,
} from '@lumina-study/block-store'

// Get all lumina.json sources
const sources = selectAllSources(store.getState())

// Get all blocks from all sources (flattened)
const allBlocks = selectAllBlocks(store.getState())

// Get a specific block by ID across all sources
const block = selectBlockById('block-uuid')(store.getState())

// Get blocks from a specific source
const sourceBlocks = selectBlocksFromSource('github:luminastudy:my-project')(
  store.getState()
)
```

## API Reference

### Store Factory

#### `createBlockStore()`

Creates and configures a Redux store for managing lumina.json sources.

```typescript
import { createBlockStore } from '@lumina-study/block-store'

const store = createBlockStore()
```

**Returns**: `BlockStore` - Configured Redux store

### Actions

#### `addLuminaJson(params: AddLuminaJsonParams)`

Async thunk that fetches a `lumina.json` file from a Git provider and adds it to the store.

**Parameters:**

```typescript
interface AddLuminaJsonParams {
  provider: 'github' | 'gitlab'
  organization: string // Organization or user name
  repository: string // Repository name
  token?: string // Optional auth token for private repos
}
```

**Example:**

```typescript
import { addLuminaJson } from '@lumina-study/block-store'

await store.dispatch(
  addLuminaJson({
    provider: 'github',
    organization: 'luminastudy',
    repository: 'block-store',
  })
)
```

**Behavior:**

- Fetches `lumina.json` from the repository root
- Validates that the file contains a `blocks` array
- Stores the source with provider, org, repo, commitSha, and content
- Tracks when the source was added

#### `removeLuminaJson(key: string)`

Removes a lumina.json source from the store by its key.

**Example:**

```typescript
import { removeLuminaJson } from '@lumina-study/block-store'

store.dispatch(removeLuminaJson('github:luminastudy:block-store'))
```

#### `clearSources()`

Clears all lumina.json sources from the store.

```typescript
import { clearSources } from '@lumina-study/block-store'

store.dispatch(clearSources())
```

#### `clearError()`

Clears any error state.

```typescript
import { clearError } from '@lumina-study/block-store'

store.dispatch(clearError())
```

### Selectors

#### `selectAllSources(state)`

Returns all lumina.json sources as an array.

```typescript
import { selectAllSources } from '@lumina-study/block-store'

const sources = selectAllSources(store.getState())
// Returns: LuminaJsonSource[]
```

**Returns:**

```typescript
interface LuminaJsonSource {
  provider: 'github' | 'gitlab'
  organization: string
  repository: string
  commitSha: string
  luminaJson: LuminaJson // Contains blocks array
  addedAt: string // ISO timestamp
}
```

#### `selectSourceByKey(key)(state)`

Returns a specific source by its key.

```typescript
import { selectSourceByKey } from '@lumina-study/block-store'

const source = selectSourceByKey('github:luminastudy:my-project')(
  store.getState()
)
```

**Key Format**: `"provider:organization:repository"`

#### `selectSourcesByProvider(provider)(state)`

Returns all sources for a specific Git provider.

```typescript
import { selectSourcesByProvider } from '@lumina-study/block-store'

const githubSources = selectSourcesByProvider('github')(store.getState())
const gitlabSources = selectSourcesByProvider('gitlab')(store.getState())
```

#### `selectAllBlocks(state)`

Returns all blocks from all sources (flattened).

```typescript
import { selectAllBlocks } from '@lumina-study/block-store'

const allBlocks = selectAllBlocks(store.getState())
// Returns: Block[]
```

**Returns:**

```typescript
interface Block {
  id: string // UUID
  title: {
    he_text: string
    en_text: string
  }
  prerequisites: string[] // Array of block IDs
  parents: string[] // Array of block IDs
  [key: string]: unknown // Additional properties
}
```

#### `selectBlocksFromSource(sourceKey)(state)`

Returns blocks from a specific source.

```typescript
import { selectBlocksFromSource } from '@lumina-study/block-store'

const blocks = selectBlocksFromSource('github:luminastudy:my-project')(
  store.getState()
)
```

#### `selectBlockById(blockId)(state)`

Finds a block by ID across all sources.

```typescript
import { selectBlockById } from '@lumina-study/block-store'

const block = selectBlockById('550e8400-e29b-41d4-a716-446655440000')(
  store.getState()
)
// Returns: Block | undefined
```

#### `selectLoading(state)`

Returns the loading state.

```typescript
import { selectLoading } from '@lumina-study/block-store'

const isLoading = selectLoading(store.getState())
// Returns: boolean
```

#### `selectError(state)`

Returns the current error message, if any.

```typescript
import { selectError } from '@lumina-study/block-store'

const error = selectError(store.getState())
// Returns: string | null
```

### Types

All TypeScript types are exported for use in your application:

```typescript
import type {
  // Core types
  GitProvider,
  Block,
  LuminaJson,
  LuminaJsonSource,

  // State types
  BlockStoreState,

  // Parameter types
  AddLuminaJsonParams,

  // Store types
  BlockStore,
  RootState,
  AppDispatch,
} from '@lumina-study/block-store'
```

### Utilities

#### `generateSourceKey(provider, organization, repository)`

Generates a unique key for a lumina.json source.

```typescript
import { generateSourceKey } from '@lumina-study/block-store'

const key = generateSourceKey('github', 'luminastudy', 'block-store')
// Returns: "github:luminastudy:block-store"
```

#### `parseSourceKey(key)`

Parses a source key into its components.

```typescript
import { parseSourceKey } from '@lumina-study/block-store'

const { provider, organization, repository } = parseSourceKey(
  'github:luminastudy:block-store'
)
```

### Services (Advanced)

For advanced use cases, you can access the underlying services directly:

```typescript
import {
  fetchLuminaJsonFromGitHub,
  fetchLuminaJsonFromGitLab,
} from '@lumina-study/block-store'

// Fetch directly without Redux
const { luminaJson, commitSha } = await fetchLuminaJsonFromGitHub(
  'luminastudy',
  'my-project'
)
```

## Integration with React

```typescript
import { Provider, useDispatch, useSelector } from 'react-redux'
import {
  createBlockStore,
  addLuminaJson,
  selectAllSources,
  selectAllBlocks,
  selectBlockById,
} from '@lumina-study/block-store'
import type { AppDispatch } from '@lumina-study/block-store'

const store = createBlockStore()

function App() {
  return (
    <Provider store={store}>
      <LuminaJsonManager />
    </Provider>
  )
}

function LuminaJsonManager() {
  const dispatch = useDispatch<AppDispatch>()
  const sources = useSelector(selectAllSources)
  const allBlocks = useSelector(selectAllBlocks)

  const handleAddSource = () => {
    dispatch(
      addLuminaJson({
        provider: 'github',
        organization: 'luminastudy',
        repository: 'my-project',
      })
    )
  }

  return (
    <div>
      <button onClick={handleAddSource}>Add Source</button>

      <h2>Sources ({sources.length})</h2>
      <ul>
        {sources.map(source => (
          <li key={`${source.provider}:${source.organization}:${source.repository}`}>
            {source.organization}/{source.repository}
            ({source.luminaJson.blocks.length} blocks, SHA: {source.commitSha.substring(0, 7)})
          </li>
        ))}
      </ul>

      <h2>All Blocks ({allBlocks.length})</h2>
      <ul>
        {allBlocks.map(block => (
          <li key={block.id}>
            {block.title.en_text} / {block.title.he_text}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Data Structure

### State Shape

```typescript
{
  luminaJson: {
    sources: {
      "github:luminastudy:my-project": {
        provider: "github",
        organization: "luminastudy",
        repository: "my-project",
        commitSha: "abc123...",
        luminaJson: {
          blocks: [
            {
              id: "550e8400-e29b-41d4-a716-446655440000",
              title: {
                he_text: "בלוק לדוגמה",
                en_text: "Example Block"
              },
              prerequisites: [],
              parents: []
            }
          ]
        },
        addedAt: "2024-01-01T00:00:00.000Z"
      }
    },
    loading: false,
    error: null
  }
}
```

### lumina.json File Format

```json
{
  "blocks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": {
        "he_text": "בלוק לדוגמה",
        "en_text": "Example Block"
      },
      "prerequisites": ["another-block-uuid"],
      "parents": ["parent-block-uuid"]
    }
  ]
}
```

## Error Handling

The store handles errors gracefully and stores them in the state:

```typescript
import {
  selectError,
  selectLoading,
  clearError,
} from '@lumina-study/block-store'

const error = selectError(store.getState())
const loading = selectLoading(store.getState())

if (loading) {
  console.log('Loading...')
} else if (error) {
  console.error('Error:', error)
  // Clear the error
  store.dispatch(clearError())
}
```

## Block Schema

Blocks follow the [`@lumina-study/block-schema`](https://www.npmjs.com/package/@lumina-study/block-schema) specification (v0.1):

- **id**: Unique identifier (UUID format)
- **title**: Object with `he_text` (Hebrew) and `en_text` (English)
- **prerequisites**: Array of prerequisite block IDs (UUIDs)
- **parents**: Array of parent block IDs (UUIDs)
- Additional custom properties are allowed

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Build
pnpm build

# Lint
pnpm lint

# Format
pnpm format
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT © Lumina Study

## Related Packages

- [`@lumina-study/block-schema`](https://www.npmjs.com/package/@lumina-study/block-schema) - JSON Schema for Lumina Study block objects (single source of truth)

## Support

- 🐛 [Report a bug](https://github.com/luminastudy/block-store/issues)
- 💡 [Request a feature](https://github.com/luminastudy/block-store/issues)
- 📖 [Documentation](https://github.com/luminastudy/block-store#readme)
