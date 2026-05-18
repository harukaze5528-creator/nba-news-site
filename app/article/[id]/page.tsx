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

async function getArticle(url: string): Promise<Article | null> {
  try {
    const apiKey = process.env.NEWS_API_KEY ?? "cd14c7017b66444f80312d97685e5cc1";

    const res = await fetch(
      `https://newsapi.org/v2/everything?q=NBA&language=en&sortBy=publishedAt&pageSize=50&apiKey=${apiKey}`,
      { cache: "no-store" }
    );

    const data = await res.json();
    const articles: Article[] = data.articles ?? [];

    const decodedUrl = decodeURIComponent(url);

    const article = articles.find((a) => a.url === decodedUrl);
    if (!article) return null;

    article.titleJa = await translateText(article.title);

    const text = article.description ?? article.content ?? "";
    article.descriptionJa = await translateText(text);

    return article;
  } catch {
    return null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await getArticle(params.id);

  if (!article) return <div>記事が見つかりません</div>;

  return (
    <div style={{ padding: 40 }}>
      <h1>{article.titleJa}</h1>
      <p>{article.title}</p>

      {article.urlToImage && (
        <img src={article.urlToImage} style={{ width: 400 }} />
      )}

      <p>{article.descriptionJa}</p>

      <a href={article.url} target="_blank">
        元記事を見る
      </a>
    </div>
  );
}