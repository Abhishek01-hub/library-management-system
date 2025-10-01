
const express=require('express')
const {users}=require('../data/users.json')
const router=express.Router();

/*
 * Route: /users
 * Method: GET
 * Description:Get all the list of users in the system
 * Access: Public
 * Parameters: None
*/
router.get('/',(req,res)=>{
    res.status(201).json({
        success: true,
        data: users
    })
})

/*
 * Route: /users/id
 * Method: GET
 * Description:Get a user by their id
 * Access: Public
 * Parameters: id
*/
router.get('/:id',(req,res)=>{

    const id=parseInt(req.params.id);
    const user=users.find((each)=>each.id===id);

    if(!user){
        return res.status(404).json({
                success: false,
                message: `User Not Found for id:${id}`
            })
    }

    res.status(200).json({
        success: true,
        data: user
    })
})

/*
 * Route: /users
 * Method: POST
 * Description:Create a user by their id
 * Access: Public
 * Parameters: required details
*/
router.post('/',(req,res)=>{
    
    const {id,name,email,membershipType,joinedDate,active,subscriptionType,subscriptionDate,issuedBook,issuedBy,issueDate,returnDate}=req.body;
    if(!id || !name || !email || !membershipType || !joinedDate || !active ||!subscriptionType || !subscriptionDate || !issuedBook || !issuedBy || !issueDate || !returnDate){
        return res.status(404).json({
            success: false,
            message: "Please provide all the required fields"
        })
    }

    const user=users.find((each)=>each.id===id)
    if(user){
        return res.status(404).json({
            success: false,
            message: `User Already Exists with id:${id}`
        })
    }
    users.push({id,name,email,membershipType,joinedDate,active,subscriptionType,subscriptionDate,issuedBook,issuedBy,issueDate,returnDate})

    res.status(201).json({
        success: true,
        message: "User Created Successfully"
    })
})

/*
 * Route: /users/:id
 * Method: PUt
 * Description: updating a user details by their id
 * Access: Public
 * Parameters: ID
*/
router.put('/:id',(req,res)=>{
    
    const id=parseInt(req.params.id);
    const {data}=req.body;
    const user=users.find((each)=>each.id===id)

    if(!user){
        return res.sendStatus(404).json({
            success: false,
            message: `User not found for id: ${id}`
        })
    }

    // Object.assign(user,data);
    const updatedUser=users.map((each)=>{
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
    data: updatedUser,
    message: `User with id ${id} updated successfully`
  });
})


/*
 * Route: /users/:id
 * Method: DELETE
 * Description: Deleting a user by their id
 * Access: Public
 * Parameters: ID
*/
router.delete('/:id',(req,res)=>{
    const id=parseInt(req.params.id);
    const user=users.find((each)=>each.id===id)

    if(!user){
        res.sendStatus(404).json({
            success: false,
            message: `User not found with id:${id}`
        })
    }

    //if the user exists , then filter it out from the array
    const updatedUser=users.filter((each)=>each.id!==id)

    // const index=users.indexOf(user)
    // users.splice(index,1)

    res.sendStatus(200).json({
        success: true,
        message: "User Deleted Successfully"
    })
})

/*
 * Route: users/subscription/:id
 * Method: POST
 * Description: Barrow a book by it's id
 * Access: Public
 * Parameters: id
*/
router.get('/subscription-details/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find((each) => each.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: `User not found with id: ${id}`
        });
    }

    // Helper to convert a date string to days since epoch
    const getDateInDays = (dateStr = '') => {
        const date = dateStr ? new Date(dateStr) : new Date();
        return Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
    };

    // Helper to calculate expiration date based on subscription type
    const calculateExpirationDate = (startDateStr, type) => {
        const startDate = new Date(startDateStr);
        let durationDays = 0;

        switch (type) {
            case "Basic":
                durationDays = 90;
                break;
            case "Standard":
                durationDays = 180;
                break;
            case "Premium":
                durationDays = 365;
                break;
            default:
                durationDays = 0;
        }

        const expirationDate = new Date(startDate);
        expirationDate.setDate(startDate.getDate() + durationDays);
        return expirationDate;
    };

    const currentDateDays = getDateInDays();
    const returnDateDays = getDateInDays(user.returnDate);
    const subscriptionStartDays = getDateInDays(user.subscriptionDate);
    const subscriptionExpirationDate = calculateExpirationDate(user.subscriptionDate, user.subscriptionType);
    const subscriptionExpirationDays = Math.floor(subscriptionExpirationDate.getTime() / (1000 * 60 * 60 * 24));

    const data = {
        subscriptionExpired: subscriptionExpirationDays < currentDateDays,
        subscriptionDaysLeft: Math.max(subscriptionExpirationDays - currentDateDays, 0),
        daysLeftforExpiration: Math.max(returnDateDays - currentDateDays, 0),
        returnDate: returnDateDays < currentDateDays ? "Book is overdue" : user.returnDate,
        fine: returnDateDays < currentDateDays
            ? (subscriptionExpirationDays <= currentDateDays ? 200 : 100)
            : 0
    };

    res.status(200).json({
        success: true,
        data: data
    });
});

module.exports=router;
