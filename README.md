# SAIL EMD CMO Dashboard ([Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/) + [PostGreSQL](https://www.postgresql.org/))

## Installation
- If you do not have git installed, download the [zip file](https://github.com/JustVoiD1/SAIL-EMD-DashBoard/archive/refs/heads/main.zip)
- If you have git installed in your machine, run this command
```bash
git clone git@github.com:JustVoiD1/SAIL-EMD-DashBoard.git
```
- This requires Node.js if you don't have Node.js installed, download and install Node.js from [https://nodejs.org/en/download](https://nodejs.org/en/download)
- If you have Node.js installed, run this command to install all the dependencies:
```bash
npm install
```
- Once you have all the dependencies installed create a `.env` or `.env.local` paste the environment variables as shown in .env.example
```bash
DB_URI=your_database_uri
JWT_SECRET=your_jwt_secret
```
- finally start the server by running
```bash
npm run dev
```
- You will get both `localhost:PORT` url and a `NETWORKURL:PORT` url.
- You can use the `NETWORKURL:PORT` in different client machines to access the Dashboard web application connected to the same network with the machine running the server

- This project is made by [JustVoiD1](https://github.com/JustVoiD1) with ❤️
