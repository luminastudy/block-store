# @lumina-study/block-store

A Redux Toolkit store for managing `lumina.json` configurations from GitHub and GitLab repositories.

## Features

- 🔄 **Redux Toolkit Integration**: Modern Redux state management with built-in best practices
- 🌐 **Multi-Provider Support**: Fetch configurations from GitHub and GitLab repositories
- 📦 **TypeScript First**: Full TypeScript support with comprehensive type definitions
- 🔍 **Commit Tracking**: Automatically tracks the commit SHA for each configuration
- ✨ **Simple API**: Easy-to-use actions and selectors for managing configurations
- 🧪 **Well Tested**: Comprehensive test coverage with Vitest

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

### 2. Add a Block

```typescript
import { addBlock } from '@lumina-study/block-store'

// Fetch from GitHub
store.dispatch(
  addBlock({
    provider: 'github',
    organization: 'luminastudy',
    repository: 'my-project',
    token: 'optional-github-token', // For private repos
  })
)

// Fetch from GitLab
store.dispatch(
  addBlock({
    provider: 'gitlab',
    organization: 'my-group',
    repository: 'my-project',
    token: 'optional-gitlab-token', // For private repos
  })
)
```

### 3. Access Blocks

```typescript
import {
  selectAllBlocks,
  selectBlockByKey,
  selectBlocksByProvider,
} from '@lumina-study/block-store'

// Get all blocks
const allBlocks = selectAllBlocks(store.getState())

// Get specific block
const block = selectBlockByKey('github:luminastudy:my-project')(
  store.getState()
)

// Get all GitHub blocks
const githubBlocks = selectBlocksByProvider('github')(store.getState())
```

## API Reference

### Store Factory

#### `createBlockStore()`

Creates and configures a Redux store for managing blocks.

```typescript
import { createBlockStore } from '@lumina-study/block-store'

const store = createBlockStore()
```

### Actions

#### `addBlock(params: AddBlockParams)`

Async thunk that fetches a `lumina.json` file from a Git provider and adds it to the store.

**Parameters:**

- `provider`: `'github'` or `'gitlab'`
- `organization`: Organization or user name
- `repository`: Repository name
- `token?`: Optional authentication token for private repos

**Example:**

```typescript
import { addBlock } from '@lumina-study/block-store'

await store.dispatch(
  addBlock({
    provider: 'github',
    organization: 'luminastudy',
    repository: 'block-store',
  })
)
```

#### `removeBlock(key: string)`

Removes a block from the store by its key.

**Example:**

```typescript
import { removeBlock } from '@lumina-study/block-store'

store.dispatch(removeBlock('github:luminastudy:block-store'))
```

#### `clearBlocks()`

Clears all blocks from the store.

```typescript
import { clearBlocks } from '@lumina-study/block-store'

store.dispatch(clearBlocks())
```

#### `clearError()`

Clears any error state.

```typescript
import { clearError } from '@lumina-study/block-store'

store.dispatch(clearError())
```

### Selectors

#### `selectAllBlocks(state)`

Returns all blocks as an array.

```typescript
import { selectAllBlocks } from '@lumina-study/block-store'

const blocks = selectAllBlocks(store.getState())
```

#### `selectBlockByKey(key)(state)`

Returns a specific block by its key.

```typescript
import { selectBlockByKey } from '@lumina-study/block-store'

const block = selectBlockByKey('github:org:repo')(store.getState())
```

#### `selectBlocksByProvider(provider)(state)`

Returns all blocks for a specific provider.

```typescript
import { selectBlocksByProvider } from '@lumina-study/block-store'

const githubBlocks = selectBlocksByProvider('github')(store.getState())
```

#### `selectLoading(state)`

Returns the loading state.

```typescript
import { selectLoading } from '@lumina-study/block-store'

const isLoading = selectLoading(store.getState())
```

#### `selectError(state)`

Returns the current error message, if any.

```typescript
import { selectError } from '@lumina-study/block-store'

const error = selectError(store.getState())
```

### Types

```typescript
import type {
  GitProvider,
  LuminaConfig,
  BlockData,
  BlockIdentifier,
  BlockStoreState,
  AddBlockParams,
  BlockStore,
  RootState,
  AppDispatch,
} from '@lumina-study/block-store'
```

### Utilities

#### `generateBlockKey(provider, organization, repository)`

Generates a unique key for a block in the format `provider:organization:repository`.

```typescript
import { generateBlockKey } from '@lumina-study/block-store'

const key = generateBlockKey('github', 'luminastudy', 'block-store')
// Returns: "github:luminastudy:block-store"
```

#### `parseBlockKey(key)`

Parses a block key into its components.

```typescript
import { parseBlockKey } from '@lumina-study/block-store'

const { provider, organization, repository } = parseBlockKey(
  'github:luminastudy:block-store'
)
```

## Integration with React

```typescript
import { Provider, useDispatch, useSelector } from 'react-redux'
import {
  createBlockStore,
  addBlock,
  selectAllBlocks,
} from '@lumina-study/block-store'
import type { AppDispatch } from '@lumina-study/block-store'

const store = createBlockStore()

function App() {
  return (
    <Provider store={store}>
      <BlockManager />
    </Provider>
  )
}

function BlockManager() {
  const dispatch = useDispatch<AppDispatch>()
  const blocks = useSelector(selectAllBlocks)

  const handleAddBlock = () => {
    dispatch(
      addBlock({
        provider: 'github',
        organization: 'luminastudy',
        repository: 'my-project',
      })
    )
  }

  return (
    <div>
      <button onClick={handleAddBlock}>Add Block</button>
      <ul>
        {blocks.map(block => (
          <li key={`${block.provider}:${block.organization}:${block.repository}`}>
            {block.organization}/{block.repository} ({block.commitSha})
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Block Data Structure

Each block stored in the state has the following structure:

```typescript
interface BlockData {
  provider: 'github' | 'gitlab'
  organization: string
  repository: string
  commitSha: string
  config: LuminaConfig // The parsed lumina.json content
  addedAt: string // ISO timestamp
}
```

## Error Handling

The store handles errors gracefully and stores them in the state:

```typescript
import { selectError, selectLoading } from '@lumina-study/block-store'

const error = selectError(store.getState())
const loading = selectLoading(store.getState())

if (loading) {
  console.log('Loading...')
} else if (error) {
  console.error('Error:', error)
}
```

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

## Support

- 🐛 [Report a bug](https://github.com/luminastudy/block-store/issues)
- 💡 [Request a feature](https://github.com/luminastudy/block-store/issues)
- 📖 [Documentation](https://github.com/luminastudy/block-store#readme)
