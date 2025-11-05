# Copilot Instructions for Talaxy Blog

## Project Overview

This is a personal blog site built with **Docusaurus 2** that combines technical documentation, blog posts, a photo gallery, and several interactive web applications. The site is bilingual (primarily Chinese), uses TypeScript/React, and includes a custom Express.js backend for data management.

## Architecture

### Frontend Stack

-   **Framework**: Docusaurus 2 (React-based static site generator)
-   **Styling**:
    -   Tailwind CSS (configured with `preflight: false` to avoid conflicts with Docusaurus)
    -   styled-components for component-scoped styles
    -   CSS Modules for page-level styles
-   **TypeScript**: Strict mode enabled with `@tsconfig/docusaurus`
-   **Special Features**: Mermaid diagrams, KaTeX math rendering, MDX support

### Backend (Express Server)

-   Located in `server/` directory
-   Runs on port 4000 (configurable in `server/config.js`)
-   Environment-aware storage paths (dev vs production)
-   Modules: user auth, word-bank, weaver (project management), luoye (document editor - backend only)

### Key Applications (in `src/modules/`)

-   **ow**: Overwatch game companion app
-   **word-bank**: English vocabulary learning tool
-   **weaver**: Weekly task/project management system
-   **luoye**: Document workspace management (similar to Notion) - **Frontend deprecated**, migrated to separate repository; backend API still maintained in `server/modules/luoye/`
-   **tokenize**: English text tokenization tool
-   **gallery**: Photo gallery with date-based organization

## Critical Patterns

### Import Aliases

Always use the `@site/src` alias for absolute imports:

```tsx
import API from '@site/src/api';
import { Button } from '@site/src/components/Form';
```

### Page Structure

Pages in `src/pages/*.tsx` must wrap content in Docusaurus `<Layout>`:

```tsx
import Layout from '@theme/Layout';

const Page = () => <Layout title="Page Title">{/* Content */}</Layout>;
export default Page;
```

### Styled Components Convention

Use a `Container` wrapper pattern for styled root elements:

```tsx
import styled from 'styled-components';

const Container = styled.div`
    /* styles */
`;

const View = () => <Container>...</Container>;
```

### API Integration

The backend proxy is configured in `docusaurus.config.js` to route `/api/*` to `localhost:4000`. Frontend API calls use the centralized `src/api/index.ts` structure.

## Development Workflows

### Start Development

```bash
npm start              # Start Docusaurus dev server (port 3000)
npm run server         # Start Express backend (port 4000)
```

### Server Testing & Data Management

```bash
npm run test:server    # Run server tests
npm run data:update    # Update production data (requires NODE_ENV=production)
```

### Build & Deployment

```bash
npm run build          # Build static site
npm run type-check     # Run TypeScript validation
```

## File Organization

### Content Structure

-   `docs/`: Technical notes organized by topic (css, js, react, python, etc.)
-   `blog/`: Blog posts with frontmatter metadata
-   `gallery/`: Photo posts organized by year
-   `templates/`: Starter templates for new content

### Module Organization

Each major app in `src/modules/` follows this structure:

```
module-name/
├── index.tsx          # Entry point
├── components/        # UI components
├── models/            # Data models/types
├── utils/             # Helper functions
└── index.module.css   # Module-specific styles
```

### Server Structure

```
server/
├── index.js           # Express app setup
├── config.js          # Environment & path config
├── routes/            # REST API routes
├── modules/           # Feature modules (e.g., luoye/)
├── middlewares.js     # Auth & request middlewares
└── utils.js           # Server utilities
```

## Data Storage (Server)

### Environment-Aware Paths

-   **Development**: Files stored in `temp/` and `dev/` directories
-   **Production**: Files stored in `/home/ubuntu/storage/`
-   Managed by `Dir` object in `server/config.js`

### User Authentication

-   JWT-based with cookie support
-   Middleware: `login` (required) and `weakLogin` (optional)
-   User config: `dev/user.json` (dev) or production path

### Application Data

-   **Weaver**: JSON files in `projects/` directory, cycle-based task management
-   **Luoye**: Workspace/document system in `luoye/` subdirectories
-   **Word Bank**: User vocabulary stored per-user

## Special Considerations

### Docusaurus Specifics

-   Use `@docusaurus/plugin-content-docs` for multi-instance docs (see `gallery` plugin)
-   Sidebar configs are in `templates/sidebars.js`
-   i18n files in `i18n/zh-cn/` for Chinese translations
-   Use `<!-- -->` for comments in MDX files

### Styling Conflicts

-   Tailwind's `preflight` is disabled to prevent CSS reset conflicts
-   Mix Tailwind utility classes with styled-components for complex components
-   CSS custom properties (e.g., `--theme-color`) are used for theming

### Component Patterns

-   Form components in `src/components/Form/` (Button, Input, Select, etc.)
-   Use `Spacer` component for flex layouts: `<Spacer />` for `flex-grow: 1`
-   Higher-order components follow TypeScript generic patterns (see `blog/2022-04-22-hoc-in-ts.md`)

### Server API Design

-   RESTful routes with clear resource hierarchy
-   Consistent error handling: `res.error` and `res.message` for error middleware
-   Parameter validation at route entry with descriptive error messages
-   Access control: Scope system (Private/Member/Public) + Access levels (Forbidden/Visitor/Member/Admin)

## Version Management

When releasing new versions, update:

1. `src/pages/changelog.md`
2. `README.md`
3. `package.json`
4. Module-specific changelogs (e.g., `src/modules/ow/docs/CHANGELOG.md`)

Commit with message: `Release: vX.Y.Z` and create GitHub release with matching tag.

### Development Constraints

-   **Do not** create new documentation files without explicit developer instructions
-   **Do not** add unit tests unless specifically requested by developers
-   Focus on code implementation and bug fixes rather than expanding project artifacts

## Common Tasks

### Adding a New Application Module

1. Create directory in `src/modules/new-app/`
2. Add page in `src/pages/new-app.tsx` with Layout wrapper
3. If backend needed: add router in `server/routes/` and register in `server/index.js`
4. Add API interface in `src/api/new-app.ts` and export from `src/api/index.ts`

### Adding Documentation

-   Technical notes: Add to `docs/[category]/`
-   Blog posts: Add to `blog/` with YYYY-MM-DD prefix
-   Gallery posts: Add to `gallery/YYYY/` with date-based naming
-   Update `_category_.json` for sidebar ordering

### Working with Styles

-   Page-level: Use CSS Modules (`*.module.css`)
-   Component-level: Use styled-components
-   Utility classes: Use Tailwind (components/pages only, not in docs/blog)
-   Global overrides: Use Docusaurus custom CSS in `src/css/custom.css`
