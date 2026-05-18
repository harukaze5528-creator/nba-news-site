import Link from "next/link";

type Article = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
  titleJa?: string;
  category?: string;
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

async function fetchArticles(q: string, category: string, apiKey: string): Promise<Article[]> {
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  const articles: Article[] = data.articles ?? [];

  return articles.map((a) => ({ ...a, category }));
}

async function getArticles(): Promise<Article[]> {
  try {
    const apiKey = process.env.NEWS_API_KEY ?? "cd14c7017b66444f80312d97685e5cc1";

    const [trades, quotes, teams, draft] = await Promise.all([
      fetchArticles("NBA trade rumors", "トレード情報", apiKey),
      fetchArticles("NBA player says", "選手の発言", apiKey),
      fetchArticles("NBA team news", "チームニュース", apiKey),
      fetchArticles("NBA draft", "ドラフト注目株", apiKey),
    ]);

    const articles = [...trades, ...quotes, ...teams, ...draft];

    const seen = new Set<string>();
    const unique = articles.filter((a) => {
      if (seen.has(a.url)) return false;
      seen.add(a.url);
      return true;
    });

    const translated = await Promise.all(unique.map((a) => translateText(a.title)));
    unique.forEach((a, i) => (a.titleJa = translated[i]));

    return unique;
  } catch {
    return [];
  }
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <div style={{ padding: 40 }}>
      <h1>NBAニュース</h1>

      {articles.map((article, i) => (
        <Link
          key={i}
          href={`/articles/${encodeURIComponent(article.url)}`}
          style={{ display: "block", marginBottom: 20 }}
        >
          <div style={{ border: "1px solid #ccc", padding: 10 }}>
            <h3>{article.titleJa}</h3>
            <p>{article.title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}