async function uploadPDF(){

let file=document.getElementById("pdf").files[0];

if(!file){
alert("Select PDF");
return;
}

let formData=new FormData();

formData.append("pdf",file);

let response=await fetch("/api/upload",{

method:"POST",
body:file

});

let data=await response.json();

document.getElementById("msg").innerHTML=data.message;

}