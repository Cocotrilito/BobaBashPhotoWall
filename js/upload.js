const photoInput = document.getElementById("photoInput");
const btnUpload = document.getElementById("btnUpload");
const UpStatus= document.getElementById("UpStatus");

let selectedFiles = [];
let currentFileIndex = 0;
let croppedBlobs = [];
let cropper = null;

function openCropperFor(index) {
    const fileselected = selectedFiles[index];
    const urlTemporal = URL.createObjectURL(fileselected);

    const cropperImage = document.getElementById("cropperImage");
    cropperImage.src = urlTemporal;

    document.getElementById("cropModal").classList.remove("hidden");

    if (cropper) {
        cropper.destroy();
    }

    cropper = new Cropper(cropperImage, {
        aspectRatio: 1,
        viewMode: 1
    });
}


photoInput.addEventListener("change", function() {
    selectedFiles = Array.from(photoInput.files);
    croppedBlobs = [];
    currentFileIndex = 0;

    if (selectedFiles.length > 0) {
    openCropperFor(currentFileIndex);
   }
});

document.getElementById("btnConfirmCrop").addEventListener("click", function() {
    const btnConfirm = document.getElementById("btnConfirmCrop");
    btnConfirm.disabled = true;
    
    cropper.getCroppedCanvas({ width: 500, height: 500}).toBlob(function(blob) {
        croppedBlobs.push(blob);
        currentFileIndex = currentFileIndex + 1;

        if (currentFileIndex < selectedFiles.length) {
        openCropperFor(currentFileIndex);
        btnConfirm.disabled = false;
        } else {
        document.getElementById("cropModal").classList.add("hidden");
        uploadCroppedPhotos();
      }
    });
});




async function uploadCroppedPhotos() {
    btnUpload.disabled = true;
    btnUpload.classList.add("bg-inkSoft");
    btnUpload.classList.remove("bg-goldenrod");
    btnUpload.textContent = "Uploading...";

    for (const blob of croppedBlobs) {
        const Filename = Date.now() + "-photo.jpg";
        const { data, error } = await client.storage.from("photos").upload(Filename, blob);
        if (error) {
            console.error(error);
            continue;
        }; 
        const { data: urlData } = client.storage.from("photos").getPublicUrl(Filename);

        const { error: dbError } = await client.from("photowall").insert([
            {photo_url: urlData.publicUrl, filename: Filename}
        ]);

        if (dbError) {
            console.error(dbError);
            UpStatus.textContent = "Error storaged in database"
            continue;
        }
        

    }
    btnUpload.disabled = false;
    btnUpload.classList.remove("bg-inkSoft");
    btnUpload.classList.add("bg-goldenrod");
    btnUpload.textContent = "Successful Upload!";
    document.getElementById("uploadModal").classList.add("hidden");
    photoInput.value = "";
    setTimeout(function() {
            btnUpload.textContent = "UPLOAD";
        }, 2000);
};