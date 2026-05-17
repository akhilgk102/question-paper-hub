export default function handler(req,res){

return res.status(200).json({

hasToken: !!process.env.GITHUB_TOKEN,
tokenStart: process.env.GITHUB_TOKEN?.substring(0,15)

});

}