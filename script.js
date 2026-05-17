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

const universityMap={

"Kerala University":"KU",
"MG University":"MGU",
"Calicut University":"CU",
"Kannur University":"KNU"

};

const courseMap={

"BSc Computer Science":"BSC-CS",
"BCA":"BCA",
"BCom":"BCOM",
"BBA":"BBA"

};

let university=
document.getElementById("university").value;

let course=
document.getElementById("course").value;

let semester=
document.getElementById("semester").value;

let year=
document.getElementById("year").value;


university=
universityMap[university] || "";

course=
courseMap[course] || "";

semester=
semester.replace("Sem ","S");

let papers=
document.getElementById("papers");

papers.innerHTML="";


files.forEach(file=>{

let name=
file.name.toUpperCase();

if(

(university && !name.includes(university))
||

(course && !name.includes(course))
||

(semester && !name.includes(semester))
||

(year && !name.includes(year))

){

return;

}


papers.innerHTML +=`

<div class="paper">

<h3>

📄 ${file.name}

</h3>

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