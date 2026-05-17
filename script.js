async function uploadPDF(){

let file=document.getElementById("pdf").files[0];

if(!file){
alert("Select PDF");
return;
}

let category=
document.getElementById("category").value;

let university=
document.getElementById("university").value;

let course=
document.getElementById("course").value;

let semester=
document.getElementById("semester").value;

let year=
document.getElementById("year").value;

let subject =
document.getElementById("subject").value.trim();

if(!subject){
alert("Enter subject name");
return;
}


let response=await fetch("/api/upload",{

method:"POST",

headers:{
category,
university,
course,
semester,
subject,
year
},

body:file

});

let data=await response.json();

document.getElementById(
"msg"
).innerHTML=data.message;

}



async function loadPapers(){

try{

const response=await fetch(
"https://api.github.com/repos/akhilgk102/question-paper-hub/contents/pdf"
);

const files=await response.json();

const category=
document.getElementById("category").value;

const university=
document.getElementById("university").value;

const course=
document.getElementById("course").value;

const semester=
document.getElementById("semester").value;

const year=
document.getElementById("year").value;

let papers=document.getElementById("papers");

papers.innerHTML="";

files.forEach(file=>{

let name=file.name
.toLowerCase()
.replace(/[_\-\s]+/g,"");

let uni=university
.toLowerCase()
.replace(/[_\-\s]+/g,"");

let cour=course
.toLowerCase()
.replace(/[_\-\s]+/g,"");

let sem=semester
.toLowerCase()
.replace(/[_\-\s]+/g,"");

let yr=year
.toLowerCase()
.replace(/[_\-\s]+/g,"");

if(
(uni && !name.includes(uni)) ||
(cour && !name.includes(cour)) ||
(sem && !name.includes(sem.replace("sem","s"))) ||
(yr && !name.includes(yr))
){
return;
}

papers.innerHTML += `

<div class="paper">

<h3>📄 ${file.name}</h3>

<div class="btns">

<a href="https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(file.download_url)}"
target="_blank">

<button>View</button>

</a>

<a href="${file.download_url}" download>

<button>Download</button>

</a>

</div>

</div>

`;

});

}catch(error){

console.log(error);

}

}