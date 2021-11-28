#  📝 blogs-api
Blogs API to server blogs to users. Sign up, write blogs, get acknowledged. 

### :rocket: Get Started with the Installation 
1. Required Installations
    1. <a href="https://nodejs.org/en/download/">Install Node.js in your system</a>
    2. <a href="https://docs.docker.com/engine/install/">Install Docker in your system</a>
    3. Make sure you have ```make``` tool installed.
2. Navigate into the project directory
3. Run
    ```shell
       npm i -g yarn
       yarn install
       make mysql-docker-run
       make createdb 
    ```
    This sets up and runs your mysql container, creates db in it.
4. Create and populate ```.env file```
    ```env
        # Hard coded values as per the Makefile, make changes accordingly.        
        # For quick setup, some values are already filled.

        # DATABASE SERVER
        DB_HOST=127.0.0.1
        DB_USER=root
        DB_PASS=secret
        DB_NAME=blogs_api
        DB_PORT=3306

        # APPLICATION SERVER
        PORT=3000
        SECRET=<YOUR_JWT_SECRET>

        # NODEMAILER
        MAIL_FROM_NAME=📝 The Blogs Central 
        MAIL_FROM_ADDRESS=<YOUR_MAIL_ADDRESS>
        MAIL_PASS=<YOUR_MAIL_PASSWORD>

    ```
5. Run
    ```shell
        npm start
    ```
    This runs app.js and you are good to go :wink:
    

### :purple_heart: Development and Contributing
Yes, please! Feel free to contribute, raise issues and recommend best practices.
<a href="https://github.com/jayantkatia/blogs-api/blob/main/Makefile"> Makefile</a> is your friend.
