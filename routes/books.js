const express=require('express');
const {books}=require('../data/books.json')
const {users}=require('../data/users.json')
const router=express.Router();

/*
 * Route: /books
 * Method: GET
 * Description:Get all the list of books in the system
 * Access: Public
 * Parameters: None
*/
router.get('/',(req,res)=>{
    res.status(201).json({
        success: true,
        data: books
    })
})

/*
 * Route: /books/id
 * Method: GET
 * Description:Get a book by their id
 * Access: Public
 * Parameters: id
*/
router.get('/:id',(req,res)=>{

    const id=parseInt(req.params.id);
    const book=books.find((each)=>each.id===id);

    if(!book){
        return res.status(404).json({
                success: false,
                message: `book Not Found for id:${id}`
            })
    }

    res.status(200).json({
        success: true,
        data: book
    })
})

/*
 * Route: /books
 * Method: POST
 * Description:Create a books by their id
 * Access: Public
 * Parameters: required details
*/
router.post('/',(req,res)=>{
    
    const {id,title,author,year,genre,publisher,price}=req.body;
    if(!id || !title || !author || !year || !genre){
        return res.status(404).json({
            success: false,
            message: "Please provide all the required fields"
        })
    }

    const book=books.find((each)=>each.id===id)
    if(book){
        return res.status(404).json({
            success: false,
            message: `book Already Exists with id:${id}`
        })
    }
    books.push({id,title,author,year,genre,publisher,price})

    res.status(201).json({
        success: true,
        message: "book Created Successfully"
    })
})

/*
 * Route: /books/:id
 * Method: PUt
 * Description: updating a book details by their id
 * Access: Public
 * Parameters: ID
*/
router.put('/:id',(req,res)=>{
    
    const id=parseInt(req.params.id);
    const {data}=req.body;
    const book=books.find((each)=>each.id===id)

    // if(!data || Object.keys(data).length===0){
    //     return res.sendStatus(404).json({
    //         success: false,
    //         message: "Please provide the data to be updated"
    //     })
    // }

    if(!book){
        return res.sendStatus(404).json({
            success: false,
            message: `book not found for id: ${id}`
        })
    }

    // Object.assign(book,data);

    const updatedbook=books.map((each)=>{
        if(each.id===id){
            return {
                ...each,
                ...data
            }
        }
        return each
    })

    return res.status(200).json({
    success: true,
    data: updatedbook,
    message: `book with id ${id} updated successfully`
  });
})


/*
 * Route: /books/:id
 * Method: DELETE
 * Description: Deleting a book by their id
 * Access: Public
 * Parameters: ID
*/
router.delete('/:id',(req,res)=>{
    const id=parseInt(req.params.id);
    const book=books.find((each)=>each.id===id)

    if(!book){
        res.sendStatus(404).json({
            success: false,
            message: `book not found with id:${id}`
        })
    }

    //if the book exists , then filter it out from the array
    const updatedbook=books.filter((each)=>each.id!==id)

    // const index=books.indexOf(book)
    // books.splice(index,1)

    res.sendStatus(200).json({
        success: true,
        message: "book Deleted Successfully"
    })
})

/*
 * Route: books/issued/forUsers
 * Method: GET
 * Description: Get all the issued books
 * Access: Public
 * Parameters:None
*/
router.get('/issued/forUsers', (req, res) => {
    const usersWithIssuedBooks = users.filter((user) => Number(user.issuedBooks) > 0);
    const issuedBooks = [];

    usersWithIssuedBooks.forEach((user) => {
        const book = books.find((book) => book.id === parseInt(user.issuedBooks));
        if (!book) return;

        issuedBooks.push({
            ...book,
            issuedBy: user.name,
            issuedDate: user.issueDate,
            returnDate: user.returnDate
        });
    });

    if (issuedBooks.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No books issued yet"
        });
    }

    res.status(200).json({
        success: true,
        data: issuedBooks
    });
});


module.exports=router;
