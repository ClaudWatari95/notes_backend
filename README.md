# Background

Runs on:
    Node - v18.17.1
    npm - v9.6.7

Database: MongoDB v6.0.9


# SETUP

  - Run ``` git clone ```

  or

  - ``` Extract  folders```


  - ``` cd ``` into **Notes_backend**

  - Run ``` npm install ```

  - (optional) Run ``` rm package-lock.json ```

  - Run ``` npm start ``` or ``` npm run dev ``` (to check for changes and auto-update the server)


-----------------------------------------------------------------------------------------------------------------

  # ROUTES/ ENDPOINTS

  [POST] /create

    body: ``` {  title: String, content: String }  ```

  [PATCH] /sync_note/:noteID
  
    params: ``` {  noteID: integer }  ```
    query: ``` {  versioon: integer }  ```

  [PATCH] /delete_note/:noteID
  
    params: ``` {  noteID: integer }  ```
  
  [GET] /read_notes

    ``` { }  ```

  [GET] /read_note
  
    params: ``` {  noteID: integer }  ```

----------------------------------------------------------------------------------------------------------------

## Further reading


I have sent all requests with no http status codes, so all responses are currently **"200, OK"**, as seen in the "/app.js" file.

Just custom checking the response object props in client side. Update status codes later.


## Deployment

The code is deployed on [railways.app]


----------------------------------------------------------------------------------------------------------------

Client side app code will be linked here later.
