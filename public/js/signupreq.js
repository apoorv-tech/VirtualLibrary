const signupform = document.querySelector(".sign-up-form")
const signupemailerror = document.querySelector(".email.signuperror")
const signuppassworderror = document.querySelector(".password.signuperror")


signupform.addEventListener("submit",async(e)=>{
    e.preventDefault()

    signupemailerror.textContent = ""
    signuppassworderror.textContent = ""

    let email = signupform.email.value
    let username = signupform.username.value
    let password = signupform.password.value

    try {
        const res = await fetch("/signup",{
            method:"POST",
            body: JSON.stringify({username,email,password}),
            headers:{"Content-type":'application/json'} 
        })
        const data = await res.json()
        if(!data._id)
        {
           signupemailerror.textContent = data.email
           signuppassworderror.textContent = data.password
        }
        else
        {
            location.assign("/dashboard?_uid="+data._id)
        }
    } catch (error) {
        console.log(error)
    }
})