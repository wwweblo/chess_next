<div align="center">

<h3 align="center">Chess</h3>

   <div align="center">
   Train, learn, win
    </div>
</div>

## 📋 <a name="table">Menu</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)

## <a name="introduction">🤖 Introduction</a>
Diploma project for college. Chess website to learn chess


## <a name="tech-stack">⚙️ Tech Stack</a>

- React 19
- Next.js 15
- Sanity
- TailwindCSS
- ShadCN
- TypeScript
- Web-Socket
- sqlite3

## <a name="features">🔋 Features</a>

👉 **Stockfish**: play with bot

👉 **Online**: play against other players

👉 **Openings database**: learn position names

## <a name="quick-start">🤸 Quick Start</a>

**Cloning the Repository**

```bash
git clone https://github.com/wwweblo/chess_next.git
cd chess_next
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION='vX'
SANITY_TOKEN=

AUTH_SECRET= 
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

Replace the placeholder values with your actual Sanity credentials. You can obtain these credentials by signing up &
creating a new project on the [Sanity website](https://www.sanity.io/).

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

```bash
npm run server
```
