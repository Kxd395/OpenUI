# **OpenUI: Project Recovery & Enhancement Plan**

> **Document Version:** 2.1  
> **Date:** July 8, 2025  
> **Status:** Final. Approved for immediate implementation.

----

### **1. Executive Summary**

The OpenUI project is at a critical juncture. While its core vision of creating a next-generation AI interface is sound, a significant gap exists between the planned features and the current state of implementation. Key functionalities, including the dynamic **Prompt Co-Pilot**, are non-operational, leading to a disjointed user experience and stalled progress.

This document outlines a decisive **Recovery and Enhancement Plan** to bridge this gap. The plan prioritizes stabilizing the foundational architecture, implementing core features in a phased approach, and establishing rigorous quality standards.

By executing this plan, we will transform OpenUI into a robust, intuitive, and market-leading platform. We project a **50% reduction in user error rates** and a **30% increase in task completion speed**, delivering a product that is not only functional but also delightful to use. This document is the single source of truth for all project activities moving forward.

----

### **2. Strategic Vision: The Prompt Co-Pilot**

The central innovation of OpenUI is the **Prompt Co-Pilot**, a feature designed to evolve the static input field into a dynamic, intelligent workspace.

| Strategic Challenge | Business Consequence | The Co-Pilot Solution |
| :--- | :--- | :--- |
| Users engage in "prompt roulette" | Wasted time, increased token costs, and high user frustration | Real-time refinement actions end the cycle of blind iteration |
| Ambiguous or verbose prompts reduce precision | Risk of hallucinations, off-target replies, and needless follow-ups | Guided **Sharpening** & **Distillation** tools ensure user intent is unmistakable |
| Novice users struggle with domain-specific phrasing | Steep learning curve leading to poor feature adoption and churn | One-click actions and templates provide "scaffolded expertise," raising the quality floor for all users |

----

### **3. Current State Analysis: Identified Implementation Gaps**

A recent code audit revealed critical deficiencies. The following table contrasts the intended design with the on-ground reality, forming the basis of our recovery roadmap.

| Intended Feature (from Project Brief) | Current Status (Code Review) |
| :--- | :--- |
| **Floating & Dynamic Chat Input** | The chat input is static and not implemented as a floating component |
| **Core Button Functionality** | **Send Button:** Lacks essential visual feedback (e.g., loading states)\<br>**Clear Button:** Functionality is entirely missing |
| **Prompt History & Management** | **Rail Toggle:** The history panel's visibility state does not persist\<br>**Item Actions:** No functionality to reuse, edit, or delete history items |
| **Settings Panel & Persistence** | **Implementation:** The panel is a stub; most settings are not implemented\<br>**Persistence:** User settings do not save between sessions |
| **Prompt Refinement Tools** | **Core Actions:** None of the core actions (**Sharpen, Expand, Distill, etc.**) are implemented |
| **Accessibility & Keyboard Navigation**| **Shortcuts:** Keyboard shortcuts are incomplete\<br>**Screen Reader:** Critical ARIA attributes are missing from interactive elements |

----

### **4. The Recovery & Enhancement Plan**

This section details the specific technical and design improvements required to rectify the issues and elevate the product.

#### **4.1. UI/UX Enhancements**

| Component | Issues Identified | Recommended Fixes |
| :--- | :--- | :--- |
| **Layout & Structure** | Unbalanced layout; no mobile consideration | 1. Implement symmetric, collapsible side rails (72px width)\<br>2. The right rail will serve a dual function for **History & Preview**\<br>3. Define and implement responsive breakpoints for tablet and mobile |
| **Visual Hierarchy** | Unclear information architecture; low contrast | 1. Establish a consistent 3-tier elevation system for visual depth\<br>2. Apply brand accent color to all primary interactive elements\<br>3. Enforce **WCAG AA contrast ratio of 4.5:1** for all text |
| **Iconography & Affordance** | Inconsistent icon set; ambiguous elements | 1. Standardize the entire application on the **Lucide icon set**\<br>2. Implement 300ms-delay tooltips on all icon-only buttons\<br>3. Add first-use "coach marks" to guide users to new features\<br>4. Leverage **Radix UI** for accessible primitives and **CodeMirror** for the prompt editor |

