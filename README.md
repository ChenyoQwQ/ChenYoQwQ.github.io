# chenyoqwq personal site

一个适合部署到 GitHub Pages 的 Vite + React 个人网页。

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署到 GitHub Pages

1. 新建 GitHub 仓库。
   - 如果你想访问 `https://你的用户名.github.io/`，仓库名必须是 `你的用户名.github.io`。
   - 如果仓库名是普通名字，例如 `portfolio`，访问地址会是 `https://你的用户名.github.io/portfolio/`。
2. 把本项目所有文件推送到 `main` 分支。
3. 进入仓库 `Settings → Pages`。
4. 在 `Build and deployment` 里，把 `Source` 设置为 `GitHub Actions`。
5. 等待 Actions 跑完，Pages 会给出访问地址。
