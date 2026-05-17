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

  if(req.method !== "POST"){
    return res.status(405).json({
      message:"Method not allowed"
    });
  }

  try{

    const buffer = await getBuffer(req);

    const filename=`paper_${Date.now()}.pdf`;

    const content=buffer.toString("base64");

    const githubResponse=await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/contents/pdf/${filename}`,
      {
        method:"PUT",

        headers:{
          Authorization:`token ${process.env.GITHUB_TOKEN}`,
          Accept:"application/vnd.github+json",
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          message:`Added ${filename}`,
          content:content
        })
      }
    );

    const data=await githubResponse.json();

    if(!githubResponse.ok){
      return res.status(500).json({
        message:data.message
      });
    }

    return res.status(200).json({
      message:"PDF uploaded successfully"
    });

  }catch(error){

    return res.status(500).json({
      message:error.message
    });

  }

}