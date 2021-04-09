const loginform = document.querySelector(".sign-in-form")
const loginemailerror = document.querySelector(".email.loginerror")
const loginpassworderror = document.querySelector(".password.loginerror")

loginform.addEventListener("submit",async(e)=>{
    e.preventDefault()

    loginemailerror.textContent = ""
    loginpassworderror.textContent = ""

    let email = loginform.email.value
    let password = loginform.password.value

    try {
        const res = await fetch("/login",{
            method:"POST",
            body: JSON.stringify({email,password}),
            headers:{"Content-type":'application/json'} 
        })
        const data = await res.json()
        if(!data._id)
        {
            loginemailerror.textContent = data.email
            loginpassworderror.textContent = data.password
        }
        else
        {
            location.assign("/dashboard?_uid="+data._id)
        }
    } catch (error) {
        console.log(error)
    }
})