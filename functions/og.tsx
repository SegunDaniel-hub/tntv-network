import { createClient } from "@supabase/supabase-js";
import { Buffer } from "buffer";
import satori from "satori";
import sharp from "sharp";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anonymous key are required.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const handler = async (event: any) => {
  const { id } = event.queryStringParameters;

  if (!id) {
    return {
      statusCode: 400,
      body: "Article ID is required",
    };
  }

  const { data: article, error } = await supabase
    .from("articles")
    .select("title, image")
    .eq("id", id)
    .single();

  if (error || !article) {
    return {
      statusCode: 404,
      body: "Article not found",
    };
  }

  const html = `
    <div style="display: flex; height: 100%; width: 100%; align-items: center; justify-content: center; flex-direction: column; background-image: linear-gradient(to bottom, #dbf4ff, #fff1f1); font-family: 'Inter', sans-serif;">
      <img src="${article.image}" style="width: 50%; height: 50%; object-fit: cover; border-radius: 10px; margin-bottom: 20px;" />
      <div style="font-size: 60px; text-align: center; padding: 0 5%; color: #1a202c;">${article.title}</div>
    </div>
  `;

  try {
    const svg = await satori(html, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: Buffer.from(await fetch("https://rsms.me/inter/font-files/Inter-Regular.woff2").then(res => res.arrayBuffer())),
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: Buffer.from(await fetch("https://rsms.me/inter/font-files/Inter-Bold.woff2").then(res => res.arrayBuffer())),
          weight: 700,
          style: "normal",
        },
      ],
    });

    const png = await sharp(Buffer.from(svg)).png().toBuffer();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "s-maxage=31536000, stale-while-revalidate",
      },
      body: png.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: "Failed to generate image",
    };
  }
};

export { handler };
