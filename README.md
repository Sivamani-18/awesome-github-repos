# GitHub Repositories Explorer

This project is a web application built with Next.js, React, and Material-UI that allows users to search and browse public GitHub repositories. The application supports both authenticated and unauthenticated requests to the GitHub API, improving rate limits when a GitHub token is provided.

## Features

- Search for public GitHub repositories by name
- Filter repositories by programming language
- Infinite scrolling to load more repositories
- Uses GitHub API v3

## Prerequisites

- Node.js
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Sivamani-18/github-repos-explorer.git
cd github-repos-explorer
```

2. Install the dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your GitHub token (optional but recommended for higher rate limits):

```plaintext
GITHUB_TOKEN=your_github_token_here
```

If you don't have a GitHub token or don't want to use one, you can leave the `GITHUB_TOKEN` variable empty, but note that you will have lower rate limits.

## Usage

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. Open your browser and navigate to `http://localhost:3000`.