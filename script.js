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

<h3>📄 ${file.name}</h3>

<div class="btns">

<a href="https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(file.download_url)}"
target="_blank">

<button>
View
</button>

</a>

<a href="${file.download_url}" download>

<button>
Download
</button>

</a>

</div>

</div>

`;

});

}catch(error){

console.log(error);

}

}