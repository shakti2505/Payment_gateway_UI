# Paygate

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Installation
First, clone the repository and install the required dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install


npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev


🧠 Decisions Taken (Architecture & Tech Stack)

Framework: Next.js (App Router) was chosen for its robust server-side rendering (SSR), static site generation (SSG) capabilities, and simplified routing through the file system.

Styling: (Tailwind CSS is used for rapid, utility-first styling, ensuring a responsive and maintainable design system).


State Management: ( Zustand was selected to handle global state as it does not have boilerplate and its easy to setup and maintain)

Component Strategy: Kept components small and separated by responsibility. Extracted complex logic into custom hooks to keep JSX clean and readable.

Improvement: I would have add a in-memory rate limitor or simulated ip-check in route.ts, return 429 status code if a single ip hits the route more than 5 times in a minute to prevent the spams on /api/pay route.