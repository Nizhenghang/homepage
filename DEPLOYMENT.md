# 主页持久化部署指南

> 目标：让 `homepage` 长期在线，任何人可通过公网 URL 访问，且后续代码更新能自动部署。
>
> 方案：**GitHub 仓库 + 腾讯云 EdgeOne Pages（Makers）Git 集成自动部署**
>
> 为什么选这套组合：
> - GitHub 仓库提供源码持久化与版本管理（不会丢失）
> - EdgeOne Pages 提供免费静态托管 + 全球 CDN 加速（国内访问快）
> - Git 集成实现 push 即部署，无需手动操作

---

## 整体流程

```
本地代码 → GitHub 仓库 → EdgeOne Pages 关联仓库 → 自动构建部署 → 公网访问 URL
   ↑                                                           │
   └─────────── 后续更新 push 到 GitHub ────────────────────────┘
```

---

## 步骤一：在 GitHub 创建空仓库

1. 访问 https://github.com/new
2. 填写信息：
   - **Repository name**：`homepage`
   - **Description**：`倪正航的个人主页 — 学生 · 探索者 · 创造者`
   - **可见性**：`Public`（公开，便于 EdgeOne Git 集成；如选 Private 也可，但需 EdgeOne 授权）
   - **不要勾选** "Add a README file"、"Add .gitignore"、"Choose a license"（本地已有这些文件）
3. 点击 **Create repository**
4. 创建后页面会显示仓库地址，形如：
   ```
   https://github.com/Nizhenghang/homepage.git
   ```
   记下这个地址，下一步要用。

---

## 步骤二：推送本地代码到 GitHub

本地仓库已初始化并完成首次提交。在项目根目录执行：

```bash
# 关联远程仓库
git remote add origin https://github.com/Nizhenghang/homepage.git

# 推送到 GitHub
git push -u origin main
```

> **已完成** ✓ — 代码已成功推送到 https://github.com/Nizhenghang/homepage

**认证方式说明**：

GitHub 自 2021 年起不再支持密码推送，需使用以下任一方式：

| 方式 | 适用场景 | 配置方法 |
|---|---|---|
| **Personal Access Token (PAT)** | 一次性配置，简单 | https://github.com/settings/tokens → Generate new token (classic) → 勾选 `repo` 权限 → 复制 token，推送时作为密码粘贴 |
| **SSH Key** | 长期使用，推荐 | `ssh-keygen -t ed25519 -C "你的邮箱"` → 将 `~/.ssh/id_ed25519.pub` 添加到 GitHub Settings → SSH and GPG keys → 改用 `git remote set-url origin git@github.com:Nizhenghang/homepage.git` |
| **GitHub CLI** | 已安装 gh CLI | `gh auth login` 后推送无需额外认证 |

推送成功后，访问 `https://github.com/Nizhenghang/homepage` 应能看到所有文件。

---

## 步骤三：在 EdgeOne 控制台创建项目