##### **Core UX Flow**

1.  **Type Prompt** – User starts typing in the floating input.
2.  **Open ✨ Menu** – A context-aware menu appears upon hover or click, offering refinement actions.
3.  **Select Action(s)** – The prompt is rewritten inline, with changes highlighted.
4.  **Undo / Compare** – A one-tap **Revert** option and a 5-step history are available.
5.  **Send** – The refined prompt is sent to the LLM only when the user is satisfied.

##### **Mock State Flow**

1.  **Startup** – Left and right rails are icon-only; the canvas dominates; the prompt bar is at the bottom-center.
2.  **Input Focus** – Suggestion chips slide into the prompt bar; rails remain collapsed.
3.  **File Hover** – The canvas border animates with the brand's accent color; the drop-card opacity changes to 100%.
4.  **Preview Mode** – The right rail automatically expands to 280px; the left rail stays collapsed.

#### **4.2. Technical Architecture Improvements**

| Area | Issues Identified | Recommended Fixes |
| :--- | :--- | :--- |
| **Frontend Structure**| Disorganized components; excessive prop drilling | 1. Reorganize components into a logical structure: `/features`, `/common`, `/ui`\<br>2. Use component composition to reduce deep prop drilling |
| **State Management** | Unstructured local state; no server state solution | 1. Utilize **React Query** to manage all server state, caching, and mutations\<br>2. Formalize the use of **Jotai** for managing global client-side state\<br>3. Implement robust **Error Boundaries** around key application features |
| **AI/ML Backend** | Unclear model integration strategy | 1. Use **Ollama** for local, on-device prompt refinements\<br>2. Use the **OpenAI** API as a fallback or for more complex tasks\<br>3. Integrate **Weave** for tracing and evaluating model performance |

##### **One-Click Actions Library**

| Action | What It Does | Typical Use-Case |
|---|---|---|
| **Sharpen ↗** | Tightens language, removes filler, and strengthens verbs | Executive summaries, professional emails |
| **Expand ＋** | Adds missing context or clarifying details | Research queries, grant proposals |
| **Distill ↓** | Compresses to the core question, stripping redundancy | Quick FAQs, mobile prompts |
| **Tone / Style** | Rewrites to Formal, Casual, Persuasive, etc. | Marketing copy, academic writing |
| **Structure** | Formats as a list, table, JSON, or code scaffold | Developer tasks, README stubs |

> _All actions will be powered locally via a lightweight `/refine` worker, with a fallback to the server if needed._

##### **Advanced Controls**

*   **Custom Macro Builder** – Allow users to chain actions and save them as custom macros (e.g., "Bug Report Generator") that can be triggered with a shortcut.
*   **Smart Defaults** – The application will remember the preferred action order per user (stored locally).
*   **Accessibility / i18n** – Ensure all controls are keyboard-first, ARIA-labelled, use high-contrast diffs, and support RTL-aware motion.

#### **4.3. Developer Experience & Quality Standards**

| Focus | Current State | Improvement Plan |
| :--- | :--- | :--- |
| **Documentation** | Sparse and inconsistent | 1. Enforce **JSDoc comment blocks** for all components and functions\<br>2. Create architectural diagrams using Mermaid.js within the repository\<br>3. Document all API contracts using **Swagger/OpenAPI** |
| **Code Quality & Testing** | Limited test coverage; inconsistent formatting | 1. Standardize on **Vitest** for unit tests and **React Testing Library** for components\<br>2. Utilize **Cypress** for all end-to-end testing scenarios\<br>3. Enforce **ESLint and Prettier** rules with **Husky pre-commit hooks**\<br>4. Introduce **Storybook** for isolated component development and visual testing |
| **Deployment** | No documented process | 1. The project will be deployed using **Fly.io** via the existing scripts\<br>2. The CI/CD pipeline will be configured to automatically build and deploy to staging and production environments |

