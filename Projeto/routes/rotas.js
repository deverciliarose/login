const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('./database');
const bcrypt = require('bcryptjs');
const e = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');



router.post('/cadastro', async(req,res)=>{

    const{nome, email, senha}=req.body
    

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try{

        const hashedPassword = await bcrypt.hash(senha,10);
    
        await pool.query(
            'INSERT INTO usuario(nome, email, senha) VALUES($1, $2, $3)',
            [nome, email,hashedPassword]
        );

        res.status(201).json({message:'Usuário cadastrado com sucesso.'})
    }catch(error){
      console.error(error)
      res.status(500).json({message:'Erro ao cadastra usuário'})
    }
    
});



router.post('/login', async(req, res) =>{
    const{email,senha}= req.body;

    try{
        const result= await pool.query('SELECT * FROM usuario WHERE email = $1', [email])

        if(result.rows.length ===0){
            return res.status(400).json({message:'Usuário não encontrado.'})
        }

        const usuario = result.rows[0]
        const isMatch = await bcrypt.compare(senha, usuario.senha)

        if(!isMatch){
            return res.status(400).json({message:'Senha incorreta.'})
        }

        res.status(200).json({message:'Login bem sucedido'})
    }catch(error){
        console.error(error)
        res.status(500).json({message:'Erro no login'})
    }
})

router.post('/esqueci-senha', async(req, res)=>{
    const {email}= req.body;

    try{
        const usuario = await pool.query('SELECT*FROM usuario WHERE email = $1', [email])

        if(usuario.rows.length===0){
            return res.status(400).json({message:'Email não encontrado'})
        }

        const token = crypto.randomBytes(32).toString('hex')
        const expiracao = new Date(Date.now() + 3600000)

        await pool.query(
            'INSERT INTO reset_senha(email,token,expiracao) VALUES($1,$2,$3)',
            [email,token, expiracao]
        );
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'testelog856@gmail.com',
                pass: 'mlpnxkyhvnxmruxf '
            }
        })


        const resetlink= `http://127.0.0.1:5000/resetar-senha.html?token=${token}`;
        await transporter.sendMail({
            from: 'testelog856@gmail.com',
            to: email,
            subject: 'Recuperação de senha',
            html: `<p>Clique no link para redefinir sua senha</p>
                 <a href="${resetlink}">${resetlink}</a>`
        })
        
        res.json({message: 'Email de recuperação enviado'})



        
    }catch(err){
        console.error(err)
        res.status(500).json({message:'Erro ao enviar email de recuperação'})
    }
})
router.post('/resetar-senha', async(req,res)=>{
    const{token, novaSenha}=req.body

    try{
        const result = await pool.query(
            'SELECT*FROM reset_senha WHERE token = $1 AND expiracao> NOW()',
            [token]
        )

        if(result.rows.length ===0){
            return res.status(400).json({message:"Token inválido"})
        }

        const email = result.rows[0].email

        const hashedPassword = await bcrypt.hash(novaSenha, 10)

        await pool.query(
           'UPDATE usuario SET senha = $1 WHERE email = $2',
           [hashedPassword, email]
        )
        await pool.query('DELETE FROM reset_senha WHERE token = $1',[token])
        res.json({message:'Senha redefinida com sucesso'})


    }catch(err){
        console.error(err)
        res.status(500).json({message:'Erro ao redefinir senha'})
    }
} )

module.exports = router

