import axios from 'axios'


class OrderService{

    constructor(){
        this.http = axios.create(
            {
                baseURL: "http://localhost:3000"
            }
        )
    }

    getData(){
        return this.http.get('/order')
    }

    postData(data){
        return this.http.post('/order',data)
    }
    
    deleteData(id){
        return this.http.delete('/order/'+id)
    }

    putData(id,data){
        return this.http.put('/order/'+id,data)
    }
}

let OrderS = new OrderService()
export default OrderS