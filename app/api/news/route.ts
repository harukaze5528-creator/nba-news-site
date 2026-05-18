export async function GET() {
  try {
    const apiKey = process.env.NEWS_API_KEY ?? "cd14c7017b66444f80312d97685e5cc1";
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=NBA&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return Response.json(data.articles || []);
  } catch (e) {
    console.error("Error:", e);
    return Response.json([]);
  }
}