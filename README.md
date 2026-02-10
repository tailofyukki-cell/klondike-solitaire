# 🃏 Klondike Solitaire

クラシックなソリティア（Klondike）をブラウザで楽しめるWebゲームです。直感的な操作で誰でも簡単にプレイできます。

## 🎮 プレイ方法

### 公開URL
**GitHub Pages**: https://tailofyukki-cell.github.io/klondike-solitaire/

### ゲームの目的
すべてのカードを組札（Foundation）に移動させることが目標です。組札は各スート（ハート、ダイヤ、クラブ、スペード）ごとにA→Kの昇順で積み上げます。

### ルール

#### 場札（Tableau）
- 赤と黒のカードを交互に配置します
- 降順（K→A）で積み重ねます
- 空の列にはKのみ配置できます
- 表向きのカードのみ移動可能です
- カードを移動すると、その下の裏向きカードが自動的に表向きになります

#### 組札（Foundation）
- 各スートごとにA→Kの昇順で積み上げます
- 空の組札にはAのみ配置できます

#### 山札（Stock）と捨て札（Waste）
- 山札をクリックすると捨て札にカードがめくられます
- 1枚めくりまたは3枚めくりを設定で選択できます
- 山札が尽きたら、捨て札を山札に戻すことができます

### 操作方法

#### PC
- **ドラッグ&ドロップ**: カードを移動させます
- **クリック**: 山札をめくります
- **ダブルクリック**: カードを自動的に組札へ移動させます（可能な場合）

#### スマートフォン・タブレット
- **タップ**: カードを選択し、移動先をタップします
- **タップ**: 山札をめくります

### ボタン
- **New Game**: 新しいゲームを開始します
- **Undo**: 1手戻します
- **Settings**: 山札のめくり方（1枚/3枚）を変更します

## 🚀 ローカル実行方法

### 必要なもの
- モダンブラウザ（Chrome、Firefox、Safari、Edge）

### 実行手順

1. リポジトリをクローン
```bash
git clone https://github.com/tailofyukki-cell/klondike-solitaire.git
cd klondike-solitaire
```

2. ローカルサーバーを起動（例：Python）
```bash
python3 -m http.server 8080
```

3. ブラウザで開く
```
http://localhost:8080
```

または、`index.html` を直接ブラウザで開くこともできます。

## 🛠️ 技術スタック

- **HTML5**: ゲームの構造
- **CSS3**: スタイリングとレスポンシブデザイン
- **JavaScript (ES6)**: ゲームロジックとインタラクション
- **ローカルストレージ**: 設定の保存

## 📁 ファイル構成

```
klondike-solitaire/
├── index.html          # メインHTMLファイル
├── styles.css          # スタイルシート
├── main.js             # ゲームロジック
└── README.md           # このファイル
```

## 🎯 実装機能

- ✅ クラシックなKlondikeルール
- ✅ ドラッグ&ドロップによる直感的な操作
- ✅ ダブルクリックで自動移動
- ✅ 1枚めくり/3枚めくりの切替
- ✅ Undo機能（1手戻す）
- ✅ タイマーと手数カウンター
- ✅ クリア時の祝福メッセージ
- ✅ レスポンシブデザイン（モバイル対応）
- ✅ ローカルストレージによる設定保存

## 📜 ライセンス

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 🙏 謝辞

このプロジェクトは100日チャレンジの一環として作成されました。
