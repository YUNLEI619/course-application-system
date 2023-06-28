export function getJWTFromLS() {
    return localStorage.getItem('jwt');
}

export function getLoginStatusFromLS() {
    return localStorage.getItem("isLoggedIn");
}

export function getUserNbrFromLS() {
    return localStorage.getItem("userNbr");
}

export function getUserIdFromLS(userIdKey) {
    return localStorage.getItem(userIdKey);
}

export function getUserRoleFromLS() {
    return localStorage.getItem("userRole");
}

export function clearJWTFromLS() {
    localStorage.removeItem("userNbr");
    localStorage.removeItem("jwt");
}
