const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

// 3. MENAMBAHKAN BUKU
const addBook = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const finished = pageCount === readPage ? true : false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt; 

    // jika nama tidak ada
    if(name==undefined || name==false){
        return h.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. Mohon isi nama buku",
        }).code(400);
    }

    // jika dibaca > halaman yg ada
    if( readPage > pageCount ){
        return h.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        }).code(400);
    }
    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };
    bookshelf.push(newBook);
    return h.response({
        "status": "success",
        "message": "Buku berhasil ditambahkan",
        "data": {
            "bookId": `${id}`,
        },
    }).code(201);

}



// 4. MENAMPILKAN SEMUA BUKU
const displayBooks = (request, h) => {
    

    const [ queryKey ] = Object.keys(request.query); // key
    let key = queryKey;
    const { [key]: query } = request.query; // variabel
    

    // fungsi

    const bookInfo = bookshelf.map( book => {
        if(queryKey=='reading'){
            return {
                id: book.id, 
                name: book.name, 
                publisher: book.publisher,
                reading: book.reading,
            };
        }

        if(queryKey=='finished'){
            return {
                id: book.id, 
                name: book.name, 
                publisher: book.publisher,
                finished: book.finished,
            };
        }

        return {
            id: book.id, 
            name: book.name, 
            publisher: book.publisher,
        };
    } );


    // name
    
    // const searchString = bookInfo.filter( book => {
    //     return book.name.toLowerCase().includes(querySearch.toLowerCase());
    // } );

    // reading
    
    const searchReadingFalse = bookInfo.filter( book => {
        if(book.reading===false){
            delete book.reading;
            return book;
        }
    } ); // reading false
    const searchReadingTrue = bookInfo.filter( book => {
        if(book.reading === true){
            delete book.reading;
            return book;
        }
    } ); // reading true
    
    
    // finished
    
    const searchFinishedFalse = bookInfo.filter( book => {
        if(book.finished === false){
            delete book.finished;
            return book;
        }
    } ); // reading false
    const searchFinishedTrue = bookInfo.filter( book => {
        if(book.finished === true){
            delete book.finished;
            return book;
        }
    } ); // reading true
    
    
    
    
    const searchElse = bookInfo;  // reading all

    // response
    if(queryKey==='name'){ // jika key nama
        const querySearch = query;
        return h.response({
            "status": "success",
            "data": {
                // "books": searchString,
                "books": bookInfo.filter( book => book.name.toLowerCase().includes(querySearch.toLowerCase()) ),
            },
        }).code(200);
    }

    if(queryKey==='reading'){ // jika key reading
        if(query==0){ // jika false
            return h.response({
                "status": "success",
                "data": {
                    "books": searchReadingFalse,
                },
            }).code(200);
        }
        else if(query==1){ // jika benar
            return h.response({
                "status": "success",
                "data": {
                    "books": searchReadingTrue,
                },
            }).code(200);
        }
        else { // selain keduanya
            return h.response({
                "status": "success",
                "data": {
                    "books": searchElse,
                },
            }).code(200);
        }
    }

    if(queryKey==='finished'){ // jika key finished
        if(query==0){ // jika salah
            return h.response({
                "status": "success",
                "data": {
                    "books": searchFinishedFalse,
                },
            }).code(200);
        }
        else if(query==1){ // jika benar
            return h.response({
                "status": "success",
                "data": {
                    "books": searchFinishedTrue,
                },
            }).code(200);
        }
        else { // selain keduanya
            return h.response({
                "status": "success",
                "data": {
                    "books": searchElse,
                },
            }).code(200);
        }
    }

    return h.response({ // tanpa query
        "status": "success",
        "data": {
            "books": bookInfo,
        },
    }).code(200);
}




// 5. MENAMPILKAN SATU BUKU BERDASARKAN ID
const displayBookById = (request, h) => {
    const { bookId } = request.params;
    const book = bookshelf.find( e => e.id===bookId );
    // console.log(book);

    if(book===undefined){
        return h.response({
            "status": "fail",
            "message": "Buku tidak ditemukan",
        }).code(404);
    }

    return h.response({
        "status": "success",
        "data": {
            "book": book, // ?
        },
    }).code(200);
}




// 6. MENGEDIT BUKU BERDASARKAN ID
const editBook = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage ? true : false;

    const indexBook = bookshelf.findIndex( e => e.id==bookId );

    // jika tidak ada name
    if(name == undefined || name==false){
        return h.response({
            "status": "fail",
            "message": "Gagal memperbarui buku. Mohon isi nama buku",
        }).code(400);
    }

    // jika halaman dibaca > halaman buku
    if(readPage > pageCount){
        return h.response({
            "status": "fail",
            "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        }).code(400);
    }
    // jika tidak ditemukan
    if(indexBook == -1){
        return h.response({
            "status": "fail",
            "message": "Gagal memperbarui buku. Id tidak ditemukan",
        }).code(404);
    }


    bookshelf[indexBook] = {
        ...bookshelf[indexBook], bookId, name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt
    }
    // console.log(bookshelf[indexBook]);
    return h.response({
        "status": "success",
        "message": "Buku berhasil diperbarui",
    }).code(200);
}



// 7. HAPUS BUKU BERDASARKAN ID
const deleteBook = (request, h) => {
    const { bookId } = request.params;
    const indexBook = bookshelf.findIndex( e => e.id==bookId );

    // tidak ditemukan
    if(indexBook == -1){
        return h.response({
            "status": "fail",
            "message": "Buku gagal dihapus. Id tidak ditemukan",
        }).code(404);
    }


    // ditemukan 
    bookshelf.splice(indexBook, 1);
    return h.response({
        "status": "success",
        "message": "Buku berhasil dihapus",
    }).code(200);
}

module.exports = { addBook, displayBooks, displayBookById, editBook, deleteBook };