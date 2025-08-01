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
        return this.http.get('/bill')
    }

    postData(data){
        return this.http.post('/bill',data)
    }
    deleteData(id){
        return this.http.delete('/bill/'+id)
    }
    putData(id,data){
        return this.http.put('/bill/'+id,data)
    }

}
let bill = new CategoryService();
export default bill;
