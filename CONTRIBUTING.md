# 🤝 Contributing to SnapPass AI

<div align="center">
  <img src="https://img.shields.io/badge/GSSoC-Participant-orange?style=for-the-badge&logo=appveyor" alt="GSSoC Participant" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red?style=for-the-badge" alt="Open Source Love" />
  <img src="https://img.shields.io/badge/Frontend-React.js-61dafb?logo=react&style=for-the-badge" alt="Made with React" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&style=for-the-badge" alt="Node.js" />
  <img src="https://img.shields.io/badge/AI%20Service-Python-3776ab?logo=python&style=for-the-badge" alt="Python" />
</div>

<br/>

Welcome to **SnapPass AI**! We are incredibly excited to have you here. This project is proudly participating in the **GirlScript Summer of Code (GSSoC)** program, and is fully open-source and welcoming to everyone.

As the Project Admin, my goal is to ensure you have the best possible open-source experience. This repository is structured to help you learn, build, and earn maximum points while contributing to a real-world, AI-powered application. Whether you are fixing a typo, writing code, improving documentation, or proposing a new feature — **every contribution makes a massive difference.**

---

## 🌟 Why Contribute to SnapPass AI?

- **Real-World Impact:** Build an application that solves a real problem (automated, studio-quality passport photo generation).
- **Modern Tech Stack:** Gain hands-on experience with **React.js, Node.js, Express, Python, Flask, and AI/OpenCV**.
- **Mentorship & Growth:** Get your code reviewed with constructive, helpful feedback from maintainers.
- **GSSoC Points & Recognition:** Issues are strictly labeled by difficulty to help you climb the GSSoC leaderboard! You will also be featured in our Contributors section.

---

## 📋 Table of Contents

