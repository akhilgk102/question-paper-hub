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


let response=await fetch("/api/upload",{

method:"POST",

headers:{
category,
university,
course,
semester,
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
document.getElementById("category").value.toLowerCase();

const university=
document.getElementById("university").value.toLowerCase();

const course=
document.getElementById("course").value.toLowerCase();

const semester=
document.getElementById("semester").value.toLowerCase();

const year=
document.getElementById("year").value.toLowerCase();

let papers=
document.getElementById("papers");

papers.innerHTML="";

files.forEach(file=>{

let name=file.name.toLowerCase();

if(
(category && !name.includes(category)) ||
(university && !name.includes(university.replaceAll(" ","_"))) ||
(course && !name.includes(course.replaceAll(" ","_"))) ||
(semester && !name.includes(semester.replaceAll(" ","_"))) ||
(year && !name.includes(year))
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