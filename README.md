# Graphi - Citation Network Visualization

A React-based interactive citation network visualization tool that displays academic papers and their citation relationships using D3.js.

## Development Standards & Guidelines

### 📁 Project Structure
```
src/
├── components/          # Reusable UI components
├── data/               # Static data files (deprecated - use public/data)
├── styles/             # Global CSS files
└── utils/              # Utility functions and helpers

public/
├── data/               # JSON data files for graphs
└── assets/             # Static assets (images, icons, etc.)
```

### 🏷️ Naming Conventions

#### **Files & Folders**
- **Components**: `PascalCase` (e.g., `Graph.js`, `GraphControls.js`)
- **CSS Files**: Match component name (e.g., `Graph.css`)
- **Utility Files**: `camelCase` (e.g., `dataParser.js`, `graphHelpers.js`)
- **Folders**: `lowercase` or `kebab-case` (e.g., `components`, `graph-utils`)
- **Data Files**: `lowercase` with descriptive names (e.g., `graph1.json`, `citation-network.json`)

#### **Variables & Functions**
- **Variables**: `camelCase` (e.g., `nodeRadius`, `citationCount`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `GRAPH_CONFIG`, `CATEGORY_COLORS`)
- **Functions**: `camelCase` with descriptive verbs (e.g., `createTooltip`, `setupNodeInteractions`)
- **Event Handlers**: Prefix with `handle` (e.g., `handleNodeClick`, `handleZoomIn`)
- **Boolean Variables**: Prefix with `is`, `has`, `can` (e.g., `isVisible`, `hasData`, `canZoom`)

#### **CSS Classes**
- **Component Classes**: `kebab-case` with component prefix (e.g., `.graph-container`, `.graph-node`)
- **State Classes**: Descriptive states (e.g., `.visible`, `.active`, `.disabled`)
- **Utility Classes**: Functional names (e.g., `.text-center`, `.margin-small`)

#### **React Components**
- **Props**: `camelCase` (e.g., `selectedFile`, `onNodeClick`)
- **State Variables**: `camelCase` (e.g., `isLoading`, `graphData`)
- **Custom Hooks**: Prefix with `use` (e.g., `useGraphData`, `useTooltip`)

### 🎨 CSS Standards

#### **Organization**
```css
/* 1. Component base styles */
.graph-container { }

/* 2. Element styles */
.graph-node { }
.graph-link { }

/* 3. State styles */
.graph-node:hover { }
.graph-node.active { }

/* 4. Responsive styles */
@media (max-width: 768px) { }
```

#### **Property Order**
1. **Positioning**: `position`, `top`, `right`, `bottom`, `left`, `z-index`
2. **Box Model**: `display`, `width`, `height`, `margin`, `padding`, `border`
3. **Visual**: `background`, `color`, `font`, `text-align`
4. **Animation**: `transition`, `transform`, `animation`

#### **Style Separation**
- **No Inline Styles**: All styling should be in CSS files
- **CSS Classes**: Use semantic class names over utility classes
- **CSS Variables**: Use for consistent theming and colors

### 🏗️ Code Organization

#### **Component Structure**
```javascript
// 1. Imports
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './ComponentName.css';

// 2. Constants
const COMPONENT_CONFIG = {
  // configuration objects
};

// 3. Helper functions (outside component)
const helperFunction = () => {
  // helper logic
};

// 4. Component definition
const ComponentName = ({ props }) => {
  // Component logic
};

// 5. Export
export default ComponentName;
```


### 🚀 Development Workflow

#### **Git Conventions**
- **Branch Names**: `initials/user_story` or `initials/bug`
- **Commit Messages**: `type: description` (e.g., `feat: add zoom controls`, `fix: tooltip positioning`)

#### **Code Quality**
- **No Console Logs**: Remove before committing (except error handling)
- **Error Handling**: Always include try-catch for async operations
- **Comments**: Use JSDoc for function documentation
- **Performance**: Avoid unnecessary re-renders and DOM manipulations

#### **README Updates**
- Keep this file updated with new conventions
- Document new components and their usage
- Include setup instructions for new developers

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Available Scripts

- `npm start` - Development server on http://localhost:3000
- `npm test` - Run test suite
- `npm run build` - Create production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
