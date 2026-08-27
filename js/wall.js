const wallContainer = document.getElementById("wallContainer");

async function showPhotos() {
    const {data, error} = await client.from("photowall").select("*");

    if (error) {
        console.error(error);
        return;
    }

    for (const photo of data) {
        const img = document.createElement("img");
        img.src = photo.photo_url;
        wallContainer.appendChild(img);

    }
}
document.getElementById("btnOpenUpload").addEventListener("click", function() {
    document.getElementById(uploadModal).classList.toggle("hidden");
});
document.getElementById("btnCloseUpload").addEventListener("click", function(){
    document.getElementById("uploadModal").classList.toggle("hidden")
});

showPhotos();