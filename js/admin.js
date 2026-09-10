const email = document.getElementById("adminEmail")
const password = document.getElementById("adminPassword")


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
}

document.getElementById("btnAdminLogin").addEventListener("click", loginAdmin);

password.addEventListener("keydown", async function(event) {
    if (event.key === "Enter") {
        loginAdmin();
    }
})