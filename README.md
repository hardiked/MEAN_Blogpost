Install the node and mongodb in your local computer.
Step to follow to install and run the programme:-
1. fork the repo or download the repo.
2. cd into the directory.
3. run "npm install" command.
4. if you don't want to install mongodb on yout pc then just go to mlab.com and create database and 
   database username there. Now replace "<username>" and "<password>" with your username and password and uncomment that line and comment the line below that. you are done.
5. go to sendgrid.com signup for account and then replce username and password with you credentials in api.js file
6. download elastic search from 'https://www.elastic.co/downloads/elasticsearch'
7. make sure that elasticsearch and project are in the same directory.
8. navigate to this folder and run 'bin\elasticsearch.bat'
9. run 'Invoke-RestMethod http://localhost:9200' in windows power shell, you get success message.
5. Now run "nodemon"
6. go to localhost:8080