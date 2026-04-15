# 🤝 Contributing to SnapPass AI

Thank you for your interest in contributing to **SnapPass AI**!

This project is fully open-source and welcoming to everyone — whether you're fixing a typo, writing code, improving documentation, or proposing a new feature. **Every contribution makes a difference.**

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Who Can Contribute?](#who-can-contribute)
3. [Ways to Contribute](#ways-to-contribute)
4. [Project Architecture Overview](#project-architecture-overview)
5. [Development Setup](#development-setup)
6. [Contribution Workflow](#contribution-workflow)
7. [Branch Naming Guide](#branch-naming-guide)
8. [Commit Message Guide](#commit-message-guide)
9. [Pull Request Guide](#pull-request-guide)
10. [Coding Standards](#coding-standards)
11. [Priority Tasks for Contributors](#priority-tasks-for-contributors)
12. [Reporting Bugs](#reporting-bugs)
13. [Requesting Features](#requesting-features)
14. [Getting Help](#getting-help)

---

## 📜 Code of Conduct

By contributing, you agree to the following:

- Be **respectful and inclusive** to all contributors
- Use **constructive and kind** language in reviews and discussions
- Welcome newcomers — everyone starts somewhere
- Focus on **what is best for the project and community**
- **Zero tolerance** for harassment, discrimination, or abuse

If you witness unacceptable behaviour, please open an issue or contact the project admin directly.

---

## 🙋 Who Can Contribute?

**Everyone is welcome.** Seriously.

- 🌱 **Beginners** — Fix typos, improve docs, add code comments
- 🧑‍💻 **Frontend devs** — React components, CSS, accessibility
- 🛠️ **Backend devs** — Express controllers, API routes, middleware
- 🐍 **Python devs** — OpenCV, Pillow, rembg AI processing
- 📐 **Designers** — UI/UX improvements, icons, mockups
- 🧪 **Testers** — Write tests, find bugs, test on different devices
- ✍️ **Writers** — Documentation, guides, tutorials

---

## 💡 Ways to Contribute

| Type | Examples |
|------|---------|
| 🐞 Bug Fix | Fix broken UI, incorrect API responses |
| ✨ New Feature | Add a new photo size preset, improve face detection |
| 📝 Documentation | Improve README, add code comments, write tutorials |
| ♿ Accessibility | Improve keyboard nav, ARIA labels, screen reader support |
| 🎨 UI/UX | Improve layouts, responsiveness, colour contrast |
| 🧪 Tests | Add unit tests for components or backend controllers |
| 🔧 Refactoring | Improve code quality without changing behaviour |
| 🌐 i18n | Add multi-language support |
| 🐳 DevOps | Docker setup, CI/CD, deploy scripts |

---

## 🏗️ Project Architecture Overview

Before you start, understand how the three layers talk to each other:

```
Browser (React)
    │
    │  HTTP (fetch / axios)
    ▼
Express Backend (Node.js) ← port 5000
    │
    │  HTTP (axios)
    ▼
Python AI Service (Flask) ← port 8000
```

### Frontend (`frontend/`)

Built with **React.js** and plain **CSS** (no Tailwind, no CSS-in-JS).

- Each component lives in its own `.js` + `.css` pair
- State is managed with React hooks (`useState`, `useCallback`)
- Custom hooks live in `src/hooks/`
- All API calls funnel through `src/services/photoService.js`
- Routing is handled by `react-router-dom` in `src/routes/AppRoutes.js`

### Backend (`backend/`)

Built with **Node.js + Express**.

- Routes → Controllers → Services pattern
- File uploads handled by **Multer**
- All images forwarded to the Python service via Axios
- MongoDB integration is planned but not yet built

### Python AI Service (`python-ai-service/`)

Built with **Flask**.

- `bg_remove.py` — background removal using `rembg`
- `face_center.py` — face detection & centering using OpenCV
- `dpi_optimizer.py` — resize to correct DPI for the selected preset
- `sheet_generator.py` — arrange photos on an A4 canvas using Pillow

---

## 🛠️ Development Setup

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 | [nodejs.org](https://nodejs.org) |
| Python | ≥ 3.9 | [python.org](https://python.org) |
| Git | any | [git-scm.com](https://git-scm.com) |

### Step 1 — Fork & Clone

```bash
# 1. Click "Fork" on GitHub (top-right corner)

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/SnapPass-AI.git
cd SnapPass-AI
```

### Step 2 — Add Upstream Remote

```bash
git remote add upstream https://github.com/souma9830/SnapPass-AI.git
```

This lets you pull future updates from the main repo.

### Step 3 — Run the Frontend

```bash
cd frontend
npm install
npm start
# Opens http://localhost:3000
```

### Step 4 — Run the Backend *(optional)*

```bash
cd backend
npm install
npm run dev
# Runs http://localhost:5000
```

### Step 5 — Run the Python AI Service *(optional)*

```bash
cd python-ai-service

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

pip install -r requirements.txt
python main.py
# Runs http://localhost:8000
```

> **Tip:** You don't need the backend or Python service to work on frontend. The frontend has simulated placeholders for all API calls.

---

## 🔄 Contribution Workflow

Follow these steps every time you want to contribute:

```bash
# 1. Sync your fork with the latest changes
git checkout master
git pull upstream master

# 2. Create a new branch for your work
git checkout -b feature/your-feature-name

# 3. Make your changes
# ... write code ...

# 4. Stage and commit your changes
git add .
git commit -m "feat: add support for Brazil passport photo size"

# 5. Push your branch to your fork
git push origin feature/your-feature-name

# 6. Open a Pull Request on GitHub
# Go to: https://github.com/souma9830/SnapPass-AI/pulls
# Click "New Pull Request" and select your branch
```

---

## 🌿 Branch Naming Guide

Use this format: `type/short-description`

| Type | When to use | Example |
|------|------------|---------|
| `feature/` | Adding new functionality | `feature/brazil-photo-size` |
| `fix/` | Fixing a bug | `fix/upload-error-message` |
| `docs/` | Documentation only | `docs/improve-readme` |
| `style/` | CSS or UI changes only | `style/navbar-mobile-fix` |
| `refactor/` | Code improvement, no behaviour change | `refactor/photo-service-hook` |
| `test/` | Adding or fixing tests | `test/upload-component` |
| `chore/` | Build scripts, config, dependencies | `chore/update-packages` |

---

## ✍️ Commit Message Guide

We follow the **Conventional Commits** standard. This keeps the git history clean and readable.

### Format

```
type(scope): short description

Optional longer description explaining WHY, not WHAT.
```

### Types

| Type | Use for |
|------|---------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, CSS (no logic change) |
| `refactor` | Code restructuring |
| `test` | Adding or fixing tests |
| `chore` | Maintenance, build scripts |

### Good Examples

```bash
git commit -m "feat(editor): add real-time background colour preview"
git commit -m "fix(upload): show correct error when file exceeds 10MB"
git commit -m "docs(readme): add Python AI service setup instructions"
git commit -m "style(navbar): fix mobile menu overflow on small screens"
```

### Bad Examples ❌

```bash
git commit -m "fix"
git commit -m "changes"
git commit -m "updated stuff"
```

---

## 📬 Pull Request Guide

### Before Opening a PR

- [ ] Your branch is up to date with `master`
- [ ] Your code runs without errors
- [ ] You tested your changes in the browser
- [ ] You haven't introduced unnecessary `console.log` statements
- [ ] CSS changes are responsive (check on mobile)
- [ ] You've added comments for complex logic

### PR Title Format

Same as commit message format:

```
feat(print-page): add download as PDF option
fix(editor): prevent crash when photo is not uploaded
docs: improve getting started section in README
```

### PR Description Template

When you open a PR, please fill in:

```markdown
## What does this PR do?
Brief description of the change.

## Why is this change needed?
Link to issue: Closes #123

## Screenshots (if UI change)
Before | After
--- | ---
screenshot | screenshot

## Checklist
- [ ] Tested in browser
- [ ] No console errors
- [ ] Mobile responsive (if UI)
- [ ] Code is commented where needed
```

### Review Process

1. A maintainer will review your PR within a few days
2. They may suggest changes — please respond and update your branch
3. Once approved, it will be merged to `master`
4. Your name will appear in the contributors list 🎉

---

## 📐 Coding Standards

### JavaScript / React

- Use **functional components** with hooks (no class components)
- Each component must have **its own `.js` + `.css` file**
- Use **descriptive variable names** (`uploadedFile` not `uf`)
- Add a **JSDoc comment block** at the top of every component and function
- Keep components **focused**: if it does too much, split it
- Don't import from `../../../../../../` — keep imports relative and clean
- Use `const` by default, `let` only when reassignment is needed

```js
// ✅ Good
/**
 * UploadBox — drag and drop photo uploader.
 * Props: onFileSelect(file)
 */
function UploadBox({ onFileSelect }) { ... }

// ❌ Bad
function C(p) { ... }
```

### CSS

- **No Tailwind**, no CSS-in-JS — plain CSS only
- Use the **CSS variables** defined in `index.css` (e.g. `var(--color-primary)`)
- Never use **hardcoded hex colours** — always reference design tokens
- All CSS files must be **scoped to their component** (e.g. `.upload-box {}`)
- Always include **responsive styles** with `@media (max-width: 768px)`

```css
/* ✅ Good — uses design tokens, scoped class names */
.upload-box {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg);
}

/* ❌ Bad — hardcoded values, generic class name */
.box {
  border: 2px dashed #ccc;
  border-radius: 10px;
  background: #f8f8f8;
}
```

### Python

- Follow **PEP 8** style guidelines
- Add a **docstring** to every function
- Import only what you need
- Use type hints where possible
- Return `None` and print a warning rather than crashing if a dependency is missing

```python
# ✅ Good
def remove_background(image_path: str) -> Image:
    """
    Removes the background from the given image using rembg.
    Returns a Pillow Image object with transparent background.
    """
    ...
```

---

## 🎯 Priority Tasks for Contributors

These are the most impactful areas where contributors are needed right now:

### 🔴 High Priority (Python AI Service)

| Task | File | Description |
|------|------|-------------|
| Background Removal | `python-ai-service/app/services/bg_remove.py` | Implement `remove_background()` using `rembg` |
| Face Detection | `python-ai-service/app/services/face_center.py` | Implement `detect_face_and_center()` with OpenCV |
| DPI Resize | `python-ai-service/app/services/dpi_optimizer.py` | Implement `resize_passport_photo()` using Pillow |
| A4 Sheet Layout | `python-ai-service/app/services/sheet_generator.py` | Implement `generate_a4_sheet()` using Pillow |
| Flask App Entry | `python-ai-service/main.py` | Create Flask app with `/process` and `/generate-sheet` routes |

### 🟡 Medium Priority (Backend)

| Task | File | Description |
|------|------|-------------|
| Image Processing | `backend/src/controllers/image.controller.js` | Wire up real AI service calls |
| Print Sheet | `backend/src/controllers/print.controller.js` | Stream real sheet from AI service |
| MongoDB Integration | `backend/src/models/` | Create Mongoose models for `Upload`, `Session` |

### 🟢 Good First Issues (Frontend)

| Task | File | Description |
|------|------|-------------|
| Progress Bar | `src/components/UploadBox.js` | Show upload progress percentage |
| Error Toast | `src/components/` | Create a global toast notification component |
| Admin Stats | `src/pages/AdminDashboard.js` | Connect stats to real API once backend is ready |
| Sidebar | `src/components/layout/Sidebar.js` | Build collapsible sidebar for editor |
| Dark Mode | `src/index.css` | Add `prefers-color-scheme: dark` styles |

---

## 🐞 Reporting Bugs

Found a bug? Please help us fix it!

1. **Search existing issues** first — it might already be reported
2. If not, [open a new issue](https://github.com/souma9830/SnapPass-AI/issues/new)
3. Use this format:

```markdown
**Bug description:**
[What happened?]

**Steps to reproduce:**
1. Go to...
2. Click...
3. See error...

**Expected behaviour:**
[What should happen?]

**Screenshots:**
[If applicable]

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 123]
- Node version: [e.g. v20.0.0]
```

---

## 💡 Requesting Features

Have an idea? [Open a feature request](https://github.com/souma9830/SnapPass-AI/issues/new).

Please include:
- **What** you want
- **Why** it would be useful
- Any **examples** or mockups

---

## 🆘 Getting Help

Stuck? Not sure where to start?

- 💬 Open a [Discussion](https://github.com/souma9830/SnapPass-AI/discussions) on GitHub
- 🐞 Open an [Issue](https://github.com/souma9830/SnapPass-AI/issues) if something is broken
- 📧 Reach the project admin: [@souma9830](https://github.com/souma9830)

---

## 🏅 Recognition

All contributors are listed in the **Contributors** section on the GitHub repository page.

Significant contributors may be added to the project README as **Core Contributors**.

---

<div align="center">

**Thank you for making SnapPass AI better! 🙌**

[⭐ Star the repo](https://github.com/souma9830/SnapPass-AI) · [🐞 Report a Bug](https://github.com/souma9830/SnapPass-AI/issues) · [💡 Request a Feature](https://github.com/souma9830/SnapPass-AI/issues)

</div>
