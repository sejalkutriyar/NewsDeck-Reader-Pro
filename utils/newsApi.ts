const API_KEY = "12345abcde";
const BASE_URL = "https://newsapi.org/v2/top-headlines?country=in";

export async function fetchNews() {
  try {
    const response = await fetch(`${BASE_URL}&apiKey=${API_KEY}`);
    const json = await response.json();
    return json.articles;
  } catch (err) {
    console.log("API fetch error", err);
    return [];
  }
}
