import axios, { Axios } from 'axios'
class tableservice{
    constructor(){
        this.http=axios.create(
            {
                baseURL:"http://localhost:3000"
            }
        )
    }

    getData(){
        return this.http.get("/tables")
    }
    postData(data){
        return this.http.post("/tables",data)
    }
    deleteData(id){
        return this.http.delete('/tables/'+id)
    }
    putData(id,data){
        return this.http.put('/tables/'+id,data)
    }
}

let TableS = new tableservice()
export default TableS