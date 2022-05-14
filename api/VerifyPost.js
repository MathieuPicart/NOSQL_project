let responseSender = require('./ResponseSender');

let validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const expectedPost = {
    '/login' : { 
        data : {
            email:(val)=>typeof val === 'string' && val.length<=320 && validateEmail(val),
            pass: (val)=>typeof val === 'string' && val.length<=45
        }
    },
    '/login/isLoggedIn' : {
        token:(val)=>typeof val==='string' && val.length === 20
    },
    '/login/logout' : {
        token:(val)=>typeof val==='string' && val.length === 20
    },
    '/ebook/gets' : {
        token:(val)=>typeof val==='string' && val.length === 20
    },
    '/ebook/getData' : {
        token : (val)=>typeof val==='string' && val.length === 20,
        data : { idEbook : (val)=>typeof val === 'number'}
    },
    '/ebook/add' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            title:(val)=>typeof val==='string' && val.length<=46,
            author: (val)=>typeof val==='string' && val.length<=100,
            date: (val)=>typeof val==='number',
            img: (val)=>typeof val==='string' && val.length<150000,
            summary: (val)=>typeof val==='string' && val.length<250,
            key_words : (val) => Array.isArray(val) && val.every((elem)=>typeof elem==="string"),
            idTypes : (val) => Array.isArray(val) && val.every(elem=>typeof elem === 'number'),
            press_comments : (val) => Array.isArray(val) && val.length<5 && val.every(
                (comment)=> typeof comment==='object' && Object.keys(comment).length === 4
                            && typeof comment.idPress==='number' 
                            && typeof comment.date==='number'
                            && typeof comment.text === 'string' && comment.text.length<=255 
                            && typeof comment.note==='number')
        }
    },
    '/ebook/updt' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            idEbook : (val)=>typeof val==='number',
            title:(val)=>typeof val==='string' && val.length<=46,
            author: (val)=>typeof val==='string' && val.length<=100,
            date: (val)=>typeof val==='number',
            img: (val)=>typeof val==='string' && val.length<150000,
            summary: (val)=>typeof val==='string' && val.length<250,
            key_words : (val) => Array.isArray(val) && val.every((elem)=>typeof elem==="string"),
            idTypes : (val) => Array.isArray(val) && val.every(elem=>typeof elem === 'number'),
            press_comments : (val) => Array.isArray(val) && val.length<5 && val.every(
                (comment)=> typeof comment==='object' && Object.keys(comment).length === 4
                            && typeof comment.idPress==='number' 
                            && typeof comment.date==='number'
                            && typeof comment.text === 'string' && comment.text.length<=255 
                            && typeof comment.note==='number')
        }
    },
    '/ebook/delete' : {
        token : (val)=>typeof val==='string' && val.length===20,
        data : { idEbook : (val)=>typeof val==='number' }
    },
    '/ebook/setPage' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            idEbook: (val)=>typeof val === 'number',
            page: (val)=>typeof val === 'number'
        }
    },
    '/ebook/getCurrentPage' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            idEbook: (val)=>typeof val === 'number'
        }
    },
    '/favoris/add' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            idEbook: (val)=>typeof val === 'number'
        }
    },
    '/favoris/delete' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            idEbook:(val)=>typeof val === 'number'
        }
    },
    '/favoris/gets' : {
        token:(val)=>typeof val==='string' && val.length === 20
    },
    '/type/add' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            name:(val)=>typeof val==='string' && val.length<=46
        }
    },
    '/type/delete' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            idType: (val)=>typeof val==='number'
        }
    },
    '/type/gets' : {
        token:(val)=>typeof val==='string' && val.length === 20
    },
    '/type/updt' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            newName:(val)=>typeof val==='string' && val.length<=46,
            idType: (val)=>typeof val==='number'
        }
    },
    '/comment/add' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            idEbook: (val)=>typeof val==='number',
            text: (val)=>typeof val==='string' && val.length<=255,
            note: (val)=>typeof val==='number'
        }
    },
    '/comment/delete' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            idComment: (val)=>typeof val==='number'
        }
    },
    '/comment/updt' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            idComment: (val)=>typeof val==='number',
            text: (val)=>typeof val==='string' && val.length<=255,
            note: (val)=>typeof val==='number'
        }
    },
    '/epub/get' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            idEbook: (val)=>typeof val==='number'
        }
    },
    '/press/add' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            name: (val)=>typeof val==='string' && val.length<=45,
            link: (val)=>typeof val==='string' && val.length<=200,
        }
    },  
    '/press/delete' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            idPress: (val)=>typeof val==='number'
        }
    },
    '/press/gets' : {
        token:(val)=>typeof val==='string' && val.length === 20
    },
    '/press/updt' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            name: (val)=>typeof val==='string' && val.length<=45,
            link: (val)=>typeof val==='string' && val.length<=200,
            idPress: (val)=>typeof val==='number'
        }
    },
    '/press/addPress_Comment' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            idPress: (val)=>typeof val==='number',
            idEbook: (val)=>typeof val==='number',
            text: (val)=>typeof val==='string' && val.length<=255,
            date: (val)=>typeof val==='number',
            note: (val)=>typeof val==='number',
        }
    },  
    '/press/deletePress_Comment' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            idPress_Comment: (val)=>typeof val==='number'
        }
    },
    '/press/getPress_Comment' : {
        token:(val)=>typeof val==='string' && val.length === 20
    },
    '/press/updtPress_Comment' : {
        token:(val)=>typeof val==='string' && val.length === 20,
        data : {
            text: (val)=>typeof val==='string' && val.length<=255,
            date: (val)=>typeof val==='number',
            note: (val)=>typeof val==='number',
            idPress_Comment: (val)=>typeof val==='number',
        }
    }
}

function verifyObject(object, expected){

    if((typeof expected)===(typeof object)){
        if(typeof expected==='object'){
            let keys = Object.keys(expected)
            for(i=0;i<keys.length;i++){
                let key = keys[i]
                if(object[key] || object[key]===null || object[key]===0){
                    let vo = verifyObject(object[key], expected[key])
                    if(!vo){
                        return false
                    }else if(vo && key===keys[keys.length-1]){
                        return true
                    }
                }else{
                    return false
                }        
            }
        }else{
            if(expected(object)){
                return true
            }else{
                return false
            }
        }
    }else{
        if(expected(object)){
            return true
        }else{
            return false
        }
    }
}


let verifyPost = (req, res, next)=>{
    
    if(expectedPost[req.url] && verifyObject(req.body,  expectedPost[req.url])){
        next()
    }else{
        responseSender({success : false, errors : ['Données non valides']}, '/api'+req.url, req.idLog, res, 400)
    }
}

module.exports = verifyPost