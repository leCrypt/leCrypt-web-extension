class LoginItem {
    constructor(website, username, password, index){
        this.website = website
        this.username = username
        this.password = password
        this.index = index
    }

    getWebsite(){
        return this.website
    }

    getUsername(){
        return this.username
    }

    getPassword(){
        return this.password
    }

    getIndex(){
        return this.index
    }

    setIndex(i){
        this.index = i
    }

}