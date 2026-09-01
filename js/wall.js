const wallContainer = document.getElementById("wallContainer");

async function deletePhoto(photo, card) {
    const {error: dbError } = await client.from("photowall").delete().eq("id", photo.id);

    if (dbError) {
        console.error(dbError);
        return;
    }
    const { error: storageError} = await client.storage.from("photos").remove([photo.filename]);

    if (storageError) {
        console.error(storageError);
    }

    card.remove();
}

async function editPhoto(photo, cityLabel, editInput) {
    const {error: editError} = await client.from("photowall").update({city: editInput.value}).eq("id", photo.id)

    if (editError) {
        console.error(editError);
        return;
    }

    cityLabel.textContent = editInput.value
    
}

function addPhotoToWall(photo, size) {
    size = size || "small";
    const dimensions = size === "large" ? "w-80 h-80" : "w-36 sm:w-48 md:w-48 h-40 sm:h-48 md:h-48";


    const card = document.createElement("div");
    card.setAttribute("data-photo-id", photo.id);
    card.className = "bg-white p-3 pb-12 shadow-lg relative";
    const rotation = Math.random() * 8-4;
    card.style.transform = "rotate("+ rotation + "deg)";

    if (size === "small") {
        card.classList.add("cursor-pointer");
        card.addEventListener("click", function() {
            openDetailModal(photo);
        })
    }

    const photoWrapper = document.createElement("div");
    photoWrapper.className = "relative " + dimensions + " overflow-hidden";

    const warmOverlay = document.createElement("div");
    warmOverlay.className = "absolute inset-0 pointer-events-none";
    warmOverlay.style.background = "rgba(225, 180, 90, 0.05)";
    warmOverlay.style.mixBlendMode = "overlay";

    const grain = document.createElement("div");
    grain.className = "absolute inset-0 pointer-events-none opacity-[.23]";
    grain.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E\")";


    const img = document.createElement("img");
    img.className = dimensions + " object-cover block sepia-[.35] contrast-[1.05] saturate-[.95] brightness-[1.1] opacity-0 scale-95 transition-all duration-700"
    img.onload = function() {
        img.classList.remove("opacity-0", "scale-95");
        img.classList.add("opacity-100", "scale-100");
    };
    img.src = photo.photo_url;

    const vignette = document.createElement("div");
    vignette.className = "absolute inset-0 pointer-events-none";
    vignette.style.boxShadow = "inset 0 0 30px 10px rgba(0,0,0,0.35)";

    const cityLabelAndbtnEdit = document.createElement("div")
    cityLabelAndbtnEdit.className = "absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2"
    const btnEdit = document.createElement("button");
    btnEdit.className = "text-inkMuted";
    btnEdit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>'
    const cityLabel = document.createElement("div");
    cityLabel.className = "relative bottom-2 left-0 right-0 text-center font-marker text-ink text-lg";
    cityLabel.textContent = photo.city;

    const owner = photo.owner_token === deviceToken;

    if (size === "large" && owner) {
        const btnDelete = document.createElement("button");
        btnDelete.className = "absolute z-50 top-2 right-2 rounded-full w-7 h-7 flex items-center justify-center text-red-600";
        btnDelete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>'
        btnDelete.addEventListener("click", async function(event)  {
            event.stopPropagation();
            await deletePhoto(photo, card);
            document.getElementById("detailModal").classList.add("hidden");
        });
        card.appendChild(btnDelete);
        cityLabelAndbtnEdit.appendChild(cityLabel);
        cityLabelAndbtnEdit.appendChild(btnEdit);
        card.appendChild(cityLabelAndbtnEdit);
        const editInput = document.createElement("input");
        editInput.classList.add("hidden");
        editInput.type = "text";
        editInput.value = (photo.city);
        cityLabelAndbtnEdit.appendChild(editInput);
        btnEdit.addEventListener("click", function() {
            editInput.classList.toggle("hidden");
            cityLabel.classList.toggle("hidden");
        })
        editInput.addEventListener("blur", async function() {
            await editPhoto(photo, cityLabel, editInput);
            editInput.classList.add("hidden");
            cityLabel.classList.remove("hidden");
        });
        
    } else {
        cityLabel.className = "absolute bottom-2 left-0 right-0 text-center font-marker text-ink text-lg";
        card.appendChild(cityLabel);
    }



    photoWrapper.appendChild(img);
    photoWrapper.appendChild(warmOverlay);
    photoWrapper.appendChild(vignette);
    card.appendChild(photoWrapper);
    card.appendChild(grain);


    if (size === "small") {
        wallContainer.appendChild(card);
    }
    
    return card;
}


client.channel("photowall_changes_radio1")
    .on("postgres_changes", {event: "INSERT", schema: "public", table: "photowall"}, function(payload) {
    addPhotoToWall(payload.new);
    })
    .on("postgres_changes", {event: "DELETE", schema: "public", table: "photowall"}, function(payload) {
       const card = document.querySelector('[data-photo-id="' + payload.old.id + '"]');
       if (card) {
        card.remove();
       }
    })
    .subscribe();



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


document.getElementById("btnCloseDetail").addEventListener("click", function() {
    document.getElementById("detailModal").classList.add("hidden");
});

document.getElementById("detailModal").addEventListener("click", function() {
    if (event.target.id === "detailModal") {
        document.getElementById("detailModal").classList.add("hidden");
    }
})




const link = window.location.href

const qrCode = new QRCodeStyling({
    width: 250,
    height: 250,
    data: link,
    dotsOptions: {
        color: '#9a8064',
        type: "rounded"
    },
    cornersSquareOptions: {
        type: "extra-rounded",
        color: '#6b5842'
    },
    backgroundOptions: {
        color: "#fbf6e8"
    }
    
});

qrCode.append(document.getElementById("qr"));

const linkCopy = document.getElementById("linkCopy")
linkCopy.textContent = link;
document.getElementById("btnCopyLink").addEventListener("click", function() {
  navigator.clipboard.writeText(link);
  document.querySelector('#btnCopyLink span').textContent = "Copied!";
  setTimeout(function() {
    document.querySelector('#btnCopyLink span').textContent = "Copy Link";
  }, 2000);
});

document.getElementById("uploadModal").addEventListener("click", function() {
    if (event.target.id === "uploadModal") {
        document.getElementById("uploadModal").classList.add("hidden");
    }
});

document.getElementById("shareModal").addEventListener("click", function() {
    if (event.target.id === "shareModal") {
        document.getElementById("shareModal").classList.add("hidden");
    }
});

showPhotos();