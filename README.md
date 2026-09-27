# Halo 编辑器超链接卡片插件

Halo 的编辑器插件，能够在编辑器中将普通的超链接转为卡片形式，可以用于丰富网站的内容展示。

## 特性

- 与默认编辑器深度集成，开箱即用。
- 支持行内和块级链接卡片，其中块级卡片支持三种风格。
- 支持为链接的网站设置代理。
- 支持缓存链接信息的请求结果。
- 支持 Dark Mode。

## 安装与使用

1. 在[应用市场](https://www.halo.run/store/apps/app-UpUJA)中安装并启用此插件。
2. 在编辑器中选中一个超链接，如图选择所需链接类型即可。

   ![Editor Doc](./images/editor-doc.png)

## 链接信息与权限

新卡片在转换时自动获取并保存标题、描述、图标和图片，前台展示时不再请求链接信息接口。获取失败或目标网站缺少字段时，仍可保存卡片，并手动填写属性。切换卡片样式会保留信息。

- Bubble 中的 **更新链接信息** 会重新抓取并替换当前信息，可撤销；失败保留原值。
- 修改链接地址后点击 **应用链接**，才会清除旧信息并获取新链接的信息，可撤销。
- 超级管理员可直接获取信息。其他用户需要管理员在其角色中勾选 **获取链接卡片信息**；没有权限仍可创建基础卡片、编辑属性，但不会自动获取，更新按钮也不可用。

### 旧内容与实时获取

**升级后公开的实时获取接口默认关闭。** 旧卡片会显示已有自定义信息，没有保存信息的卡片会显示可点击的基础链接。本版本不会批量迁移或自动改写文章和页面。

可在编辑器逐张更新旧卡片并保存，也可在插件的 **链接信息获取** 设置中开启 **允许实时获取**，恢复旧卡片和手写标签的在线获取。已经保存为静态快照的新卡片不受此开关影响。

**启用 Host 白名单** 是独立的可选限制，默认关闭：

- 不启用白名单：允许访问通过安全校验的任意公网目标。
- 启用白名单：按完整 Host 精确匹配，例如 `www.halo.run`；不同子域名单独填写，不支持通配符、协议、端口或路径。空名单禁止所有目标。
- 重定向目标也必须在白名单内。Bilibili 解析还需要 `api.bilibili.com`，QQ 音乐解析还需要 `c.y.qq.com`。
- 白名单只限制公开接口；有权限的编辑者通过独立 Console 接口获取信息，仍需通过基础出站安全校验。

开启实时获取后，访客可以触发服务器访问外部网站，目标网站可能获知服务器出口 IP。代理设置中的 Host 列表仅用于选择代理，与访问白名单无关。

手写静态标签时显式添加 `data-mode="snapshot"`，即使缺少描述或图片也不会在线获取：

```html
<hyperlink-card
  href="https://www.halo.run"
  data-mode="snapshot"
  custom-title="Halo"
  custom-description="开源建站工具"
></hyperlink-card>
```

两种卡片标签均支持 `data-mode`、`custom-title`、`custom-image` 和 `custom-icon`；块级卡片另支持 `custom-description`。行内和小卡片优先使用图标，大卡片优先使用图片。独立使用 Web Component 时，未提供页面实时获取配置默认不联网。

## 预览

![Editor](./images/editor.png)

![Dark](./images/preview-dark.png)

![Light](./images/preview-light.png)

## 作为标签使用

如果你使用默认编辑器，那么参考上面的[安装与使用](#安装与使用)即可在文章中插入链接卡片。此外，因为此插件的 UI 部分最终会编译为 [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)，所以你可以将其当做一个常规的 HTML 标签插入到网站的任意位置。

### hyperlink-card

块级链接卡片，使用方式：

```html
<hyperlink-card href="https://www.halo.run" target="_blank" theme="regular"></hyperlink-card>
```

参数：

- `href`：链接地址。
- `target`：链接打开方式，可选值为 `_blank`、`_self`，默认为 `_self`。
- `theme`：卡片风格，可选值为 `regular`、`small`、`grid`，默认为 `regular`。

### hyperlink-inline-card

行内链接卡片，使用方式：

```html
<hyperlink-inline-card href="https://www.halo.run" target="_blank"></hyperlink-inline-card>
```

参数：

- `href`：链接地址。
- `target`：链接打开方式，可选值为 `_blank`、`_self`，默认为 `_self`。

## 主题适配

### 自定义样式

此插件通常无需主题主动适配，可以开箱即用，但也暴露出了部分 CSS 变量。

目前已提供的 CSS 变量：

| 变量名                                        | 描述                 |
| --------------------------------------------- | -------------------- |
| `--halo-hyperlink-card-bg-color`              | 卡片背景颜色         |
| `--halo-hyperlink-card-inline-bg-color`       | 行内卡片背景颜色     |
| `--halo-hyperlink-card-inline-hover-bg-color` | 行内卡片悬停背景颜色 |
| `--halo-hyperlink-card-title-color`           | 标题颜色             |
| `--halo-hyperlink-card-inline-title-color`    | 行内标题颜色         |
| `--halo-hyperlink-card-description-color`     | 描述文字颜色         |
| `--halo-hyperlink-card-link-color`            | 链接颜色             |
| `--halo-hyperlink-card-bg-gradient`           | 背景渐变             |
| `--halo-hyperlink-card-border-color`          | 边框颜色             |
| `--halo-hyperlink-card-border-hover-color`    | 边框悬停颜色         |

<details>
<summary>点击查看 CSS 代码模板</summary>

```css
:root {
  --halo-hyperlink-card-bg-color: ;
  --halo-hyperlink-card-inline-bg-color: ;
  --halo-hyperlink-card-inline-hover-bg-color: ;

  --halo-hyperlink-card-title-color: ;
  --halo-hyperlink-card-inline-title-color: ;

  --halo-hyperlink-card-description-color: ;
  --halo-hyperlink-card-link-color: ;
  --halo-hyperlink-card-bg-gradient: ;
  --halo-hyperlink-card-border-color: ;
  --halo-hyperlink-card-border-hover-color: ;
}
```

</details>

### 配色切换方案

根据上面提供的 CSS 变量，也可以通过定义 CSS 变量的方式为链接卡片提供动态切换配色的功能。

以下是实现示例，你可以根据需求自行修改选择器或者媒体查询。

<details>
<summary>点击查看示例</summary>

```css
@media (prefers-color-scheme: dark) {
  .color-scheme-auto,
  [data-color-scheme="auto"] hyperlink-card {
    color-scheme: dark;
    --halo-hyperlink-card-bg-color: #18181b;
    --halo-hyperlink-card-inline-bg-color: #3f3f46;
    --halo-hyperlink-card-inline-hover-bg-color: #52525b;

    --halo-hyperlink-card-title-color: #f4f4f5;
    --halo-hyperlink-card-inline-title-color: #f4f4f5;

    --halo-hyperlink-card-description-color: #a1a1aa;
    --halo-hyperlink-card-link-color: #e4e4e7;
    --halo-hyperlink-card-bg-gradient: linear-gradient(#454545, #454545), linear-gradient(transparent, transparent);
    --halo-hyperlink-card-border-color: #52525b;
    --halo-hyperlink-card-border-hover-color: #e4e4e7;
  }
}

.color-scheme-dark,
.dark,
[data-color-scheme="dark"] hyperlink-card {
  color-scheme: dark;
  --halo-hyperlink-card-bg-color: #18181b;
  --halo-hyperlink-card-inline-bg-color: #3f3f46;
  --halo-hyperlink-card-inline-hover-bg-color: #52525b;

  --halo-hyperlink-card-title-color: #f4f4f5;
  --halo-hyperlink-card-inline-title-color: #f4f4f5;

  --halo-hyperlink-card-description-color: #a1a1aa;
  --halo-hyperlink-card-link-color: #e4e4e7;
  --halo-hyperlink-card-bg-gradient: linear-gradient(#454545, #454545), linear-gradient(transparent, transparent);
  --halo-hyperlink-card-border-color: #52525b;
  --halo-hyperlink-card-border-hover-color: #e4e4e7;
}
```

</details>

此外，为了让主题可以更加方便的适配暗黑模式，此插件也提供了一套暗黑模式的配色方案，主题可以直接使用此方案，而不需要自己去适配暗黑模式，适配方式如下：

1. 在 html 或者 body 标签添加 class：
   1. `color-scheme-auto`：自动模式，根据系统的暗黑模式自动切换。
   2. `color-scheme-dark` / `dark`：强制暗黑模式。
   3. `color-scheme-light` / `light`：强制明亮模式。
2. 在 html 或者 body 标签添加 `data-color-scheme` 属性：
   1. `auto`：自动模式，根据系统的暗黑模式自动切换。
   2. `dark`：强制暗黑模式。
   3. `light`：强制明亮模式。
