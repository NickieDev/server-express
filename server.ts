import mysql from 'mysql2'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const server = express()

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

// Connection with DB
const db = mysql.createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE
})

server.get('/', async(req, res) => {
   let query = `SELECT * FROM users`

   db.query(query, (err, result) => {
      if(err) {
         res.status(404).send({ msg: 'Erro ao listar usuários' })
         console.log('Erro ao listar usuários')
      } else {
         res.status(200).send({ msg: 'Usuários encontrados', result })
      }
   })
})

server.get('/:id', async(req, res) => {
   const { id } = req.params

   let query = `SELECT * FROM users WHERE id = ?`

   db.query(query, [id], (err, result) => {
      if(err) {
         res.status(400).send({ msg: 'Usuário não localizado.' })
         console.log('Usuário não localizado')
      } else {
         res.status(200).send({ msg: 'Usuário encontrado', result })
      }
   })
})

server.post('/', async(req, res) => {
   const { userName, userEmail } = req.body

   let query = `INSERT INTO users (userName, userEmail) VALUES (?, ?)`

   db.query(query, [userName, userEmail], (err, result) => {
      if(err) {
         res.status(400).send({ msg: 'Erro ao cadastrar' })
         console.log('Erro ao cadastrar')
      } else {
         res.status(201).send({ msg: 'Usuário cadasrado com sucesso.', result })
      }
   })
})

server.put('/:id', async(req, res) => {
   const { id } = req.params
   const { userName, userEmail } = req.body

   let query = `UPDATE users SET userName = ?, userEmail = ? WHERE id = ?`

   db.query(query, [userName, userEmail, id], (err, result) => {
      if(err) {
         res.status(400).send({ msg: 'Erro ao tentar atualizar dados do cliente.' })
         console.log('Erro ao tentar atualizar dados do cliente.')
      } else {
         res.status(200).send({ msg: 'Dados de usuário atualizados com sucesso.', result })
         console.log('Dados de usuário atualizados com sucesso')
      }
   })
})

server.delete('/:id', (req, res) => {
   const { id } = req.params

   let findUsers = ` SELECT * FROM users where id = ?`

   db.query(findUsers, [id], (err, result) => {
      // console.log(typeof result) => Obj
      let usersLength = JSON.parse(JSON.stringify(result)).length
      //console.log(usersLength === 1)

      if(err) {
         res.status(400).send({ msg: 'Erro ao tentar excluir usuário.' })
         console.log('Erro ao tentar excluir usuário.')
      } else if(usersLength === 1) {
         let query = `DELETE FROM users WHERE id = ?`
         
         db.query(query, [id], (err, result) => {
            if(err) {
               res.status(400).send({ msg: 'Não foi possível deletar esse usuário.', result })
               console.log('Não foi possível deleter esse usuário')
            } else {
               // res.status(200).send({ msg: 'Usuário deletado com sucesso.' })
               res.status(200).send(result)
               console.log('Usuário deletado com sucesso.')
            }
         })
         
      } else {
         res.status(400).send({ msg: 'Não foi possível prosseguir com a ação. Por favor tente mais tarde.' })
         console.log('Não foi possível prosseguir com a ação. Por favor tente mais tarde.')
      }
   })

})

server.listen(3001, () => console.log(`Running in port 3001`))

/*if(usersLength < 1) {
            res.status(400).send({ msg: 'Não foi possível prosseguir com a ação. Por favor tente mais tarde.' })
            console.log('Não foi possível prosseguir com a ação. Por favor tente mais tarde.')
            
         } else {
            let query = `DELETE FROM users WHERE id = ?`
         
            db.query(query, [id], (err, result) => {
               if(err) {
                  res.status(400).send({ msg: 'Não foi possível deletar esse usuário.', result })
                  console.log('Não foi possível deleter esse usuário')
               } else {
                  res.status(200).send({ msg: 'Usuário deletado com sucesso.' })
                  console.log('Usuário deletado com sucesso.')
               }
            })
         }*/