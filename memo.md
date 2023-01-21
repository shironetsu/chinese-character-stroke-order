# メモ

## Vite + Wasm

### 公式docs
- Vite: [Vite \| Next Generation Frontend Tooling](https://vitejs.dev/)
- wasm-pack: [Introduction \- Hello wasm\-pack\!](https://rustwasm.github.io/docs/wasm-pack/introduction.html)

### 組み合わせ+Vercelへのデプロイ方法。

- [vite \(react\.ts\) で wasmを動かす](https://zenn.dev/pilefort/articles/fd90d9f6a426f9)
- [Vercelでwasm\-packを使ってRust wasmをビルドする](https://zenn.dev/seanchas_t/scraps/18bd58533692ed)
- [Deploying a WASM\-Powered React App on Vercel \| by Mukkund Sunjii \| Better Programming](https://betterprogramming.pub/deploying-a-wasm-powered-react-app-on-vercel-cf3cae2a75d6)

リポジトリ内であればViteディレクトリ外のクレートもデプロイ時に参照できる。
`wasm-pack` で作成したVite内のクレートの `Cargo.toml` に
```
[dependencies]
wasm-bindgen = "0.2.63"
chinese-character-stroke-order = { path = "../../chinese-character-stroke-order" }
```
のように相対パスでしていすると良い。

使っていないがgitリポジトリもここに加えられる。

- [rust \- How to use a local unpublished crate? \- Stack Overflow](https://stackoverflow.com/questions/33025887/how-to-use-a-local-unpublished-crate)
- [Specifying Dependencies \- The Cargo Book](https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html)

### Tips

`wasm-pack build --target=web`で（バンドルせずに）ビルドしているため、ブラウザからWasmをロードして初期化する必要がある。hooksにまとめると簡便。

- [Getting Started with React and WASM using Hooks \| codeburst](https://codeburst.io/getting-started-with-react-and-webassembly-using-hooks-441818c91608)
- [お気軽に Wasm の動作確認する用のテンプレート作った \| blog\.ojisan\.io](https://blog.ojisan.io/wasm-vite-template/)

## Chakra UI
### 公式docs
- [Vite \- Chakra UI](https://chakra-ui.com/getting-started/vite-guide)

