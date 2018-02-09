using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatServer.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerUI;

namespace ChatServer
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
            {
              builder
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowAnyOrigin();
                    //.WithOrigins("http://localhost:4200");
            }));

            services.AddMvc();
            services.AddSignalR();
      
            services.AddSwaggerGen(options =>
            {
              options.SwaggerDoc("v1", new Info
              {
                Version = "v1",
                Title = "ASP.NET Core Chat-Bots API",
                Description = "ASP.NET Core/Angular Swagger Documentation",
                TermsOfService = "None"
              });

              //Add XML comment document by uncommenting the following
              // var filePath = Path.Combine(PlatformServices.Default.Application.ApplicationBasePath, "MyApi.xml");
              // options.IncludeXmlComments(filePath);

            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("CorsPolicy");

            //app.UseDefaultFiles();
            //app.UseStaticFiles();

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
              c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });

            app.UseMvc();

            app.UseSignalR(routes =>
            {
                routes.MapHub<UsersHub>("users");
                routes.MapHub<RoomsHub>("chat_rooms");
                routes.MapHub<ChatHub>("messages");
            });
        }
    }
}
