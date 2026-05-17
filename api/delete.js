export default async function handler(req,res){

if(req.method!=="POST"){
return res.status(405).json({
message:"Method not allowed"
});
}

try{

const {filename,password}=req.body || {};

if(!filename){

return res.status(400).json({
message:"Filename missing"
});

}

if(password!==process.env.ADMIN_PASSWORD){

return res.status(401).json({
message:"Wrong password"
});

}

const url=
`https://api.github.com/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/contents/pdf/${filename}`;


const getResponse=await fetch(
url,
{
headers:{
Authorization:`Bearer ${process.env.GITHUB_TOKEN}`,
Accept:"application/vnd.github+json"
}
}
);

const fileData=await getResponse.json();

if(!fileData.sha){

return res.status(404).json({
message:"File not found"
});

}

const deleteResponse=await fetch(
url,
{

method:"DELETE",

headers:{
Authorization:`Bearer ${process.env.GITHUB_TOKEN}`,
Accept:"application/vnd.github+json",
"Content-Type":"application/json"
},

body:JSON.stringify({

message:`Delete ${filename}`,
sha:fileData.sha

})

}

);

const result=await deleteResponse.json();

if(!deleteResponse.ok){

return res.status(500).json({
message:result.message
});

}

return res.status(200).json({
message:"Deleted successfully"
});

}catch(error){

return res.status(500).json({
message:error.message
});

}

}