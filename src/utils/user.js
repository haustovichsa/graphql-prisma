function getFirstName (fullName) {
    return fullName.split(' ')[0]
}

function isValidPassword (password) {
    return password.length >= 8 && !password.toLowerCase().includes('password')
}

export { getFirstName, isValidPassword }