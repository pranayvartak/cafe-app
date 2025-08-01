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
        return this.http.get('/orders')
    }

    postData(data){
        return this.http.post('/orders',data)
    }
    deleteData(id){
        return this.http.delete('/orders/'+id)
    }
    putData(id,data){
        return this.http.put('/orders/'+id,data)
    }

}
let order = new CategoryService();
export default order;
