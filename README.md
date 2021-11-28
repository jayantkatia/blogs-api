# :ok: :books: blogs-api
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
        # DATABASE SERVER
        DB_HOST=<YOUR_HOST_ADDRESS>
        DB_USER=<YOUR_DB_USERNAME>
        DB_PASS=<YOUR_DB_PASSWORD>
        DB_NAME=<YOUR_DB_NAME>
        DB_PORT=<YOUR_DB_PORT>

        # APPLICATION SERVER
        PORT=<YOUR_SERVER_PORT>
        SECRET=<YOUR_JWT_SECRET>

        # NODEMAILER
        MAIL_FROM_NAME=<YOUR_MAIL_NAME> 
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
