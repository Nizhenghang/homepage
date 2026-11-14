# 倪正航个人主页

倪正航（Zhenghang NI）的个人主页与简历，纯静态站点，版式参照 AcademicPages / [WowPage](https://wd7ang.github.io/)。
线上地址：https://nizhenghang.github.io/homepage/

## 文件结构

- `index.html`：主页（News / Experience / Publications / Projects / Blog / Talks / Reports / Awards / Services）
- `cv/index.html`：简历页，「打印 / 保存 PDF」按钮导出单页 A4
- `cv/resume.pdf`：简历 PDF 快照（内容改动后用页面按钮重新导出替换）
- `assets/css/`、`assets/js/`、`assets/fonts/`：样式、交互、自托管字体
- `images/`：头像、证件照、项目配图、校徽
- `.nojekyll`：让 GitHub Pages 原样 serving 全部资产

## 本地预览

```powershell
python -m http.server 5500
```

浏览器打开 http://localhost:5500

## 常改位置

- 简介、项目、联系方式：`index.html` 与 `cv/index.html`
- 颜色、间距、卡片样式：`assets/css/main.css` 的 `:root` 变量与对应 class
- 留空分区统一为 "To be updated."，补充内容时直接替换

## 部署

推送到 `main` 后 GitHub Pages 自动更新（仓库根目录即站点根）。