# ThriveCart assignment

Accorrding to the assignment, I needed to implement a basket with interface and methods. I took this, together with the fact that I was asked about working with legacy code during the first interview, as a hint towards this being a class implementation of the cart. I would like to be explicit and say that if I had to build this without assignment, I would follow a more react approach with something like Zustand for the store with atomic state subscriptions and automatic updates + pure functions to control the actions. However, the assignment was about implementing the interface (which I thought is a class), so that is what I did.

## Tech Stack

This application could use SSR, but given the assignment mentioning simple Typescript and React UI, I thought I will use CSR in this particular case. However, I thought about the possibility to use SSR and frameworks like Next.js or Tanstack start for SSR.

- **Vite**
- **React 19** - Latest React version
- **TypeScript** - Type safety and better developer experience.
- **Tailwind CSS** - My favorite CSS framework I would use in every project for simplicity and faster development.
- **shadcn** - An extremely popular ui component library that is accessible, customizable and popular these days.
- **TanStack Query (React Query)** - Offers great DX when working with it as well as many features such as caching, and automatic refetching..
- **Vitest** and **@testing-library/react** - Performant and quite popular testing libraries to enable faster test writing.

## How I approached this task

This task is simple in its nature, but the fact that class has to be used makes it a bit harded to create in React, because you have to make the UI reactive to the cart changes. You will see the following structure in the project:

```
src/
├── api/        # Where all api requests would live, but right now it is just mocked requests
├── components/ # All shadcn and app UI components live here
├── context/    # Logic for the shared basket context lives here
├── features/   # I was not sure how to call this folder, but all the cart class logic lives here
├── hooks/      # Custom hooks live here (for example, useBasket)
├── lib/        # default folder for shadcn utils, can be ignored
├── types/      # Place to keep all the types
```

In order to make react react (pun intended) to the changes in class, logic with notifications and subscriptions has been implemented. However, that would result in all the components being rerendered all the time once a small thing changes. To remove unnecessary rerenders custom selectors have been implemented in src/hooks/useBasket.tsx. Sometimes that is not enough, hence other optimizations like CartItemComponent with memo or useMemo for memoizing some values across the app. The UI is not the best and not very polished, because the assignment didn't require a splendid one. The app is also developed with accessibility in mind. It mostly comes from the shadcn library and semantic HTML, because the application is not that complex. For testing vitest and react testing library have been chosen. I tried to cover business logic with tests, but decided to not write E2E tests as it would be an overkill for the assignment, imo. This, however, was considered and is something I would write when shipping code to production.

### Future Improvements

- Increased test coverage
- E2E tests using cypress or playwright
- A11y testing using axe-core
- Ui adjustments
- Value calulation and formatting logic
- Proper data retrieval from backend
- Better error handling
- Performance optimizations
- Many more

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`
