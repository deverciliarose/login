const cadastro = document.getElementById('cadastro')

if(cadastro){
    cadastro.addEventListener('submit', async(e)=>{
        e.preventDefault();
        const nomeInput = document.getElementById('nome')
        const inputEmail = document.getElementById('cadastroEmail')
        const inputSenha= document.getElementById('cadastroSenha')

        const nome= nomeInput.value
        const email = inputEmail.value
        const senha = inputSenha.value

        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;



        if (!regex.test(senha)) {
        alert('A senha deve conter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula,um número e um caractere especial.');
       return;
       }

        try{
            const res = await fetch('http://127.0.0.1:5000/cadastro',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({nome,email,senha}),
            })

            const data = await res.json();
            alert(data.message)

            if(res.status ===201){
                window.location.href = 'login.html'
            }

            nomeInput.value = ''
            inputEmail.value = ''
            inputSenha.value = ''

           

        }catch(err){
            console.error(err)
        }
    })

}
const inputSenha = document.getElementById('cadastroSenha');
const toggleSenha = document.getElementById('toggleSenha');

if (inputSenha && toggleSenha) {
  toggleSenha.addEventListener('click', () => {
    const tipoAtual = inputSenha.getAttribute('type');

    if (tipoAtual === 'password') {
      inputSenha.setAttribute('type', 'text');
      toggleSenha.textContent = 'visibility';
    } else {
      inputSenha.setAttribute('type', 'password');
      toggleSenha.textContent = 'visibility_off';
    }
  });
}



const login = document.getElementById('login')
if(login){
    login.addEventListener('submit', async (e) =>{
        e.preventDefault()
        const emailInput = document.getElementById('Email')
        const senhaInput = document.getElementById('Senha')

        const email = emailInput.value
        const senha = senhaInput.value
        


        try{
            const res = await fetch('http://127.0.0.1:5000/login',{
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({email, senha})
            })

            const data = await res.json()
            alert(data.message)

            if(res.status === 200){
                window.location.href = 'usuario.html'
            }

            emailInput.value ='';
            senhaInput.value ='';
        }catch(err){
            console.error(err)
        }
    })
}
const senhaInput = document.getElementById('Senha');
const senhaToggle = document.getElementById('toggleSenha');

if (senhaInput && senhaToggle) {
  senhaToggle.addEventListener('click', () => {
    const tipoAtual = senhaInput.getAttribute('type');

    if (tipoAtual === 'password') {
      senhaInput.setAttribute('type', 'text');
      senhaToggle.textContent = 'visibility';
    } else {
      senhaInput.setAttribute('type', 'password');
      senhaToggle.textContent = 'visibility_off';
    }
  });
}