1. [🏅 GSSoC Point System & Labels](#-gssoc-point-system--labels)
2. [🙋 Who Can Contribute?](#-who-can-contribute)
3. [🚀 The 5-Stage Contribution Roadmap](#-the-5-stage-contribution-roadmap)
4. [🏗️ Project Architecture Overview](#️-project-architecture-overview)
5. [🛠️ Detailed Development Setup](#️-detailed-development-setup)
6. [🔄 Step-by-Step Contribution Workflow](#-step-by-step-contribution-workflow)
7. [🌿 Branch & Commit Guidelines](#-branch--commit-guidelines)
8. [📬 Pull Request Guide](#-pull-request-guide)
9. [📐 Coding Standards](#-coding-standards)
10. [🎯 Priority Tasks for Contributors](#-priority-tasks-for-contributors)
11. [🐞 Reporting Bugs & Requesting Features](#-reporting-bugs--requesting-features)
12. [🆘 Getting Help & Code of Conduct](#-getting-help--code-of-conduct)

---

## 🏅 GSSoC Point System & Labels

To ensure points are awarded correctly, we follow a strict labeling system for all PRs. 

### 1. Difficulty Labels (Choose ONLY ONE)
Every PR must have one difficulty label.
*   `level:beginner` → very easy fixes, typo fixes, simple UI changes
*   `level:intermediate` → moderate feature/fix, API integration, medium logic
*   `level:advanced` → complex features, architecture changes, optimization
*   `level:critical` → major system/security/core changes

**Example:**
*   Small README update → `level:beginner`
*   Authentication system → `level:advanced`

### 2. Quality Labels (Optional)
Add if the PR quality is good. Do NOT add both together normally. Choose one if deserved.
*   `quality:clean` → well-structured code
*   `quality:exceptional` → outstanding work

### 3. Type Labels (Optional but Recommended)
These give bonus points. Use according to the work done:
*   `type:docs`
*   `type:testing`
*   `type:accessibility`
*   `type:design`
*   `type:performance`
*   `type:refactor`
*   `type:devops`
*   `type:security`
*   `type:bug`
*   `type:feature`

**Examples:**
*   New dashboard → `type:feature`
*   README improvement → `type:docs`
*   Speed optimization → `type:performance`

*You can add multiple type labels if valid.*

### 4. Validation Labels (VERY IMPORTANT)
These decide whether points count.

**Valid PR**
Add:
*   `gssoc:approved`

**Invalid PR**
Use only if necessary. If you add any invalid/spam label, the contributor gets 0 points:
*   `gssoc:invalid`
*   `gssoc:spam`
*   `gssoc:ai slop`

### 5. Mentor Label
If mentors review PRs, this gives mentor review points:
*   `mentor:username` (Example: `mentor:rahul`, `mentor:aniket`)

### Recommended Label Combination Examples

*   **Example 1 — Good Feature PR:** `level:intermediate`, `type:feature`, `quality:clean`, `gssoc:approved`
*   **Example 2 — Documentation PR:** `level:beginner`, `type:docs`, `gssoc:approved`
*   **Example 3 — Excellent Security Fix:** `level:advanced`, `type:security`, `quality:exceptional`, `gssoc:approved`

### 🚨 Most Important Rule
For contributor points, a PR must:
✅ Be merged
✅ Have at least one review
✅ Have `gssoc:approved`

**Without `gssoc:approved`, no score is counted.**

> **Pro Tip:** Always comment `"Please assign this to me"` on an issue and **wait for the Project Admin or Mentor to assign it to you** before you start working! This avoids overlapping work.

---

## 🙋 Who Can Contribute?

**Everyone is welcome. Seriously.**

- 🌱 **Beginners** — Fix typos, improve docs, add code comments, test features.
- 🧑‍💻 **Frontend devs** — React components, Vanilla CSS, accessibility (a11y), responsive design.
- 🛠️ **Backend devs** — Express controllers, API routes, middleware, MongoDB integration.
- 🐍 **Python devs** — OpenCV, Pillow, `rembg` AI processing, Flask routing.
- 📐 **Designers** — UI/UX improvements, clean modern layouts, icons, mockups.
- 🧪 **Testers** — Write tests, find bugs, test on different devices and browsers.
- ✍️ **Writers** — Documentation, step-by-step guides, tutorials.

### Types of Contributions

| Type | Examples |
|------|---------|
| 🐞 **Bug Fix** | Fix broken UI elements, incorrect API responses, or Python script crashes. |
| ✨ **New Feature** | Add a new photo size preset (e.g., Brazil), improve face detection accuracy. |
| 📝 **Documentation** | Improve `README.md`, add JSDoc/Python docstrings, write setup tutorials. |
| ♿ **Accessibility** | Improve keyboard navigation, add ARIA labels, ensure screen reader support. |
| 🎨 **UI/UX** | Improve layouts, implement dark mode, fix colour contrast, add micro-animations. |
| 🔧 **Refactoring** | Clean up messy code, split large components, improve code quality without changing behaviour. |

---

## 🚀 The 5-Stage Contribution Roadmap

We have structured the development of SnapPass AI into 5 distinct stages. You can jump into any stage that matches your skill set!

### 🟢 Stage 1: Frontend Basics (React & CSS)
**Perfect for beginners and React learners!**
- **Your Mission:** Help build and maintain the basic building blocks of the user interface.
- **Detailed Tasks:** Fix typographical errors, add missing basic React components (like buttons or inputs), resolve React console warnings, implement missing static pages, and ensure the UI renders correctly across browsers.
- **Skills:** React.js, HTML, Vanilla CSS.

### 🟡 Stage 2: UI/UX Enhancements
**For the design enthusiasts and CSS wizards!**
- **Your Mission:** Make SnapPass AI look incredibly premium, modern, and trustworthy.
- **Detailed Tasks:** Implement a seamless dark mode, dramatically enhance mobile and tablet responsiveness, add smooth CSS transitions and micro-animations for user actions, and polish the overall visual hierarchy. We want a "wow" factor!
- **Skills:** Advanced CSS, UI/UX Design principles, React.js.

### 🔵 Stage 3: Documentation & Descriptions
**For the technical writers and detail-oriented contributors!**
- **Your Mission:** Make the project easy to understand, setup, and navigate for everyone.
- **Detailed Tasks:** Write detailed, comprehensive `README.md` guides, add strict JSDoc comments to all JavaScript functions, write PEP 8 compliant docstrings for Python, document all API endpoints (request/response structures), and create visual setup tutorials.
- **Skills:** Markdown, Technical Writing, Code Comprehension.

### 🟠 Stage 4: Backend & Authentication (Node.js)
**For the backend engineers!**
- **Your Mission:** Build the robust engine that powers the application and handles data flow.
- **Detailed Tasks:** Create Express.js API controllers, configure Multer for secure and efficient image uploads, set up Mongoose schemas for user history and uploads, and implement user authentication (if requested in issues).
- **Skills:** Node.js, Express.js, MongoDB/Mongoose.

### 🔴 Stage 5: Python AI Service & Image Processing
**For the AI, Computer Vision, and Python developers!**
- **Your Mission:** Build the core intelligence of SnapPass AI that actually processes the photos.
- **Detailed Tasks:** Implement flawless background removal using `rembg`, utilize OpenCV for accurate face detection and auto-centering, resize images to exact DPI standards using Pillow, generate print-ready A4 collages, and wrap it all in a high-performance Flask API.
- **Skills:** Python, Flask, OpenCV, Pillow, Image Processing.

---

## 🏗️ Project Architecture Overview

Before you start writing code, it is crucial to understand how the three layers of SnapPass AI communicate:

```text
Browser (React Frontend)
    │
    │  HTTP (fetch / axios) via port 3000
    ▼
Express Backend (Node.js) ← runs on port 3000
    │
    │  HTTP (axios) forwarding images/data
    ▼
Python AI Service (Flask) ← runs on port 8000
```

### Frontend (`frontend/`)
Built with **React.js** and plain **CSS** (We strictly do **not** use Tailwind or CSS-in-JS to keep styling vanilla and accessible).
- Each component lives in its own `.jsx` + `.css` pair.
- State is managed with standard React hooks (`useState`, `useEffect`, `useCallback`).
- Custom hooks live in `src/hooks/`.
- All API calls are centralized and funnel through `src/services/photoService.jsx`.
- Routing is handled by `react-router-dom` in `src/routes/AppRoutes.jsx`.

### Backend (`backend/`)
Built with **Node.js + Express**.
- Follows a strict Routes → Controllers → Services architectural pattern.
- File uploads are securely handled by **Multer**.
- Acts as a middleman: all images are received here and forwarded to the Python service via Axios.
- MongoDB integration (via Mongoose) is planned for saving user sessions.

### Python AI Service (`python-ai-service/`)
Built with **Flask**.
- `bg_remove.py` — handles background removal using the `rembg` library.
- `face_center.py` — handles facial recognition, detection, & centering using OpenCV (`cv2`).
- `dpi_optimizer.py` — handles resizing to the correct physical dimensions (DPI) for the selected country preset.
- `sheet_generator.py` — handles arranging the finalized photos onto a printable A4 canvas using Pillow (`PIL`).

---

## 🛠️ Detailed Development Setup

Follow these exact steps to get the full project running on your local machine.

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://python.org/) (v3.9 or higher)
- [Git](https://git-scm.com/)

### Step 1 — Fork & Clone
```bash
# 1. Click the "Fork" button at the top right of the GitHub repository.
# 2. Clone your forked repository to your local machine:
git clone https://github.com/YOUR_USERNAME/SnapPass-AI.git

# 3. Navigate into the project folder:
cd SnapPass-AI

# 4. Add the original repository as 'upstream' to keep your fork updated with our latest changes:
git remote add upstream https://github.com/souma9830/SnapPass-AI.git
```

### Step 1.5 — Install Root Dependencies (Required Once)
After cloning, install the root-level development dependencies (husky, commitlint, lint-staged):

```bash
npm install
```

This automatically triggers the `husky` postinstall hook, which sets up Git hooks for:
- **commit-msg** — validates every commit message follows the conventional commit format
- **pre-commit** — runs `lint-staged` to format staged files with Prettier

> If husky hooks do not activate automatically, run `npx husky` manually.

### Step 2 — Run the Frontend (Required for UI Tasks)
```bash
cd frontend
npm install
npm start 
# Automatically opens http://localhost:3000 in your browser
```
> **Tip:** You don't necessarily need the backend or Python service running to work purely on the frontend UI. The frontend has simulated placeholders for API calls to help you design!

### Step 3 — Run the Backend (Required for Node.js Tasks)
Open a new terminal window:
```bash
cd backend
npm install
npm run dev 
# The server will start and listen on http://localhost:3000
```

### Step 4 — Run the Python AI Service (Required for Python/AI Tasks)
Open a new terminal window:
```bash
cd python-ai-service

# It is highly recommended to create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Mac/Linux:
source venv/bin/activate   
# On Windows:
venv\Scripts\activate

# Install all required Python packages
pip install -r requirements.txt

# Start the Flask server
python main.py
# The AI service will start and listen on http://localhost:8000
```

---

## 🔄 Step-by-Step Contribution Workflow

To ensure a smooth collaboration, please follow this exact workflow every time you want to contribute:

1. **Find an Issue:** Look for an issue in the `Issues` tab. Comment asking to be assigned.
2. **Sync your fork:** Always pull the latest changes before starting new work to avoid merge conflicts.
   ```bash
   git checkout master
   git pull upstream master
   ```
3. **Create a new branch:** Never work directly on `master`. Name your branch appropriately (see guidelines below).
   ```bash
   git checkout -b feature/your-awesome-feature
   ```
4. **Write Code:** Make your brilliant changes! Test them thoroughly.
5. **Stage and Commit:** Follow our strict commit message guidelines.
   ```bash
   git add .
   git commit -m "feat(ui): add support for Brazil passport photo size"
   ```
6. **Push your branch to your fork:**
   ```bash
   git push origin feature/your-awesome-feature
   ```
7. **Open a Pull Request (PR):** Go to the original SnapPass AI repository on GitHub, click "Compare & pull request", and fill out the template!

---

## 🌿 Branch & Commit Guidelines

To keep our history perfectly clean and readable, we strictly follow standard conventions. **Reviewers will check this before merging your PR!**

### Branch Naming (`type/short-description`)
| Type | When to use | Example |
|------|------------|---------|
| `feature/` | Adding new functionality | `feature/brazil-photo-size` |
| `fix/` | Fixing a bug | `fix/upload-crash-error` |
| `docs/` | Documentation only | `docs/improve-readme-setup` |
| `style/` | CSS or UI changes only | `style/navbar-mobile-responsive` |
| `refactor/` | Code improvement, no behaviour change | `refactor/photo-service-hook` |

### Commit Messages (Conventional Commits)
Format: `type(scope): short description`

| Type | Use for | Example |
|------|---------|---------|
| `feat` | A new feature | `feat(editor): add real-time background colour preview` |
| `fix` | A bug fix | `fix(upload): show correct error when file exceeds 10MB` |
| `docs` | Documentation changes | `docs(readme): add Python AI service setup instructions` |
| `style` | Formatting, CSS | `style(navbar): fix mobile menu overflow on small screens` |
| `refactor` | Code restructuring | `refactor(backend): move upload logic to service layer` |

### Automatic Validation with Commitlint
This project uses **commitlint** with the conventional config preset to enforce commit message standards:

```bash
# ✅ Accepted feat(scope): add crop mark toggle to print preview
# ✅ Accepted fix(api): handle empty filename edge case
# ✅ Accepted docs(readme): update deployment instructions
# ✅ Accepted refactor(editor): extract size calculator hook
# ✅ Accepted ci(docker): add health check to compose file

# ❌ Rejected: "fix" (missing scope and description)
# ❌ Rejected: "changes" (not a conventional commit)
# ❌ Rejected: "updated stuff" (not descriptive)
# ❌ Rejected: "WIP" (not a valid type)
```

If your commit is rejected, look at the error message from commitlint:
- `subject-case` — subject must be lowercase
- `type-enum` — type must be one of: feat, fix, docs, style, refactor, perf, test, chore, ci, security, a11y, i18n
- `scope-enum` — scope must be one of the recognised project scopes
- `header-max-length` — first line must be 100 characters or less

**Bad Examples ❌ (Do not do this):**
- `git commit -m "fix"`
- `git commit -m "changes"`
- `git commit -m "updated stuff"`

---

## 📬 Pull Request Guide

### Before Opening a PR, Check This List:
- [ ] Your branch is perfectly up to date with `upstream/master`.
- [ ] Your code runs locally without any errors or crashes.
- [ ] You have thoroughly tested your changes in the browser.
- [ ] You have removed all unnecessary `console.log` or `print()` statements.
- [ ] If making CSS changes, they are responsive (you checked on mobile view).
- [ ] You have added JSDoc/Python docstrings for complex logic.
- [ ] Your PR includes a `release-note` block describing user-facing changes.

### Issue & PR Lifecycle Automation

SnapPass AI uses GitHub Actions to automate common maintenance tasks:

- **Auto-Triage**: New issues are automatically labeled `status:triage` and assigned relevant type labels based on content.
- **Stale Detection**: Issues and PRs with no activity for 60 days are marked `status:stale` and closed after 14 additional days of inactivity. Priority, security, and `help wanted` issues are exempt.
- **Thread Locking**: Resolved issues are automatically locked after 90 days to keep discussions focused.
- **First-Time Welcome**: First-time contributors receive an automated welcome message with helpful resources.
- **Release Drafter**: Merged PRs with release notes are automatically compiled into draft releases on every push to `master`.

> These automations are defined in `.github/workflows/`. See `.github/LABEL_DESCRIPTIONS.md` for the full label reference guide.

### PR Description Template
When you open a PR, please copy, paste, and fill in this exact template:

```markdown
## What does this PR do?
[Provide a clear, brief description of the changes you made.]

## Which Stage does this belong to?
[e.g., Stage 2: UI Enhancements]

## Why is this change needed?
[Link to the issue this resolves, e.g., Closes #123]

## Screenshots (Mandatory if UI change)
| Before | After |
| ------ | ----- |
| [Screenshot] | [Screenshot] |

## Checklist
- [ ] Tested locally and in browser.
- [ ] No console errors or warnings.
- [ ] Mobile responsive (if UI).
- [ ] Code is commented where needed.
- [ ] Commit messages follow the Conventional Commits standard.
```

### Review Process
1. A maintainer will review your PR within a few days.
2. They may suggest changes — please be responsive and update your branch.
3. Once approved and checks pass, it will be merged to `master`.
4. Your points will be recorded, and your name will appear in the contributors list! 🎉

---

## 📐 Coding Standards

### JavaScript / React
- Use **functional components** with hooks exclusively (no class components).
- Each component must have **its own `.jsx` + `.css` file**.
- Use **highly descriptive variable names** (`uploadedFile` not `uf`, `handleFormSubmit` not `submit`).
- Add a **JSDoc comment block** at the top of every component and utility function.
- Keep components **focused**: if a file is over 200 lines, consider splitting it.
- Use `const` by default, `let` only when absolute reassignment is needed. Never use `var`.

```js
// ✅ Good
/**
 * UploadBox Component
 * Handles drag and drop photo uploading functionality.
 * @param {Object} props
 * @param {Function} props.onFileSelect - Callback fired when a file is chosen.
 */
function UploadBox({ onFileSelect }) { ... }

// ❌ Bad
function C(p) { ... }
```

### CSS
- **No Tailwind**, no CSS-in-JS — we use highly structured plain CSS.
- Utilize the **CSS variables** defined globally in `index.css` (e.g. `var(--color-primary)`).
- **Never use hardcoded hex colours** in components — always reference design tokens.
- All CSS files must be **strictly scoped to their component** (e.g. wrapping everything in `.upload-box {}`).
- Always include **responsive styles** using `@media (max-width: 768px)`.

```css
/* ✅ Good — uses design tokens, strictly scoped class names */
.upload-box {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg);
}

/* ❌ Bad — hardcoded hex values, generic class name */
.box {
  border: 2px dashed #ccc;
  border-radius: 10px;
  background: #f8f8f8;
}
```

### Python
- Strictly follow **PEP 8** style guidelines.
- Add a comprehensive **docstring** to every single function and class.
- Import only exactly what you need (`from PIL import Image` rather than `import PIL`).
- Use **Type Hints** aggressively to make the code self-documenting.
- Handle errors gracefully: return `None` or a default value and print a warning rather than letting the server crash if a dependency or file is missing.

```python
# ✅ Good
from PIL import Image

def remove_background(image_path: str) -> Image:
    """
    Removes the background from the given image using the rembg library.
    
    Args:
        image_path (str): The absolute path to the input image file.
        
    Returns:
        Image: A Pillow Image object with a transparent background.
    """
    ...
```

---

## 🎯 Priority Tasks for Contributors

Looking for something specific to do? These are the most impactful areas where we need your help right now:

### Frontend Testing

The frontend uses **Vitest** with **React Testing Library** for unit and component tests:

```bash
cd frontend
npm test            # Run tests in watch mode
npm run test:run    # Run tests once (CI mode)
npm run test:coverage  # Run tests with coverage report
```

All tests live in `frontend/src/test/__tests__/`. When contributing frontend code:

1. Add tests for new utility functions in the matching file under `__tests__/`.
2. For component tests, verify rendering, accessibility (role, aria attributes), and edge cases.
3. Run `npm run test:run` before pushing to ensure no regressions.

---

### 🔴 High Priority (Python AI Service - Stage 5)
| Task | File | Description |
|------|------|-------------|
| Background Removal | `python-ai-service/app/services/bg_remove.py` | Implement `remove_background()` using `rembg` |
| Face Detection | `python-ai-service/app/services/face_center.py` | Implement `detect_face_and_center()` with OpenCV |
| DPI Resize | `python-ai-service/app/services/dpi_optimizer.py` | Implement `resize_passport_photo()` using Pillow |
| A4 Sheet Layout | `python-ai-service/app/services/sheet_generator.py` | Implement `generate_a4_sheet()` using Pillow |
| Flask App Entry | `python-ai-service/main.py` | Create the main Flask app with `/process` and `/generate-sheet` API routes |

### 🟡 Medium Priority (Backend - Stage 4)
| Task | File | Description |
|------|------|-------------|
| Image Processing API | `backend/src/controllers/image.controller.js` | Wire up Express controllers to make real Axios calls to the Python AI service |
| Print Sheet API | `backend/src/controllers/print.controller.js` | Stream the finalized A4 sheet from the AI service back to the frontend |
| MongoDB Integration | `backend/src/models/` | Create Mongoose schemas for `Upload` history and user `Session` |

### 🟢 Good First Issues (Frontend - Stages 1 & 2)
| Task | File | Description |
|------|------|-------------|
| Progress Bar | `src/components/UploadBox.jsx` | Show an interactive upload progress percentage bar |
| Error Toast | `src/components/` | Create a global, reusable toast notification component for errors |
| Admin Stats UI | `src/pages/AdminDashboard.jsx` | Build the UI to connect statistics to the real API once the backend is ready |
| Sidebar Navigation | `src/components/layout/Sidebar.jsx` | Build a clean, collapsible sidebar for the main editor view |
| Dark Mode Toggle | `src/index.css` & `src/components/layout/Navbar.jsx` | Add `prefers-color-scheme: dark` styles and a manual toggle switch |

---

## 🐞 Reporting Bugs & Requesting Features

### Found a Bug? Please help us fix it!
1. **Search existing issues** first to see if it has already been reported.
2. If not, open a new issue.
3. Use this exact format in your issue description:
   ```markdown
   **Bug description:** [What exactly happened?]
   
   **Steps to reproduce:**
   1. Go to...
   2. Click...
   3. See error...
   
   **Expected behaviour:** [What should happen instead?]
   
   **Screenshots:** [Attach if applicable]
   
   **Environment:**
   - OS: [e.g., Windows 11]
   - Browser: [e.g., Chrome 123]
   - Node version: [e.g., v20.0.0]
   ```

### Have a Feature Idea?
Open a Feature Request issue and include:
- **What** exactly you want to add.
- **Why** it would be highly useful for the users.
- Any **examples, inspirations, or mockups** you have.

---

## 🆘 Getting Help & Code of Conduct

### Getting Help
Stuck? Not sure where to start? We are here for you!
- 💬 Open a **Discussion** on the GitHub repository.
- 🐞 Open an **Issue** if something is fundamentally broken.
- 📧 Tag or reach out directly to the Project Admin: **[@souma9830](https://github.com/souma9830)**

### Code of Conduct
We are firmly committed to providing a welcoming, safe, and inspiring community for all developers, regardless of background or experience level. 
- **Be intensely kind and respectful.**
- Harassment, discrimination, or abusive behavior of any kind will not be tolerated and will result in an immediate, permanent ban.
- Focus on what is best for the project. Help each other learn! Let's make open source a fantastic place.

---

<div align="center">
  <h2>🏅 Recognition & Thanks</h2>
  <p>All contributors will be permanently listed in the <strong>Contributors</strong> section on the main GitHub repository page.</p>
  <p>Significant, high-quality contributors may be promoted to the project README as <strong>Core Contributors</strong>.</p>
  <br/>
  <h3>Let's build something truly amazing together! 🚀</h3>
  <br/>
  <p><strong>Thank you for making SnapPass AI better! 🙌</strong></p>
  <p>
    <a href="https://github.com/souma9830/SnapPass-AI">⭐ Star the repo</a> · 
    <a href="https://github.com/souma9830/SnapPass-AI/issues">🐞 Report a Bug</a> · 
    <a href="https://github.com/souma9830/SnapPass-AI/issues">💡 Request a Feature</a>
  </p>
</div>
