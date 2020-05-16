export const validateEmail = (email) => {
    let regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
    if(email && (regex.test(email))){
        return true
    }
    return false
}

export const validatePassword = (password) => {
    let strength = 0
    let specialRegex = /[ `!@#$%^&*()_+\-=[\]{};':"|,.<>/?~\\]/
    if(password){
        if(password.length >= 3 ){
            strength += 1
            for(let a=0; a<password.length; a++){
                if(password[a] === password[a].toUpperCase()){
                    strength +=1
                    break;
                }
            }
            let str = String(password);
            for(let a=0; a<str.length; a++){
                if(!isNaN(str.charAt(a))){
                    strength += 1
                    break
                }
            }
            if(specialRegex.test(password) && password.length >= 8){
                strength += 1
            }
        }
    }
    return strength
}

export const validateName = (name) => {
    if(name && name.length){
        return true
    }
    return false
}

export const validateCode = (code) => {
    if(code && code.length === 6){
        return true
    }
    return false
}