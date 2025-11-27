import axios from 'axios';

const BASE_URL = 'https://newsdata.io/api/1/latest?apikey=pub_c9107702fbf34dc18a975e1455c8e015&country=in&language=en';

export async function fetchNews() {
  try {
    const response = await axios.get(BASE_URL);
    const data = response.data;

    if (data.results && Array.isArray(data.results)) {
      return data.results;
    }

    console.warn('API returned unexpected format:', data);
    return [];
  } catch (err: any) {
    console.log('API fetch error:', err?.response?.status, err?.message);
    return [];
  }
}
