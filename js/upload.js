const photoInput = document.getElementById("photoInput");
const btnUpload = document.getElementById("btnUpload");
const UpStatus= document.getElementById("UpStatus");

photoInput.addEventListener("change", function() {
    const quantity = photoInput.files.length;
    document.querySelector("label[for='photoInput']").textContent = quantity + " photo(s) ready to upload"
});

btnUpload.addEventListener("click", async function() {
    btnUpload.disabled = true;
    btnUpload.classList.add("opacity-50");
    btnUpload.textContent = "Uploading...";
    for (const file of photoInput.files) {
        const Filename = Date.now() + "-" + file.name;
        const { data, error } = await client.storage.from("photos").upload(Filename, file);
        if (error) {
            console.error(error);
            continue;
        }; 
        const { data: urlData } = client.storage.from("photos").getPublicUrl(Filename);

        const { error: dbError } = await client.from("photowall").insert([
            {photo_url: urlData.publicUrl, filename: file.name}
        ]);

        if (dbError) {
            console.error(dbError);
            UpStatus.textContent = "Error storaged in database"
            continue;
        }
        

    }
    btnUpload.disabled = false;
    btnUpload.classList.remove("opacity-50");
    btnUpload.textContent = "Successful Upload!";
    document.querySelector("label[for='photoInput']").textContent = "Uploaded!";
    photoInput.value = "";
    setTimeout(function() {
            document.querySelector("label[for='photoInput']").textContent = "Press to upload your photos";
            btnUpload.textContent = "UPLOAD";
            
        }, 2000);
});