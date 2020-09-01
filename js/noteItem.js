class NoteItem {
    constructor(title, note, index){
        this.title = title
        this.note = note
        this.index = index
    }

    getTitle(){
        return this.title
    }

    getNote(){
        return this.note
    }

    getIndex(){
        return this.index
    }

    setIndex(i){
        this.index = i
    }
}