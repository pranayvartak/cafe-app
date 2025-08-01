import axios from 'axios'


class TableService{

    constructor(){
        this.http = axios.create(
            {
                baseURL: "http://localhost:3000"
            }
        )
    }

    getData(){
        return this.http.get('/table')
    }

    postData(data){
        return this.http.post('/table',data)
    }
    
    deleteData(id){
        return this.http.delete('/table/'+id)
    }

    putData(id,data){
        return this.http.put('/table/'+id,data)
    }
}

let TableS = new TableService()
export default TableS