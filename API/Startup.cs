using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Middleware;
using Application.Activities;
using Domain;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API
{
    public class Startup
    {
        public Startup (IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices (IServiceCollection services)
        {

            services.AddDbContext<DataContext> (options =>
            {
               options.UseMySql(Configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddCors (options =>
            {
                //allows any requests from localhost;3000 to get into app
                options.AddPolicy ("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader ().AllowAnyMethod ().WithOrigins ("http://localhost:3000");
                });
            });

            //although we'll have many handlers, we just need to tell Startup the assembly of one for DI
            services.AddMediatR(typeof(List.Handler).Assembly);

            services.AddControllers ()
                .AddFluentValidation(cfg => {
                    //only once, wherever the application assembly is
                    //calls any classes with abstractvalidator
                    cfg.RegisterValidatorsFromAssemblyContaining<Create>();
                });

            var builder = services.AddIdentityCore<AppUser>();
            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>(); //creates user stores
            identityBuilder.AddSignInManager<SignInManager<AppUser>>(); //ability to create/manage users

            services.AddAuthentication();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure (IApplicationBuilder app, IWebHostEnvironment env)
        {

            app.UseMiddleware<ErrorHandlingMiddleware>();

            if (env.IsDevelopment ())
            {
                // app.UseDeveloperExceptionPage ();
            }

            /* app.UseHttpsRedirection(); */

            app.UseCors("CorsPolicy");

            app.UseRouting ();

            app.UseAuthorization ();

            app.UseEndpoints (endpoints =>
            {
                endpoints.MapControllers ();
            });
        }
    }
}