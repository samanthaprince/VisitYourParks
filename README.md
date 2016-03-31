# VisitYourParks  
***National Parks 'Bucket' List***

This API leverages geolocation data from the National Parks service to
provide users with the ability to discover when they are near features
or parks they may be interested in.  

A user creates a new account and adds features or parks to their "List".
Then, whenever they log in, the API will tell them which features or parks
are currently within 200 miles of their location.

## Routes

### Authentication Routes (auth_routes.js)

  * **'/signup'** - Create a new user  

    **POST** body =

        {
          fullName: <name>,
          email: <name@example.com>,
          password: <password>
        }

  * **'/signin'** - Login an existing user

    **GET** Basic Authorization: email & password

### User Routes (user_routes.js)

  * **'/users'**

    **GET** Token Authorization, Admin User Only

        'Content-Type application/json'
        'token', <token>

  * **'/users/:user'** (where :user = ObjectId)

    **GET** Token Authorization, Existing User or Admin User

        'Content-Type application/json'
        'token', <token>

    **PUT** Token Authorization, Existing User or Admin User

        'Content-Type application/json'
        'token', <token>

        {
          fullName: <name>,
          authentication.email: <email>,
          authentication.password: <password>,
          admin: <boolean>,
          list: [
            {'item': <ObjectId>}
          ]
        }

    **DELETE** Token Authorization, Admin User only

        'Content-Type application/json'
        'token', <token>

  * **'/users/:user/list** - returns a user's list

    **GET** Token Authorization, Existing User or Admin User

        'Content-Type application/json'
        'token', <token>

### Parks Routes (parks_routes.js)

  * **'/parks'** - returns an array of parks

    **GET** Token Authorization, Existing User

        'Content-Type application/json'
        'token', <token>

    **POST** Token Authorization, Existing User

        'Content-Type application/json'
        'token', <token>

  * **'/parks/:id'**

    **GET** Token Authorization, Existing User

        'Content-Type application/json'
        'token', <token>

  * **'/search'**

    **GET** Token Authorization, Existing User

        'Content-Type application/json'
        'token', <token>

  * **'/state'**

    **GET** Token Authorization, Existing User

        'Content-Type application/json'
        'token', <token>

### Geolocation Routes

  * **'/geolocation/?longitude=<longitude>&latitude=<latitude>'**

    **GET** Token Authorization, Existing User

        'Content-Type application/json'
        'token', <token>

  * **'/userGeo/:user/geolocation/?longitude=<longitude>&latitude=<latitude>'**

    **GET** Token Authorization, Existing User

        'Content-Type application/json'
        'token', <token>

