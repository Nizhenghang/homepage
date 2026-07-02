# 倪正航个人主页

这是从线上主页整理出的本地开发版本，适合直接在 VS Code 里修改和预览。

## 文件结构

- `index.html`：页面内容和结构
- `styles.css`：页面样式、布局、响应式适配和动画
- `script.js`：导航滚动状态和滚动出现动画
- `.vscode/`：VS Code 推荐插件、设置和本地预览任务

## 在 VS Code 中打开

```powershell
code .
```

## 本地预览

方式一：使用 VS Code 任务

1. 按 `Ctrl+Shift+P`
2. 输入 `Tasks: Run Task`
3. 选择 `Start local preview`
4. 浏览器打开 `http://localhost:5500`

方式二：直接运行命令

```powershell
python -m http.server 5500
```

然后访问：

```text
http://localhost:5500
```

## 常改位置

- 修改姓名、介绍、项目、联系方式：编辑 `index.html`
- 修改颜色、间距、字体、卡片样式：编辑 `styles.css` 里的 `:root` 和对应 class
- 修改滚动动画或交互：编辑 `script.js`

## 部署

这是纯静态站点，可以部署到 GitHub Pages、Cloudflare Pages、Vercel、Netlify 或任意静态网页托管服务。
