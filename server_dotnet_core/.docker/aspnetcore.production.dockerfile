FROM microsoft/aspnetcore-build as publish
WORKDIR /publish
COPY ChatServer.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish --output ./out

FROM microsoft/aspnetcore
LABEL author="Sergey Matvienko" 
WORKDIR /var/www/dotnet_server
COPY --from=publish /publish/out .
ENV ASPNETCORE_URLS=http://*:5050
ENTRYPOINT ["dotnet", "ChatServer.dll"]
