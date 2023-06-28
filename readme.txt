MySQL (to connect to Azure MySQL Cloud database):

Our team has set up a cloud database for ease of access. However, you will not be able to access the database over NUS Wi-Fi due to firewall issues. If you are on NUS premises and would like to run the database locally, please refer to the next section 'MySQL (To run database locally)'.
If you would like to access our cloud database, please follow our instructions under the section 'IntelliJ (Backend)


MySQL (To run database locally):

Important to note - if you are manually adding your own dataset to the MySQL tables, please encrypt the passwords beforehand at the following link: https://bcrypt-generator.com/. However, when running the program as an administrator user, you may still create passwords via the UI normally without using Crypt.

The following instructions are for setting the database up locally without connecting to Azure Cloud.
After saving our database file in the desired folder, add the database to MySQL by:

1. Open your terminal or command prompt

2. Log in to MySQL server as the root user using the following command:
	mysql -u root -p

3. Once logged in, switch to MySQL database in the terminal:
	USE mysql;

4. Run the following command to create a new database (replace database_name with desired name):
	CREATE DATABASE database_name;

5. Verify the database is created by listing the existing databases:
	SHOW DATABASES;

6. Switch to the database with the following command:
	USE database_name;

7. Import the .sql file using the following command (replace <path> with actual file path):
	source <path>;


IntelliJ IDEA (Back-end, must be run concurrently with front-end):
1. Open CAPS_Backend folder in the IntelliJ workspace.

2. Open the Database tool window (icon located on the right-hand side of the IDE).
	
3. Click "+" to add a database and navigate to Database > MySQL.

4a. If you are accessing the database from our cloud, the fields should be as follows:
	Host: nus-iss-db.mysql.database.azure.com
	Port: 3306
	Authentication: User & Password
	User: db_admin
	Password: A7a6p^9a&Df@uc
	URL: jdbc:mysql://nus-iss-db.mysql.database.azure.com:3306

4b. If you are accessing the database locally from MySQL, the fields should be as follows:
	Host: localhost
	Port: <port number that you run MySQL on>
	Authentication: User & Password
	User: root (or other usernames that can edit this database)
	Password: <your password>
	URL: <automatically generated>
	Database: (name of database to query)
	Copy the URL as you will need it in step 5, apply the changes and click 'OK' to close.
	
For both 4a and 4b, ensure that the required drivers have already been installed and test your SQL connection at the bottom of the window.
	

5. Go to Run/Debug Configurations, select "CapsApplication" under Spring Boot. The fields should be as follows:
	Run on: Local machine
	Build and run: select the path to JDK 17 on your computer
	Override configuration properties - add the following:

	For accessing the cloud:
		DB_URL: jdbc:mysql://nus-iss-db.mysql.database.azure.com:3306/caps_db
		DB_USERNAME: db_admin
		DB_PASSWORD: A7a6p^9a&Df@uc

	For accessing the database locally:
		DB_URL: value is the URL you have copied in step 4
		DB_USERNAME: username which you have entered in step 4b
		DB_PASSWORD: your password

	This will ensure that we do not need to code our username and password into the application.yml file.
	Apply the changes and click 'OK' to close.

6. Right click 'CapsApplication' located in src>main>java>sg.edu.nus.iss.caps>util and select "Run 'Caps Application'".


IntelliJ (front-end, must be run concurrently with back-end)

1. Install Node.js if you have not done so.

2. Open CAPS_Frontend in a new window.

3. Ensure that in the terminal, you are in the CAPS_Frontend directory.

4. In the terminal, run the following command to install the dependencies:
	npm install
Alternatively, run npm install when prompted to by IntelliJ.

5. After installation is complete, run the following command in the terminal to load the React pages in your web browser:
	npm start

6. IntelliJ may prompt you to use another port if the program tries to access one that is occupied. In that case, simply select 'yes' by pressing 'y' and 'enter' to continue.

