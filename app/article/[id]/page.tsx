type Article = {
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
  titleJa?: string;
  descriptionJa?: string;
  contentJa?: string;
};

async function translateText(text: string): Promise<string> {
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ja&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await res.json();
    return data[0].map((item: [string]) => item[0]).join("") ?? text;
  } catch {
    return text;
  }
}

async function getArticle(id: string): Promise<Article | null> {
  try {
    const apiKey = process.env.NEWS_API_KEY ?? "cd14c7017b66444f80312d97685e5cc1";
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=NBA&language=en&sortBy=publishedAt&pageSize=50&apiKey=${apiKey}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    const articles: Article[] = data.articles ?? [];
    const article = articles[parseInt(id)];
    if (!article) return null;

    article.titleJa = await translateText(article.title);

    // contentからゴミを除去して翻訳
    const rawContent = article.content ?? article.description ?? "";
    const cleanContent = rawContent.replace(/\[\+\d+ chars\]/g, "").trim();
    const fullText = article.description
      ? article.description + " " + cleanContent
      : cleanContent;

    article.descriptionJa = fullText ? await translateText(fullText) : "";
    return article;
  } catch {
    return null;
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#999" }}>記事が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Helvetica Neue', sans-serif" }}>
      <header style={{ background: "linear-gradient(135deg, #003DA5 0%, #C8102E 100%)", boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: -1, lineHeight: 1 }}>🏀 NBA速報</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 3, marginTop: 4 }}>PAINT AREA</div>
          </a>
          <a href="/" style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none", border: "1px solid rgba(255,255,255,0.4)", padding: "8px 16px", borderRadius: 4 }}>
            ← トップに戻る
          </a>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
          {article.urlToImage && (
            <img src={article.urlToImage} alt="" style={{ width: "100%", height: 400, objectFit: "cover", display: "block" }} />
          )}
          <div style={{ padding: "32px" }}>
            <div style={{ fontSize: 11, color: "#003DA5", fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>
              {article.source.name} · {new Date(article.publishedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 8px", color: "#111", lineHeight: 1.4 }}>
              {article.titleJa}
            </h1>
            <p style={{ fontSize: 13, color: "#aaa", fontStyle: "italic", margin: "0 0 24px", lineHeight: 1.5 }}>
              {article.title}
            </p>
            <div style={{ width: "100%", height: 2, background: "linear-gradient(90deg, #003DA5, #C8102E)", marginBottom: 24, borderRadius: 1 }} />
            <p style={{ fontSize: 16, color: "#444", lineHeight: 2, margin: "0 0 32px", whiteSpace: "pre-wrap" }}>
              {article.descriptionJa}
            </p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "linear-gradient(135deg, #003DA5, #C8102E)", color: "#fff", padding: "14px 28px", borderRadius: 6, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
              元記事を読む（英語）→
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}