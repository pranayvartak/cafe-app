import axios from 'axios'

class CategoryService{

    constructor(){
        this.http = axios.create(
            {
                baseURL: "http://localhost:3000/categories"
            }
        )
    }

    getData(){
        return this.http.get('/category')
    }

    postData(data){
        return this.http.post('/category',data)
    }

}

let Category = new CategoryService()
export default Category