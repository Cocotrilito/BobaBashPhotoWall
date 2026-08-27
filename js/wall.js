const wallContainer = document.getElementById("wallContainer");

async function showPhotos() {
    const {data, error} = await client.from("photowall").select("*");

    if (error) {
        console.error(error);
        return;
    }

    for (const photo of data) {
        const card = document.createElement("div");
        card.className = "bg-white p-3 pb-8 shadow-lg";
        const rotation = Math.random() * 8-4;
        card.style.transform = "rotate("+ rotation + "deg)";
        const img = document.createElement("img");
        img.src = photo.photo_url;
        
        card.appendChild(img);
        wallContainer.appendChild(card);


    }
}
document.getElementById("btnOpenUpload").addEventListener("click", function() {
    document.getElementById("uploadModal").classList.toggle("hidden");
});
document.getElementById("btnCloseUpload").addEventListener("click", function(){
    document.getElementById("uploadModal").classList.toggle("hidden")
});

showPhotos();