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

    console.log("la mera verdura")
}

document.getElementById("btnAdminLogin").addEventListener("click", loginAdmin);

password.addEventListener("keydown", async function(event) {
    if (event.key === "enter") {
        loginAdmin();
    }
})