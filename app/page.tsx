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
    const apiKey = process.env.NEWS_API_KEY ?? "cd14c7017b66444f80312d97685e5cc1";
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=NBA&language=en&sortBy=publishedAt&pageSize=12&apiKey=${apiKey}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data.articles ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", color: "#111", fontFamily: "'Helvetica Neue', sans-serif" }}>

      {/* ヘッダー */}
      <header style={{ background: "linear-gradient(135deg, #003DA5 0%, #C8102E 100%)", padding: "0 0 0 0", boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -1, lineHeight: 1 }}>
              🏀 NBA速報
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: 3, marginTop: 4 }}>
              PAINT AREA
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: 1 }}>
              {new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
              最新NBAニュース
            </div>
          </div>
        </div>

        {/* ナビバー */}
        <div style={{ background: "rgba(0,0,0,0.25)", padding: "0 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 0 }}>
            {["トップ", "試合結果", "チーム", "選手", "プレイオフ"].map((item) => (
              <div key={item} style={{ padding: "10px 20px", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, cursor: "pointer", borderBottom: item === "トップ" ? "3px solid #fff" : "3px solid transparent" }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {/* セクションタイトル */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 4, height: 24, background: "#C8102E", borderRadius: 2 }} />
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#003DA5", letterSpacing: 1 }}>最新ニュース</h2>
          <div style={{ fontSize: 11, color: "#999", marginLeft: 8 }}>英語記事（原文）</div>
        </div>

        {articles.length === 0 && (
          <p style={{ color: "#999", textAlign: "center", paddingTop: 80 }}>記事を読み込み中...</p>
        )}

        {/* 記事グリッド */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {articles.map((article, i) => (
            <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e8e8e8", height: "100%", transition: "transform 0.2s" }}>
                {article.urlToImage && (
                  <div style={{ position: "relative" }}>
                    <img src={article.urlToImage} alt="" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", top: 10, left: 10, background: "#C8102E", color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: 2, padding: "3px 8px", borderRadius: 2 }}>
                      NBA
                    </div>
                  </div>
                )}
                <div style={{ padding: "16px 20px 20px" }}>
                  <div style={{ fontSize: 10, color: "#003DA5", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
                    {article.source.name} · {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 10px", color: "#111", lineHeight: 1.5 }}>
                    {article.title}
                  </h3>
                  <p style={{ fontSize: 12, color: "#666", lineHeight: 1.7, margin: "0 0 12px" }}>
                    {article.description}
                  </p>
                  <div style={{ fontSize: 11, color: "#003DA5", fontWeight: 600 }}>
                    続きを読む →
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>

      {/* フッター */}
      <footer style={{ background: "#003DA5", color: "rgba(255,255,255,0.6)", textAlign: "center", padding: "24px", fontSize: 11, marginTop: 48 }}>
        NBA速報 - Paint Area · 非公式NBAニュースまとめサイト · {new Date().getFullYear()}
      </footer>
    </div>
  );
}