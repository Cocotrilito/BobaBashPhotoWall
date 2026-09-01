function getDeviceToken() {
    let token = localStorage.getItem("deviceToken");

    if (!token) {
        token = crypto.randomUUID();
        localStorage.setItem("deviceToken", token);
    }

    return token;
}

const deviceToken = getDeviceToken();