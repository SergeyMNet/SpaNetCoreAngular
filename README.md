# ChatBotApp

![](https://www.bitrise.io/app/19d5f0f09e3648fd/status.svg?token=IlnA4JFO2kzSPpkJcEuWTA&branch=master)
[![Build Status](https://travis-ci.org/SergeyMNet/chat-app.svg?branch=master)](https://travis-ci.org/SergeyMNet/chat-app)


This is simple anonymous chat,
where you can create random avatar
and start conversation with different people (including your own avatars)

Stack
-----

- Angular 5
- Typescript
- Angular CLI
- Angular Material 2
- dotnet-core
- SignalR-core
- .Net Core CLI
- Firebase SDK with OAuth, Database, Storage
- RxJS
- NgRx, Redux 
- @ngrx/store, @ngrx/effects, @ngrx/store-devtools
- SASS
- Circle CI

## DEMO
Live DEMO [here](https://alice-1d9df.firebaseapp.com/)!
[![angular-chat-app](https://github.com/SergeyMNet/chat-app/blob/master/scr/Chat-emoji.gif)](https://alice-1d9df.firebaseapp.com/)

[![angular-chat-app](https://github.com/SergeyMNet/chat-app/blob/master/scr/chat_redux.gif)](https://alice-1d9df.firebaseapp.com/)

## Development server

For simple start angular project with firebase SDK:
 - Run `npm i` for install all nodes.
 - Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. 

For first start with dotnet-core server and signalR - you need install [dotnet core](https://docs.microsoft.com/en-us/dotnet/core/)
and then run commands:
 - Run `npm i` for install all nodes.
 - Run `ng build` for build angular project
 - Run `dotnet build ChatServer.csproj` for build dotnet-core app
 - Run `dotnet run` for run server. Navigate to `http://localhost:5300/`. 

