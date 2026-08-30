function openDetailModal(photo) {
    document.getElementById("detailImage").src = photo.photo_url;
    document.getElementById("detailCity").textContent = photo.city;

    const date = new Date(photo.created_at);
    document.getElementById("detailDate").textContent = date.toLocaleString();

    document.getElementById("detailModal").classList.remove("hidden");

}

document.getElementById("btnCloseDetail").addEventListener("click", function() {
    document.getElementById("detailModal").classList.add("hidden");
});

document.getElementById("detailModal").addEventListener("click", function() {
    if (event.target.id === "detailModal") {
        document.getElementById("detailModal").classList.add("hidden");
    }
})