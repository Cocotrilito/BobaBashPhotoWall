const email = document.getElementById("adminEmail")
const password = document.getElementById("adminPassword")
document.getElementById("btnAdminLogin").addEventListener("click", async function() {
    const {data, error} = await client.auth.signInWithPassword({
    email: email.value,
    password: password.value
});

    if (error) {
        console.error(error);
        return;
    }

    console.log("la mera verdura")
})
