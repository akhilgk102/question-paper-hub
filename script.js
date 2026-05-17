const token="git push -u origin main";

const username="akhilgk102";

const repo="question-paper-hub";

async function uploadPDF(){

let file=document.getElementById("pdf").files[0];

if(!file){

alert("Select PDF");

return;

}

const reader=new FileReader();

reader.onload=async function(){

let content=reader.result.split(",")[1];

let path="pdf/"+file.name;

const response=await fetch(

`https://api.github.com/repos/${username}/${repo}/contents/${path}`,

{

method:"PUT",

headers:{

Authorization:`token ${token}`,

"Content-Type":"application/json"

},

body:JSON.stringify({

message:"Question paper uploaded",

content:content

})

}

);

if(response.ok){

document.getElementById("msg").innerHTML=

"Upload Success";

}

};

reader.readAsDataURL(file);

}



async function loadPapers(){

let response=await fetch(

`https://api.github.com/repos/${username}/${repo}/contents/pdf`

);

let data=await response.json();

let papers=document.getElementById("papers");

papers.innerHTML="";

data.forEach(file=>{

papers.innerHTML+=`

<div class="paper">

<a href="${file.download_url}" target="_blank">

${file.name}

</a>

</div>

`;

});

}