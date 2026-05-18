type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
};

async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch("http://localhost:3000/api/news", { cache: "no-store" });
    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#f0f0f0", fontFamily: "Georgia, serif" }}>
      {/* ヘッダー */}
      <header style={{ background: "#111", borderBottom: "1px solid #222", padding: "20px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>
              HOOPS<span style={{ color: "#c8102e" }}>日本</span>
            </div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#555", fontFamily: "monospace" }}>NBA NEWS IN JAPANESE</div>
          </div>
          <div style={{ fontSize: 12, color: "#555", fontFamily: "monospace" }}>
            {new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </header>

      {/* ニュース一覧 */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        {articles.length === 0 && (
          <p style={{ color: "#555", fontFamily: "monospace", textAlign: "center", paddingTop: 80 }}>
            記事を読み込み中...またはAPIキーを確認してください。
          </p>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {articles.map((article, i) => (
            <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <div style={{ background: "#111", border: "1px solid #222", cursor: "pointer", height: "100%" }}>
                {article.urlToImage && (
                  <img src={article.urlToImage} alt="" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
                )}
                <div style={{ padding: 24 }}>
                  <div style={{ fontSize: 10, color: "#c8102e", fontFamily: "monospace", letterSpacing: 2, marginBottom: 10 }}>
                    {article.source.name} · {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
                  </div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 10px", color: "#eee", lineHeight: 1.5 }}>
                    {article.title}
                  </h2>
                  <p style={{ fontSize: 12, color: "#777", lineHeight: 1.7, margin: 0, fontFamily: "sans-serif" }}>
                    {article.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}