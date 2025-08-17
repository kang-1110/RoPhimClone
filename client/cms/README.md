# Init Source CMS

## Getting started

> My Frontend Project is a web application that helps users manage their work more effectively.
> The application is built with React JS, TypeScript, React Query and Ant Design.

## 🛠️ Architecture

- ⚛️ ReactJS + Vite
- 🎨 Tailwind CSS + Ant Design 5
- 🔄 React Query 6 + Axios
- 🌍 React Router Dom 6 + Node 18 and above

## 🛠️ How to Start Resource

# Clone the repository

git clone https://github.com/hitek-hoado-dev/Init-source-react.git

# Navigate to the project folder

cd project

# Add `.env` file

Tạo file `.env` trong thư mục gốc dự án với nội dung như sau:

```
VITE_API_URL=
VITE_SOCKET_URL=
VITE_COOKIE_KEY_SECRET=
VITE_BUILD=
VITE_SUPPORT_LANGUAGE=true/false
```

# Install dependencies

yarn install

# Start the project

yarn dev

## 🚀 How to Build and Deploy

- Auto build and deploy by Vercel dev branch

# Setting environment in Vercel

# Push new code in dev branch

git add .
git commit -m 'Commit message'
git push origin dev

# Check the deployment results in Vercel or Gitlab

# Check preview link Vercel

Link:
Account:

# Add tag in Gitlab

## 🏗️ Project Structure

Explain the folder structure and where key components are located.
/project-root
│── src/ # Source code
│ ├── api/ # APIs in the project
│ ├── components/ # Reusable UI components
│ ├── constants/ # Default Setting Enum
│ ├── hooks/ # GlobalVariableProvider and React Query Hook
│ ├── pages/ # Page components
│ ├── types/ # Type and Interface of TypeScript
│ ├── utils/ # Utility functions and Format Enum
│── public/ # Static assets
│── .env # Environment
│── package.json # Dependencies and scripts
│── taiwind.config.js # Tailwind configuration
│── postcss.config.js # Support tailwind to build configuration
│── tsconfig.json # Typescript configuration
│── vite.config.js # Vite configuration
│── README.md # Project documentation