1. 访问 [EdgeOne 控制台](https://edgeone.ai/zh/login/redirect?s_url=https://console.tencentcloud.com/edgeone)
   - 首次使用需腾讯云账号登录（微信扫码即可）
2. 进入控制台后，在场景选择大厅选择 **创建项目** → **导入 Git 仓库**
3. 关联 GitHub：
   - 点击 **GitHub** 图标
   - 在弹出页面点击 **Authorize EO Makers** 授权
   - 选择 `Nizhenghang/homepage` 仓库，点击 **Install**

---

## 步骤四：配置构建参数

EdgeOne 会自动识别项目类型。本站为**纯静态站点**，配置如下：

| 配置项 | 值 | 说明 |
|---|---|---|
| **框架预设** | `None` / `Other` | 纯静态，无框架 |
| **构建命令** | 留空 | 无需构建步骤 |
| **输出目录** | `/` 或 `.` | 静态文件就在仓库根目录 |
| **安装命令** | 留空 | 无依赖需要安装 |
| **加速区域** | **中国大陆** 或 **全球** | 面向中国用户建议选"中国大陆"；如需面向国际用户选"全球" |

**关于加速区域的重要提示**：
- 选"中国大陆"：国内访问最快，但**自定义域名需要 ICP 备案**
- 选"全球"或"非中国大陆"：无需备案，但国内访问速度一般
- EdgeOne 提供的默认 `.eo.app` 子域名**无需备案**即可直接访问

4. 确认配置无误后，点击 **开始部署**
5. 等待 1-2 分钟，部署状态变为"成功"即可

---

## 步骤五：验证访问

部署成功后，EdgeOne 会提供一个默认访问域名，格式形如：

```
https://homepage-xxxxxx.eo.app
```

在浏览器打开该链接，应看到完整的个人主页（含宇宙星辰动画）。

**验证清单**：
- [ ] 首页 Hero 区星辰动画正常播放
- [ ] 导航栏滚动时背景变化正常
- [ ] 各 section 滚动出现动画正常
- [ ] 移动端响应式布局正常（用手机或浏览器 DevTools 模拟）
- [ ] 项目卡片链接跳转 GitHub 正常
- [ ] 邮箱链接可正常唤起邮件应用

---

## 步骤六（可选但推荐）：配置自定义域名

EdgeOne 提供的 `.eo.app` 域名可用，但不够专业。建议绑定自定义域名。

### 6.1 获取域名

如已有域名，跳过。如未购买，推荐：
- 腾讯云：https://dnspod.cloud.tencent.com/ （`.com` 约 ¥55/年，`.top`/`.xyz` 约 ¥10/年）
- 阿里云：https://wanwang.aliyun.com/

### 6.2 添加自定义域名

1. 在 EdgeOne 项目页面 → **域名管理** → **添加自定义域名**
2. 输入你的域名（如 `nizhenghang.com` 或 `www.nizhenghang.com`）
3. 根据提示，到域名注册商处添加 CNAME 解析记录：
   ```
   类型：CNAME
   主机记录：@ 或 www
   记录值：EdgeOne 提供的 CNAME 地址
   ```
4. **备案要求**：
   - 加速区域选"中国大陆" → 域名必须完成 ICP 备案（约 7-20 工作日）
   - 加速区域选"全球"且仅海外节点 → 无需备案，但国内访问慢
   - 折中方案：先用 `.eo.app` 默认域名上线，备案完成后再切自定义域名

---

## 后续维护：如何更新网站内容

部署完成后，更新流程非常简单：

```bash
# 1. 本地修改文件（如编辑 index.html）
# 2. 提交更改
git add .
git commit -m "更新项目卡片 / 修改介绍文案"
# 3. 推送到 GitHub
git push
```

EdgeOne 会**自动检测到 push**，在 1-2 分钟内重新构建并部署。无需手动操作。

---

## 常见问题

### Q1: push 后网站没更新？
- 检查 EdgeOne 控制台 → 构建部署 → 最新部署状态是否为"成功"
- 浏览器可能有缓存，按 `Ctrl+F5` 强制刷新
- 确认推送到的是 `main` 分支（EdgeOne 默认监听主干分支）

### Q2: 部署失败怎么办？
- 在 EdgeOne 控制台查看构建日志
- 本站无构建步骤，失败原因通常是仓库结构异常（检查根目录是否有 `index.html`）

### Q3: 想更换部署平台（如迁移到 Vercel）？
- 源码已在 GitHub，任何支持 Git 集成的平台（Vercel/Netlify/Cloudflare Pages）都可直接导入同一仓库
- 各平台配置类似：无构建命令，输出目录为根目录

### Q4: GitHub 仓库会丢失吗？
- 只要 GitHub 服务存在且账号正常，仓库会永久保留
- GitHub 免费账户公开仓库无数量限制
- 建议定期 `git clone` 到本地作为额外备份

### Q5: EdgeOne Pages 免费额度够用吗？
- 个人主页流量极低，免费额度完全够用
- EdgeOne Pages 个人版免费额度：每月构建次数与流量均充足（具体以官方文档为准）
- 如超出免费额度，EdgeOne 会通知，不会直接下线

---

## 当前状态检查清单

- [x] 本地 Git 仓库已初始化（`main` 分支）
- [x] 首次提交完成（commit `372cc96`，7 个核心文件）
- [x] `.gitignore` 已配置（排除工作目录、临时文件）
- [ ] GitHub 远程仓库已创建（需手动操作步骤一）
- [ ] 代码已推送到 GitHub（需手动操作步骤二）
- [ ] EdgeOne 项目已创建（需手动操作步骤三、四）
- [ ] 部署成功并可访问（需手动操作步骤五）
- [ ] 自定义域名已绑定（可选，步骤六）

---

## 附录：项目文件结构

```
homepage/
├── index.html       # 页面结构（导航/Hero/关于/技能/项目/探索/联系/页脚）
├── styles.css       # 样式：宇宙深空主题、响应式、动画
├── script.js        # 交互：导航滚动状态、滚动出现动画
├── cosmos.js        # Hero 背景 Canvas 旋转星辰动画
├── package.json     # 项目元信息（dev 脚本：python -m http.server 5500）
├── README.md        # 项目说明
└── .gitignore       # Git 忽略规则
```

如部署过程中遇到问题，可随时反馈具体步骤与错误信息。