----

### **5. Prioritized Implementation Roadmap**

The project will proceed in three distinct phases, with clear milestones to ensure measurable progress.

#### **Phase 1: Foundations & Core Functionality (Weeks 1-2)**

*   **Tasks:**
    *   [ ] Establish 8-pt grid system and define CSS variables for elevation and accent colors.
    *   [ ] Refactor the layout to `grid-template-columns: 72px 1fr 72px` and add rail collapse toggles.
    *   [ ] Build the new floating prompt-bar component with inline chips and diff animation.
    *   [ ] Set up Jotai for global state and React Query for server state.
    *   [ ] Configure CI/CD pipeline, ESLint, Prettier, and Husky pre-commit hooks.
*   **Phase 1 Milestone:** A stable, responsive application skeleton is deployed to a staging environment, with a functional core chat interface.

#### **Phase 2: Feature Implementation (Weeks 3-4)**

*   **Tasks:**
    *   [ ] Implement history panel actions (reuse, delete) and settings persistence.
    *   [ ] Build the UI for the refinement menu.
    *   [ ] Implement the `Sharpen` & `Distill` actions with the local Ollama worker.
    *   [ ] Swap all icons to the Lucide set and implement hover tooltips.
    *   [ ] Document APIs with OpenAPI and write unit/integration tests for all new features.
*   **Phase 2 Milestone:** Core user features (History, Settings, basic Prompt Refinement) are fully functional and test-covered in the staging environment.

#### **Phase 3: Polish & Hardening (Weeks 5-6)**

*   **Tasks:**
    *   [ ] Implement remaining refinement actions (`Expand`, `Tone`, `Structure`).
    *   [ ] Conduct a full accessibility audit (keyboard navigation, ARIA, screen readers) and remediate all findings.
    *   [ ] Run WCAG contrast checks and smoke-test all user flows.
    *   [ ] Profile application performance and optimize critical bottlenecks.
    *   [ ] Ship the final product under a feature flag to production for a limited beta.
*   **Phase 3 Milestone:** The application is feature-complete, WCAG AA compliant, and performance-tuned. Ready for a limited beta release.

----

### **6. Success Metrics & KPIs**

Project success will be measured against these specific, quantifiable goals.

| Metric | Target | Measurement Tool |
| :--- | :--- | :--- |
| **Prompt Iteration Rate** | Reduce average prompt re-submissions by 50% | Analytics tracking on "Send" events per session |
| **User Task Completion** | Increase successful task completion rate by 30% | Funnel analysis of key user workflows |
| **Accessibility Score** | Achieve a 95%+ score on automated accessibility audits | Axe, Lighthouse, or similar accessibility checker |
| **Session Duration** | Increase average user session duration by 20% | Product analytics platform |
| **Code Test Coverage** | Achieve 80%+ unit and integration test coverage | Vitest/Jest coverage reports |

----

### **7. Potential Risks & Mitigation Strategies**

| Risk | Likelihood | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Technical Debt** | High | Medium | Allocate 15% of each development cycle to refactoring and paying down existing tech debt. Enforce strict code quality standards to prevent new debt |
| **Scope Creep** | Medium | High | Adhere strictly to the phased roadmap. All new feature requests must go through a formal change control process and be deferred to a post-launch backlog |
| **Resource Constraints** | Medium | High | Cross-train developers on critical components to avoid single points of failure. Maintain a clear priority list to ensure focus remains on the most vital tasks |
| **Third-Party API Latency**| Low | Medium | Implement intelligent caching and loading skeletons to mask API latency. Establish clear timeout and error handling for all external calls |

----

### **8. Action Items & Ownership**

