export default async function handler(req,res){

if(req.method!=="POST"){
return res.status(405).json({
message:"Method not allowed"
});
}

try{

const {filename}=req.body;

const getFile=await fetch(
`https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/contents/pdf/${filename}`,
{
headers:{
Authorization:`token ${process.env.GITHUB_TOKEN}`
}
}
);

const fileData=await getFile.json();

const deleteResponse=await fetch(
`https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/contents/pdf/${filename}`,
{

method:"DELETE",

headers:{
Authorization:`token ${process.env.GITHUB_TOKEN}`,
"Content-Type":"application/json"
},

body:JSON.stringify({

message:`Deleted ${filename}`,

sha:fileData.sha

})

}

);

const data=await deleteResponse.json();

return res.status(200).json({

message:"Deleted successfully"

});

}catch(error){

return res.status(500).json({

message:error.message

});

}

}