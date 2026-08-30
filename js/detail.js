function openDetailModal(photo) {
    const bigCard = addPhotoToWall(photo, "large");

    const dateLabel = document.createElement("div");
    dateLabel.className = "absolute bottom-3 right-4 mr-2 font-marker text-inkMuted text-sm";
    const date = new Date(photo.created_at);
    dateLabel.textContent = date.toLocaleDateString();
    bigCard.appendChild(dateLabel);

    const container = document.getElementById("detailCardContainer");
    container.innerHTML = "";
    container.appendChild(bigCard);
    document.getElementById("detailModal").classList.remove("hidden");
}
