# 使用代理安裝依賴說明

如果你的環境需要使用代理來安裝 npm 套件，可以使用以下方法：

## 方法 1：使用專案腳本（推薦）

已經在 `package.json` 中添加了 `install:proxy` 腳本，直接運行：

```bash
npm run install:proxy
```

## 方法 2：命令行參數

直接在命令中添加代理參數：

```bash
npm install --proxy=http://proxyprod.bd.net:8080 --https-proxy=http://proxyprod.bd.net:8080
```

## 方法 3：設置環境變量（Windows PowerShell）

```powershell
$env:HTTP_PROXY="http://proxyprod.bd.net:8080"
$env:HTTPS_PROXY="http://proxyprod.bd.net:8080"
npm install
```

## 方法 4：設置環境變量（Windows CMD）

```cmd
set HTTP_PROXY=http://proxyprod.bd.net:8080
set HTTPS_PROXY=http://proxyprod.bd.net:8080
npm install
```

## 方法 5：永久配置 npm（全局設置）

如果你想永久設置代理（適用於所有 npm 命令）：

```bash
npm config set proxy http://proxyprod.bd.net:8080
npm config set https-proxy http://proxyprod.bd.net:8080
```

之後就可以正常使用 `npm install` 了。

要移除代理設置：
```bash
npm config delete proxy
npm config delete https-proxy
```

## 檢查當前代理設置

```bash
npm config get proxy
npm config get https-proxy
```

## 注意事項

- 如果代理需要認證，格式為：`http://username:password@proxyprod.bd.net:8080`
- 某些公司代理可能需要同時設置 `HTTP_PROXY` 和 `HTTPS_PROXY`
- 如果遇到 SSL 證書問題，可能需要設置：`npm config set strict-ssl false`（不推薦，僅在必要時使用）

