let Axios = require("axios");

let sessionUser = {}

Axios.post('http://localhost:8080/api/login', {data : {email: 'admin@admin.com', pass: 'admin'}})
.then(res=>{
    console.log(res.data);
    sessionUser = res.data.data

    // Axios.post('http://localhost:8080/api/login/isLoggedIn', {token:sessionUser.token})
    // .then(res=>{
    //     console.log(res.data);
    // }).catch(err=>console.log(err.response.data))

    Axios.post('http://localhost:8080/api/login/logout', {token:sessionUser.token})
    .then(res=>{
        console.log(res.data);
    }).catch(err=>console.log(err.response.data))

    Axios.post('http://localhost:8080/api/login', {data : {email: 'admin@admin.com', pass: 'admin'}})
    .then(res=>{
        console.log(res.data);
        sessionUser = res.data.data

        // Axios.post('http://localhost:8080/api/ebook/gets', { token : sessionUser.token })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/ebook/getData', { token : sessionUser.token , data : {idEbook : 1}})
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/favoris/add', { token : sessionUser.token, data : {idEbook: 1} })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/favoris/delete', { token : sessionUser.token, data : {idEbook: 1} })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/favoris/gets', { token : sessionUser.token })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))


        // Axios.post('http://localhost:8080/api/type/add', { token : sessionUser.token, data : {name: "Nouveau Type"} })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/type/delete', { token : sessionUser.token, data : {idType: 14} })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/type/gets', { token : sessionUser.token })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/type/updt', { token : sessionUser.token, data : {newName: "my giga penis", idType: 12} })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/ebook/add',
        // {
        //     token : sessionUser.token,
        //     data : {
        //         title : 'Harry Potter',
        //         author : 'JK',
        //         date : 0,
        //         img : 'Harry',
        //         key_words : ["magie","harry", "potter"],
        //         idTypes : [1,2],
        //         press_comments : [{
        //             idPress : 1,
        //             date : 0,
        //             text : 'Waw',
        //             note : 5
        //         }]
        //     }
        // }).then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/ebook/updt',
        // {
        //     token : sessionUser.token,
        //     data : {
        //         idEbook : 2,
        //         title : 'Harry Potte',
        //         author : 'JK',
        //         date : 0,
        //         img : 'Harry',
        //         key_words : ["voldemor","harry"],
        //         idTypes : [4,2],
        //         press_comments : [{
        //             idPress : 1,
        //             date : 0,
        //             text : 'Waw',
        //             note : 5
        //         }]
        //     }
        // }).then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/ebook/setPage', { token : sessionUser.token, data : { idEbook: 1, page: 69} })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/ebook/getCurrentPage', { token : sessionUser.token, data : { idEbook: 1 } })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/comment/add', { token : sessionUser.token, data : { idEbook: 1, text: "Oohh oui il est trop bien ce livre <3", note: 4.5} })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/comment/delete', { token : sessionUser.token, data : { idComment: 4 } })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/comment/updt', { token : sessionUser.token, data : { idComment: 4, text: "Pu la merde j'ai pas", note: 0.5} })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))


        // Axios.post('http://localhost:8080/api/press/add', { token : sessionUser.token, data : { name: "critiqueslibres", link: "critiqueslibres.com"} })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/press/delete', { token : sessionUser.token, data : { idPress: 2 } })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/press/gets', { token : sessionUser.token })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/press/updt', { token : sessionUser.token, data : { name:"telerama", link: "https://www.telerama.fr", idPress: 1} })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        
        // Axios.post('http://localhost:8080/api/press/addPress_Comment', { token : sessionUser.token, data : { idPress: 3, idEbook: 1, text: "Pu la bite", date: 0, note: 4.5} })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/press/deletePress_Comment', { token : sessionUser.token, data : { idPress_Comment: 1 } })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/press/getPress_Comment', { token : sessionUser.token })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

        // Axios.post('http://localhost:8080/api/press/updtPress_Comment', { token : sessionUser.token, data : { text: "trop bien sa mereeeeeeeeeeee", date: 0, note: 5, idPress_Comment: 3} })
        // .then(res=>{
        //     console.log(res.data);
        // })
        // .catch(err=>console.log(err.response.data))

    }).catch(err=>console.log(err.response.data))

}).catch(err=>console.log(err))
