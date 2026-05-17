export const config = {
  api: {
    bodyParser: false
  }
};

async function getBuffer(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

export default async function handler(req, res) {

  try {

    const buffer = await getBuffer(req);

    const filename = `paper_${Date.now()}.pdf`;

    const token = process.env.GITHUB_TOKEN;
    const username = process.env.GITHUB_USERNAME;
    const repo = process.env.GITHUB_REPO;

    const content = buffer.toString("base64");

    const githubResponse = await fetch(
      `https://api.github.com/repos/${username}/${repo}/contents/pdf/${filename}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message: `Upload ${filename}`,
          content: content
        })
      }
    );

    const data = await githubResponse.json();

    return res.status(githubResponse.status).json(data);

  } catch(error){

    return res.status(500).json({
      message:error.message
    });

  }

}