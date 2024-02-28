![Banner](https://github.com/soyrvelez/organized-chatbot/blob/main/organized-chatbot-banner.png?sanitize=true)
# `Organized Chatbot`
A minimalist AI chatbot experience for developers.

## What is it?
Customizable AI Chatbot with passworldess authentication, REST API & a minimalist UI.

## Installation Instructions
1. Fork and clone this repository.
2. Run `npm install` from your terminal while inside of the project's directory.
3. Set up a `.env` and add your credentials. Reference sampleenv for the required credentials as the app expects them.
4. Recommended: Create a Vercel project and add a Vercel KV storage and a Vercel Postgres Storage. You can configure your own Postgres database as well.
5. Run your app in your local environment `npm run dev`.

## Stack Used
- **Next.JS 14 (App Router):** Our app's Frontend and API are both built as a Next.JS project.
- **Vercel KV:** Redis-based Key Value Storage that supports streaming features.
- **Vercel Postgres:** PostgreSQL DB to store user information and preferences.
- **Prisma:** ORM to communicate with the Postgres Storage.
- **OAuth:** Passworldess login powered by the Github provider and Next.auth.
- **OpenAI API:** LLM powering up our chatbot.
- **Vercel:** For seamless Next.JS deployment.


### App Wireframes

![Login Page](https://github.com/soyrvelez/organized-chatbot/blob/main/login.png?sanitize=true)
![Main App](https://github.com/soyrvelez/organized-chatbot/blob/main/app.png?sanitize=true)

### User Stories
- As a user I should be able to login utilizing my Github Account
- As a user I should be able to understand what I can do in the app.
- As a user I should be able to send messages to a chatbot.
- As a user I should be able to create new chats with their own message history.
- As a user I should be able to share chats and their associated messages with other people without them getting access to my account.
- As a user I should be able to delete chats from my history.
- As a user I should be able to delete my entire chat history.
- As a user I should be able to easily copy responses so I can paste them in other apps.
- As a user I should be able to change between Light and Dark themes.

### DATABASE ERD
![Database ERD](https://github.com/soyrvelez/organized-chatbot/blob/main/organized-chatbot-erd.png?sanitize=true)
This project uses 2 different stores. A PostgreSQL database for users and a Redis Key Value Store for chats and messages. The Key  Value Storage is crucial to enable streaming and handle responses from the OpenAI API.

### API
The app's API allows developers to easily extend or customize endpoints where they can add or modify request logic.

You can test the API using `https://organized-chatbot.vercel.app/api`
#### auth
`GET` and `POST` routes that enable Next.auth implementation.
#### user
##### Add User
  - **Method:** `POST`
  - **Endpoint:** `/user`
  - **Body:**
    ```
    {
      "id": "1111",
      "createdAt": "2022-09-15T00:00:00.000Z",
      "updatedAt": "2022-09-15T00:00:00.000Z"
      }
    ```
##### User By ID
  - **Method:** `GET`
  - **Endpoint:** `/user?id=userId`
##### Get users with a single preference
  - **Method:** `GET`
  - **Endpoint:** `/user?filter=singlePreference`
##### Get users with multiple preferences
  - **Method:** `GET`
  - **Endpoint:** `/user?filter=multiplePreferences`

##### Update User
Let's you update an user's id by specifying the existing id and new id.
  - **Method:** `PUT`
  - **Endpoint:** `/user`
  - **Body:**
```
{
    "currentId": "1111",
    "newId": "2222",
}
```
##### Delete User
  - **Method:** `DELETE`
  - **Endpoint:** `/user?id=userID`

#### preferences
Allows developers to customize the behavior of the chatbot for a particular user. You can control which OpenAI model to use and how deterministic its responses should be using temperature

For more information about currently available models, please reference the [OpenAI API Documentation.](https://platform.openai.com/docs/models)

##### Add Preference
  - **Method:** `POST`
  - **Endpoint:** `/preferences`
  - **Body:**
    ```
    {
      "title": "New Preference 1",
      "preferredModel": "gpt-3.5-turbo",
      "temperature": 0.1,
      "active": true,
      "userId": "1111"
    }
    ```
##### Get Preference by Preference Id
  - **Method:** `GET`
  - **Endpoint:** `/preferences?id=preferenceId`
##### Get Preferences by User Id
Gets all preferences associated with a single user.
  - **Method:** `GET`
  - **Endpoint:** `/preferences?userId=userId`
##### Get Preferences by Model
Gets all preferences associated with a value for model.
  - **Method:** `GET`
  - **Endpoint:** `/preferences?model=model`
##### Delete by ID
  - **Method:** `DELETE`
  - **Endpoint:** `/preferences?id=preferenceId`
##### Update by ID
  - **Method:** `PUT`
  - **Endpoint:** `/preferences?id=preferenceId`
  - **Body:**
  ```
  {
  "id": 5,
  "preferredModel": "gpt-4-0125-preview",
  "temperature": 0.9,
  "active": true,
  "userId": "9901105"
  }
  ```
#### chat
##### Get chat by chat Id
  - **Method:** `GET`
  - **Endpoint:** `/chat?id=chatId`
##### Get chats by User Id
  - **Method:** `GET`
  - **Endpoint:** `/chat?userId=userId`
#### messages
##### Get messages by Chat Id
  - **Method:** `GET`
  - **Endpoint:** `/messages?chatId=chatId`
##### Get messages by Chat Id and Role
This is useful when you want to analyze either only assistant or user messages from a single chat.
  - **Method:** `GET`
  - **Endpoint:** `/messages?chatId=chatId&role=role` (Role is either 'user' or 'assistant')

#### App
![App Page Deployed](https://github.com/soyrvelez/organized-chatbot/blob/main/app-prod.png?sanitize=true)

Thanks to Next.js' App Router we can handle all of the app's functionality from a single page where we leverage different components.

#### Learnings & Opportunities

##### Learnings
- Handling authentication with OAuth.
- Working with the shadcn/ui component library.
- Redis and Key Value Storage why and how to use it.
- Model and API data validations.

##### Opportunities
- Expand featureset
- Implement solutions that allow models from different providers like Hugging Face
