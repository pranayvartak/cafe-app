import axios from 'axios'


class CategoryService{

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

}

let Item = new CategoryService()
export default Item