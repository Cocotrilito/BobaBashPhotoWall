const email = document.getElementById("adminEmail")
const password = document.getElementById("adminPassword")
const button = document.getElementById("btnAdminLogin")

async function loginAdmin() {
    const {data, error} = await client.auth.signInWithPassword({
    email: email.value,
    password: password.value
});

    if (error) {
        console.error(error);
        return;
    }
    isAdmin = true;
    wallContainer.innerHTML = "";
    showPhotos();
    console.log("la mera verdura")
    button.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
}

button.addEventListener("click", loginAdmin);

password.addEventListener("keydown", async function(event) {
    if (event.key === "Enter") {
        loginAdmin();
    }
})