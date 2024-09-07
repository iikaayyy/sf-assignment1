# Chat Application

A role-based chat application built using **Angular** for the frontend and **Node.js/Express** for the backend. The app allows multiple users to join groups and channels, request group memberships, and interact based on their role (Super Admin, Group Admin, Chat User).

## Features

- **User Roles**: 
  - **Super Admin (SU)**: Manage all groups, approve/deny user requests, and manage users.
  - **Group Admin (GA)**: Manage assigned groups, add/remove users from their groups.
  - **Chat User (CA)**: Join groups and channels, and send messages.

- **Group Management**:
  - Users can join existing groups or request to join.
  - Group Admins can approve or deny user requests.
  - Channels for group chats like "Main" and "Announcements".

- **Authentication**:
  - Users can sign up, log in, and request to join groups.

## API Endpoints

### Authentication
- `POST /login`  
  Login a user by validating their username and password.

- `POST /sign-up`  
  Sign up a user and send their request for approval.

### Group Requests
- `POST /join-group`  
  Request to join a group.

- `POST /modify-group-request`  
  Approve or deny group join requests.

### User Management
- `GET /users`  
  Retrieve all users.

- `POST /delete-user`  
  Delete a user and remove them from their associated groups.

- `POST /remove-user`  
  Remove a user from a specific group.

### Group Management
- `GET /groups`  
  Retrieve all available groups.

- `POST /create-group`  
  Create a new group with channels and assign an admin.

## Installation

### Prerequisites
- **Node.js** (v16 or above)
- **Angular CLI** (for frontend development)

### Backend Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/chat-app.git
    ```
2. Install the dependencies:
    ```bash
    cd chat-app/server
    npm install
    ```
3. Start the backend server:
    ```bash
    npm start
    ```
    The server will run on `http://localhost:3000`.

### Frontend Setup
1. Navigate to the frontend directory:
    ```bash
    cd ../chatApp
    ```
2. Install Angular dependencies:
    ```bash
    npm install
    ```
3. Start the Angular frontend:
    ```bash
    ng serve
    ```
    The frontend will run on `http://localhost:4200`.

## Usage

- Navigate to `http://localhost:4200` in your browser.
- Sign up or log in with existing credentials.
- Join or request to join groups.
- Admins can manage groups and user requests via the dashboard.
