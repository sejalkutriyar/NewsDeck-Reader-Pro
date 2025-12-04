import { Platform } from 'react-native';

export async function downloadArticleContent(url: string): Promise<string | null> {
    if (!url) return null;

    try {
        console.log(`Attempting to download article content from: ${url}`);

        // Note: On Web, this will likely fail due to CORS unless the server allows it.
        // On Native, this should work for most static sites.
        let fetchUrl = url;
        if (Platform.OS === 'web') {
            // Use CodeTabs proxy as fallback for others
            fetchUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
        }

        const response = await fetch(fetchUrl);

        if (!response.ok) {
            console.log(`Failed to fetch article: ${response.status} ${response.statusText}`);
            return "Offline content unavailable (Network/CORS error).";
        }

        const html = await response.text();

        // Simple "Reader View" extraction logic
        // 1. Extract text within <p> tags
        // 2. Filter out short/navigational text
        // 3. Join with newlines

        const paragraphRegex = /<p[^>]*>(.*?)<\/p>/gi;
        const matches = html.match(paragraphRegex);

        if (!matches || matches.length === 0) {
            console.log("No paragraphs found in article HTML");
            return null;
        }

        // Clean up tags and entities
        const cleanText = matches
            .map(p => {
                // Remove HTML tags
                let text = p.replace(/<[^>]+>/g, '');
                // Decode common entities
                text = text.replace(/&nbsp;/g, ' ')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'");
                return text.trim();
            })
            .filter(text => text.length > 50) // Filter out short snippets (likely nav/ads)
            .join('\n\n');

        if (cleanText.length < 200) {
            console.log("Extracted content too short, likely failed to parse main content");
            return null;
        }

        console.log(`Successfully downloaded article content (${cleanText.length} chars)`);
        return cleanText;

    } catch (error) {
        console.log("Error downloading article content:", error);
        return null;
    }
}
