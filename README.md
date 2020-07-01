# intertodo-gapi
A Todo List application GraphQL API, based on Apollo Server, GraphQL, OAuth 2 and JWT (No database, store data by files).
Frontend at: https://github.com/wilsonwu/react-todo

## Features
 - User Sign Up
 - User Sign In
 - Todo List
 - Add new Todo item
 - Edit Todo item.
 - Delete Todo item.
 - Mark Todo item as Completed

## Project setup
```
npm install
```

### Run
```
node index.js
```

### For build Docker image
```
docker build . -t intertodo-gapi
```

### Run application in Docker
```
docker run -p 4000:4000 intertodo-gapi
```

### For deploy to Kubernetes
```
kubectl k8s/deployment.yaml
```
```
kubectl k8s/service.yaml
```