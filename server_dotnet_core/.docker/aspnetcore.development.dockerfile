FROM microsoft/aspnetcore-build

LABEL author="Sergey Matvienko" 

ENV DOTNET_USE_POLLING_FILE_WATCHER=1
ENV ASPNETCORE_URLS=http://*:5050

WORKDIR /var/www/dotnet_server

CMD ["/bin/bash", "-c", "dotnet restore ChatServer.csproj && dotnet watch run"]
