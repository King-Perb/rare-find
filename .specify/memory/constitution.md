<!--
Sync Impact Report:
Version: 0.0.0 → 1.0.0
- Initial constitution creation from template
- Principles adapted from portfolio project with rare-find specific additions
- Added AI evaluation transparency principle
- Added marketplace integration requirements
- Added data privacy and security requirements for purchase recommendations
- Templates: ✅ plan-template.md (Constitution Check section exists), ✅ spec-template.md (aligned), ✅ tasks-template.md (aligned)
- Command files: ✅ All command files reviewed - no agent-specific references found
- Follow-up: None
-->

# Rare Find Constitution

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)

All code changes MUST be accompanied by tests. The workflow is strictly enforced:

1. **Type and Linter Checks First**: Run `npm run type:check` and `npm run lint` - fix all errors before proceeding
2. **Build Verification**: Ensure `npm run build` succeeds
3. **Test Updates**: Update or add tests for all code changes
4. **Test Execution**: Run `npm test` to verify all tests pass
5. **E2E When Applicable**: Run `npm run test:e2e` for navigation, routing, or critical user flow changes

**Test Coverage Requirements**:
- Component tests: `src/components/**/__tests__/*.test.tsx`
- Service/utility tests: `src/lib/__tests__/*.test.ts`
- API route tests: `src/app/api/**/__tests__/*.test.ts`
- Page tests: `src/app/**/__tests__/*.test.tsx`
- Hook tests: `src/hooks/__tests__/*.test.ts`
- E2E tests: `e2e/*.spec.ts` (Playwright)
- AI evaluation tests: `src/lib/ai/__tests__/*.test.ts` (mock AI responses)
- Marketplace integration tests: `src/lib/marketplace/__tests__/*.test.ts` (mock API responses)

**Rationale**: Ensures code quality, prevents regressions, and maintains confidence in refactoring. Critical for AI evaluation accuracy and marketplace integration reliability.

### II. TypeScript Strictness

TypeScript MUST be used with strict mode enabled. No `any` types allowed except in exceptional circumstances with explicit justification.

**Requirements**:
- All files must have proper type definitions
- Interfaces and types must be defined in `src/types/`
- Type checking must pass: `npm run type:check`
- No implicit any types
- Marketplace API responses must be fully typed
- AI evaluation results must be strongly typed

**Rationale**: Type safety prevents runtime errors and improves code maintainability. Essential for handling marketplace data and AI evaluation results safely.

### III. Feature Branch Workflow (NON-NEGOTIABLE)

NEVER commit directly to `main`. All changes MUST be made on feature branches and merged via pull requests.

**Branch Naming**:
- `feature/<description>`: New features
- `fix/<description>`: Bug fixes
- `refactor/<description>`: Code refactoring
- `docs/<description>`: Documentation updates
- `test/<description>`: Test additions/improvements

**Workflow**:
1. Check current branch before any commit
2. If on `main`, create feature branch first
3. Make changes on feature branch
4. Create pull request for review
5. All CI checks must pass before merge

**Rationale**: Protects production code, enables code review, and maintains clean git history.

### IV. Conventional Commits

All commit messages MUST follow the Conventional Commits specification.

**Format**: `<type>(<scope>): <subject>`

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Scopes**: `components`, `layout`, `api`, `config`, `docs`, `workflows`, `types`, `styles`, `ai`, `marketplace`, `recommendations`

**Requirements**:
- Use imperative, present tense
- Maximum 72 characters for subject
- Include body for complex changes
- Reference issues in footer when applicable

**Rationale**: Enables automated changelog generation and clear project history.

### V. Component-Based Architecture

Components MUST be reusable, well-documented, and follow established patterns.

**Structure**:
- UI components: `src/components/ui/` (shadcn/ui)
- Feature components: `src/components/[feature]/`
- Layout components: `src/components/layout/`
- All components must have TypeScript interfaces
- Components should be self-contained and testable

**Requirements**:
- Use shadcn/ui for base components
- Follow existing component patterns
- Document component props and usage
- Keep components focused and single-purpose

**Rationale**: Promotes reusability, maintainability, and consistent UI patterns.

### VI. AI Evaluation Transparency

All AI-powered evaluations MUST be transparent, explainable, and auditable.

**Requirements**:
- AI evaluation logic must be documented and testable
- Evaluation results must include confidence scores and reasoning
- Users must be able to understand why a listing was flagged as undervalued
- AI prompts and evaluation criteria must be version-controlled
- Evaluation accuracy must be measurable and tracked
- Fallback mechanisms required when AI evaluation fails

**Rationale**: Builds user trust, enables debugging, and ensures AI recommendations are reliable and explainable.

### VII. Marketplace Integration Standards