| Priority | Action Item | Lead | Status |
| :--- | :--- | :--- | :--- |
| **P0** | Establish design tokens (spacing, color, typography) | Design Lead | Not Started |
| **P0** | Set up frontend repository with CI/CD & linting | Frontend Lead | Not Started |
| **P0** | Implement foundational UI layout with collapsible rails | Frontend Dev | Not Started |
| **P1** | Build initial floating chat input component with core functions | Frontend Dev | Not Started |
| **P1** | Set up state management with Jotai & React Query | Frontend Lead | Not Started |
| **P1** | Document v1 of the User and Prompt APIs | Backend Lead | Not Started |
| **P2** | Create Vitest & Cypress testing infrastructure and write initial tests | QA/Dev Lead | Not Started |

----

### **9. Acceptance Criteria**

| Feature | Criteria |
| :--- | :--- |
| **Core Layout** | - Side rails must collapse to 72px and expand smoothly.<br>- Responsive breakpoints must be honored on tablet and mobile viewports.<br>- The 8-point grid system must be applied to all major components. |
| **Chat Input** | - The input must float and remain accessible at all times.<br>- The "Send" button must show a loading state during submission.<br>- The "Clear" button must remove all text from the input. |
| **History Panel** | - History items must be added for each sent prompt.<br>- Users must be able to click a history item to reuse it.<br>- Delete functionality must remove the item from the list and from persisted state. |
| **Settings** | - All selected settings must persist between user sessions.<br>- Toggling a setting must have an immediate and visible effect. |
| **Prompt Refinement** | - The refinement menu must appear on hover/click within the prompt input.<br>- Each refinement action must rewrite the prompt and show a visual diff.<br>- The "Revert" button must restore the previous prompt state. |
| **Accessibility** | - All interactive elements must be navigable and operable via keyboard.<br>- All images and icons must have appropriate `alt` or `aria-label` tags.<br>- Text must meet a minimum WCAG AA contrast ratio of 4.5:1. |

----

### **10. Implementation Status Update**

#### **Recent Progress**

The `ChatInput.tsx` component has been updated to be a floating component, which is a great step forward. It also includes the "Send" button with a loading state and a "Clear" button, which aligns with the recovery plan.

However, I've noticed a few areas where the implementation deviates from the plan or where features are still missing:

#### **Identified Implementation Gaps**

| Component | Issue | Status |
| :--- | :--- | :--- |
| **Iconography** | The component uses icons from `@radix-ui/react-icons`, but the recovery plan specifies the use of the Lucide icon set | ❌ Not Aligned |
| **Prompt Refinement Tools** | The "Prompt Co-Pilot" features, such as the "Sharpen," "Expand," and "Distill" actions, are not yet implemented | ❌ Missing |
| **Floating & Dynamic Chat Input** | The chat input is not implemented as a floating component | ⚠️ Partially Implemented |
| **Core Button Functionality** | The "Send" button lacks essential visual feedback (e.g., loading states), and the "Clear" button's functionality is entirely missing | ⚠️ Partially Implemented |
| **Prompt History & Management** | The history panel's visibility state does not persist, and there is no functionality to reuse, edit, or delete history items | ❌ Missing |
| **Settings Panel & Persistence** | The panel is a stub; most settings are not implemented, and user settings do not save between sessions | ❌ Missing |
| **Accessibility & Keyboard Navigation** | Keyboard shortcuts are incomplete, and critical ARIA attributes are missing from interactive elements | ❌ Missing |

#### **Recommended Immediate Actions**

To address these gaps, I recommend the following prioritized actions:

1. **Update the icons:** Replace the `@radix-ui/react-icons` with the `lucide-react` icon library to maintain consistency with the design system.

2. **Implement the Prompt Co-Pilot:** Create a new component for the prompt refinement menu and integrate it with the ChatInput component.

3. **Add the "Clear" button functionality:** Implement the `handleClear` function to clear the chat input.

4. **Add visual feedback to the "Send" button:** Implement a loading state for the "Send" button to indicate that a message is being sent.

5. **Implement prompt history and management:** Create a new component for the history panel and add functionality to reuse, edit, and delete history items.

6. **Implement the settings panel and persistence:** Create a new component for the settings panel and add functionality to save user settings between sessions.

7. **Improve accessibility and keyboard navigation:** Add keyboard shortcuts for all actions and ensure that all interactive elements have the necessary ARIA attributes.