import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 自动兼容两种 GitHub Pages：
// 1. 仓库名是 username.github.io：访问 https://username.github.io/
// 2. 普通仓库：访问 https://username.github.io/repo-name/
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";
const isUserSite = repository.endsWith(".github.io");

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS
    ? isUserSite
      ? "/"
      : `/${repository}/`
    : "/",
});
