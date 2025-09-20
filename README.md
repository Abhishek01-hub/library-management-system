# library-management-system

This is a library management API Backend of users and the books 

# Routes and the Endpoints

# /users
GET: Get all the list of users in the system
POST: Create/Register a new user

# /users(id)
GET: Get a user by their ID
PUT: Updating a user by their ID
DELETE: Deleting a user by their ID (Check if the user still has an issued book) && (is there any fine/penalty to be collected)

# /users/subscription-details/{id}
GET: Get a user description details by their ID
    >> Date of subscription
    >> Valid till ?
    >> Fine if any ?

# /books
GET: Get all the books in the system
POST: Add a new book to the system

# /books/{id}
GET: Get a book by its ID
PUT: Update a book details by its ID
DELETE: Delete a book by its ID

# /books/issued
GET: Get all the issued books

# /books/issued/withfine
GET: Get all issued books with their fine amount

# subscription Types
    >> Basic (3 months)
    >> Standard (6 months)
    >> Previous (12 monts)

>> If a user misses the renewal date, then user should be collected with 100rs
>> If a user misses the subscription, then user is excepted to pay 100rs
>> If a user misses both renewal and subscription, then the collected amount should be 200rs

# commands 
npm init
npm i express
npm i nodemon --save-dev

npm run dev

To restore node modules and package-lock.json --> npm i/npm install