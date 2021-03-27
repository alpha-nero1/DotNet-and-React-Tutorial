# .Net-and-React-Tutorial
A project following the udemy tutorial "The complete guide to building an app from start to finish using ASP.NET Core, React (with Typescript) and Mobx"

TryCatchLearn resources for the reactivities project: https://github.com/TryCatchLearn/Reactivities

## Dotnet
- `dotnet -h` to see available commands.
- `dotnet watch run` run a project that is watched.
- `dotnet tool install --global dotnet-ef --version 5.0.3` globally installed ef.
- `dotnet ef migrations add Initial -p Persistence -s API` - how you create migrations!
- `dotnet new classlib -n Infrastructure` - add new project called Infrastructure.
- `dotnet sln add Infrastructure` - then add it to the solution.
- `dotnet add reference ../Application` - to add a ref from application to Infrastructure. this is more or less a dependency.

## React
- `npx create-react-app client-app --use-npm --template typescript`
- We can use <Fragment> or <> to contain react JSX, these do not translate to divs in markup.


## Layers
persistence: Data access layer.

- Good for debugging components and state.
https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en

- Axios can make http requests for react
https://github.com/axios/axios

- Project uses "Clean Architecture Pattern"

Inner -> outer
Domain -> Application -> Api


## CQRS + Mediator
Command and Query Responsibility Segregation
https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs

Mediator: Handles accepting a request and returning a response.

- Tutotial 41 if cancellation token becomes relevant.
- Can use standard VSCode debugger for the ASP.Net application.

## JSON to TS
Wow so cool: http://json2ts.com/

- Also you can use generics on JS functions, never realised.

## Clean the DB
- `dotnet ef database drop -s API -p Persistence`

## Refresh Imports
- `dotnet restore`

## Remove migrations with ef (before commited).
- `dotnet ef migrations remove -p Persistence -s API`

## Vertabelo
- https://vertabelo.com - allows us to create DB models from SQL cripts.
`dotnet ef migrations script -o test.sql -p Persistence -s API` to generate such a script.

Total Tutorials: 288
Up to: 264/288 (91.6%)

23-02 - 16 to 48 (32)

# PSQL
```
docker run --name dev -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=reactivities -e POSTGRES_USERNAME=admin -p 5432:5432 -d postgres:latest
```

- I got really really stuck on this. With docker the host ip may not necessarily be localhost, in the case of windows the ip was different. I did a `docker inspect <container name>` to find what the ip adress of the container was.

- dotnet tool update -g dotnet-ef

# Heroku
to push to heroku: `git push heroku main`

# Starting PSQL in docker container.

```
docker run --name dev -p 54321:5432 -e POSTGRES_PASSWORD=secret -d postgres:latest
```

AND

```
docker exec -it dev psql -U postgres -c "CREATE DATABASE reactivities;"
```

## "You need to enable JavaScript to run this app."
If we run the prod version from kestrel server on dotnet we will see the message "You need to enable JavaScript to run this app." and will not be able to see network responses.

Run the actual project from client app to debug.

When we want to deploy changes to our dotnet server we would exec
`npm run build` which will automatically use our `postbuild` script to move to the dotnet wwwroot/

OR

What you thought was a post request is actually a get and it has returned a document containing JS.

## Dev mode
- In dev mode when you get the full error screen yu can esc out of it by pressing `esc`.