All marketplace API integrations (Amazon, eBay) MUST be robust, rate-limit compliant, and error-resilient.

**Requirements**:
- Respect API rate limits and implement proper throttling
- Handle API failures gracefully with retry logic
- Cache marketplace data appropriately to reduce API calls
- Validate all marketplace data before processing
- Log all API interactions for debugging and monitoring
- Support marketplace API version changes and deprecations

**Rationale**: Ensures reliable data collection, prevents service disruptions, and maintains good relationships with marketplace providers.

### VIII. Data Privacy and Security

User data and purchase recommendations MUST be handled with strict privacy and security standards.

**Requirements**:
- User preferences and watchlists must be encrypted at rest
- API keys and credentials must never be exposed in client code
- Marketplace search history must be anonymized or user-consented
- Purchase recommendations must respect user privacy settings
- All external API calls must use secure connections (HTTPS)
- Sensitive data must not be logged in production

**Rationale**: Protects user privacy and maintains trust in the recommendation system.

### IX. Performance Standards

The application MUST meet Core Web Vitals targets and performance benchmarks.

**Targets**:
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s
- AI evaluation response time: < 5s for single listing
- Marketplace search results: < 2s for initial load

**Requirements**:
- Lazy load components and routes when appropriate
- Optimize images and assets
- Minimize bundle size
- Use Next.js optimizations (Image, Link, etc.)
- Implement efficient caching for marketplace data
- Optimize AI evaluation calls (batch when possible)

**Rationale**: Ensures excellent user experience and SEO performance, especially important for real-time bargain hunting.

### X. Accessibility Compliance

All features MUST be accessible and comply with WCAG 2.1 Level AA standards.

**Requirements**:
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Color contrast ratios meet WCAG standards
- Screen reader compatibility

**Rationale**: Ensures the application is usable by all users, regardless of abilities.

## Development Workflow

### Code Review Process

All changes MUST be reviewed before merging to `main`:

1. Create feature branch
2. Implement changes with tests
3. Ensure all checks pass (lint, type-check, test, build)
4. Create pull request
5. At least one approval required
6. All CI checks must pass
7. Update `doc/implementation_plan.md` before merging (if exists)

### Quality Gates

Before any code is merged:

- ✅ TypeScript compilation passes
- ✅ ESLint passes with no errors
- ✅ All unit/component tests pass
- ✅ E2E tests pass (when applicable)
- ✅ Build succeeds
- ✅ Gitleaks scan passes (security)
- ✅ AI evaluation tests pass (when applicable)
- ✅ Marketplace integration tests pass (when applicable)
- ✅ Implementation plan updated (if exists)

### Implementation Plan Updates

**MANDATORY**: After each commit, update `doc/implementation_plan.md` with (if file exists):
- Feature additions (components, pages, routes)
- Bug fixes and resolutions
- Refactoring changes
- Test additions
- Configuration changes
- API changes
- AI evaluation improvements
- Marketplace integration updates

**Rationale**: Maintains project documentation and provides context for future development.

## Technology Stack

**Framework**: Next.js 15 (App Router)
**Language**: TypeScript (strict mode)
**Styling**: Tailwind CSS v4
**UI Components**: shadcn/ui
**Testing**: Vitest + React Testing Library (unit/component), Playwright (E2E)
**AI Integration**: OpenAI API (for listing evaluation)
**Marketplace APIs**: Amazon Product Advertising API, eBay Finding API
**Animation**: framer-motion
**Icons**: lucide-react

## Governance

### Constitution Authority

This constitution supersedes all other development practices and guidelines. All development decisions MUST align with these principles.

### Amendment Process

1. **Proposal**: Document the proposed change and rationale
2. **Review**: Review impact on existing code and practices
3. **Version Update**: Increment version according to semantic versioning:
   - **MAJOR**: Backward incompatible changes or principle removals
   - **MINOR**: New principles or materially expanded guidance
   - **PATCH**: Clarifications, wording improvements, typo fixes
4. **Update Templates**: Ensure all `.specify/templates/` files reflect changes
5. **Documentation**: Update relevant documentation files

### Compliance

- All PRs must verify compliance with constitution principles
- Code reviews must check adherence to principles
- CI/CD pipelines enforce quality gates
- Complexity must be justified against principles
- AI evaluation changes must include accuracy metrics
- Marketplace integration changes must include rate limit compliance verification

### Development Guidance

For runtime development guidance, refer to:
- `.cursor/rules/` for AI-assisted development rules
- `doc/implementation_plan.md` for project structure and patterns (if exists)
- `doc/GIT_WORKFLOW.md` for detailed git workflow (if exists)
- `README.md` for setup and configuration

**Version**: 1.0.0 | **Ratified**: 2025-01-09 | **Last Amended**: 2025-01-09
