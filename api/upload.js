export default function handler(req,res){

res.status(200).json({
token: !!process.env.GITHUB_TOKEN,
username: process.env.GITHUB_USERNAME || "missing",
repo: process.env.GITHUB_REPO || "missing"
});

}