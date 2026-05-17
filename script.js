async function uploadPDF(){

let file=document.getElementById("pdf").files[0];

if(!file){
alert("Select PDF");
return;
}

let response=await fetch("/api/upload",{
method:"POST",
body:file
});

let data=await response.json();

document.getElementById("msg").innerHTML=data.message;

}













async function loadPapers(){

try{

const response=await fetch(
"https://api.github.com/repos/akhilgk102/question-paper-hub/contents/pdf"
);

const files=await response.json();

let papers=document.getElementById("papers");

papers.innerHTML="";

files.forEach(file=>{

papers.innerHTML += `

<div class="paper">

<a href="${file.download_url}"
target="_blank">

📄 ${file.name}

</a>

</div>

`;

});

}catch(error){

console.log(error);

}

}