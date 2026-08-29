const wallContainer = document.getElementById("wallContainer");

function addPhotoToWall(photo) {
    const card = document.createElement("div");
    card.className = "bg-white p3 pb-8 shadow-lg relative";
    const rotation = Math.random() * 8-4;
    card.style.transform = "rotate("+ rotation + "deg)";

    const photoWrapper = document.createElement("div");
    photoWrapper.className = "relative w-48 h-48 overflow-hidden";

    const warmOverlay = document.createElement("div");
    warmOverlay.className = "absolute inset-0 pointer-events-none";
    warmOverlay.style.background = "rgba(225, 180, 90, 0.05)";
    warmOverlay.style.mixBlendMode = "overlay";

    const img = document.createElement("img");
    img.className = "w-48 object-cover block sepia-[.35] contrast-[1.05] saturate-[.95] brightness-[1.1] opacity-0 scale-95 transition-all duration-700"
    img.onload = function() {
        img.classList.remove("opacity-0", "scale-95");
        img.classList.add("opacity-100", "scale-100");
    };
    img.src = photo.photo_url;
    const vignette = document.createElement("div");
    vignette.className = "absolute inset-0 pointer-events-none";
    vignette.style.boxShadow = "inset 0 0 30px 10px rgba(0,0,0,0.35)";


    photoWrapper.appendChild(img);
    photoWrapper.appendChild(warmOverlay);
    photoWrapper.appendChild(vignette);
    card.appendChild(photoWrapper);
    wallContainer.appendChild(card);    
}


client.channel("photowall_changes_radio1").on("postgres_changes", {event: "INSERT", schema: "public", table: "photowall"}, function(payload) {
    addPhotoToWall(payload.new);
}).subscribe();


async function showPhotos() {
    const {data, error} = await client.from("photowall").select("*");

    if (error) {
        console.error(error);
        return;
    }

    for (const photo of data) {
        addPhotoToWall(photo);
    }
}

document.getElementById("btnOpenUpload").addEventListener("click", function() {
    document.getElementById("uploadModal").classList.toggle("hidden");
});


document.getElementById("btnCloseUpload").addEventListener("click", function(){
    document.getElementById("uploadModal").classList.toggle("hidden");
});



document.getElementById("btnShare").addEventListener("click", function() {
    document.getElementById("shareModal").classList.toggle("hidden");
});
document.getElementById("btnCloseShare").addEventListener("click", function() {
    document.getElementById("shareModal").classList.toggle("hidden");
});

const link = window.location.href
const qr = document.getElementById("qr")
qr.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="+ link;
const linkCopy = document.getElementById("linkCopy")
linkCopy.textContent = link;
document.getElementById("btnCopyLink").addEventListener("click", function() {
  navigator.clipboard.writeText(link);
  document.querySelector('#btnCopyLink span').textContent = "Copied!";
  setTimeout(function() {
    document.querySelector('#btnCopyLink span').textContent = "Copy Link";
  }, 2000);
});

showPhotos();