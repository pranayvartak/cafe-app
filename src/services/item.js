import axios from 'axios'


class ItemService{

    constructor(){
        this.http = axios.create(
            {
                baseURL: "http://localhost:3000"
            }
        )
    }

    getData(){
        return this.http.get('/item')
    }

    postData(data){
        return this.http.post('/item',data)
    }
    
    deleteData(id){
        return this.http.delete('/item/'+id)
    }
    putData(id,data){
        return this.http.put('/item/'+id,data)
    }

    putData(id,data){
        return this.http.put('/item/'+id,data)
    }

}

let Item = new ItemService()
export default Item