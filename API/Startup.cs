using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Activities;
using Application.Interfaces;
using Application.Profiles;
using API.Middleware;
using API.SignalR;
using AutoMapper;
using Domain;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
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
                options.UseLazyLoadingProxies ();
                options.UseMySql (Configuration.GetConnectionString ("DefaultConnection"));
            });

            services.AddCors (options =>
            {
                //allows any requests from localhost;3000 to get into app
                options.AddPolicy ("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyHeader ()
                        .AllowAnyMethod ()
                        .WithOrigins ("http://localhost:3000")
                        .WithExposedHeaders ("WWW-Authenticate")
                        .AllowCredentials ();
                });
            });

            services.AddScoped<IJwtGenerator, JwtGenerator> ();
            services.AddScoped<IUserAccessor, UserAccessor> ();
            services.AddScoped<IPhotoAccessor, PhotoAccessor> ();
            services.AddScoped<IProfileReader, ProfileReader> ();
            
            //we can map our secrets to class
            services.Configure<CloudinarySettings> (Configuration.GetSection ("Cloudinary"));

            //although we'll have many handlers, we just need to tell Startup the assembly of one for DI
            services.AddMediatR (typeof (List.Handler).Assembly);

            services.AddAutoMapper (typeof (List.Handler).Assembly); //look for mapping profiles in Application Assembly

            services.AddSignalR (); //not core bc we want to use all default services

            //adding a policy making our controllers require authentication
            services.AddControllers (opt =>
                {
                    var policy = new AuthorizationPolicyBuilder ().RequireAuthenticatedUser ().Build ();
                    opt.Filters.Add (new AuthorizeFilter (policy));

                })
                .AddFluentValidation (cfg =>
                {
                    //only once, wherever the application assembly is
                    //calls any classes with abstractvalidator
                    cfg.RegisterValidatorsFromAssemblyContaining<Create> ();
                });

            var builder = services.AddIdentityCore<AppUser> ();
            var identityBuilder = new IdentityBuilder (builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext> (); //creates user stores
            identityBuilder.AddSignInManager<SignInManager<AppUser>> (); //ability to create/manage users

            services.AddAuthorization (opt =>
            {
                opt.AddPolicy ("IsActivityHost", policy =>
                {
                    policy.Requirements.Add (new IsHostRequirement ());
                });
            });

            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler> ();

            var key = new SymmetricSecurityKey (Encoding.UTF8.GetBytes (Configuration["TokenKey"]));
            services.AddAuthentication (JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer (opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero //don't wait for 5 min cache 
                    };

                    opt.Events = new JwtBearerEvents
                    {
                        //OnMessageReceived add token to context hub
                        OnMessageReceived = (context) =>
                        {
                            //grab token initialized from client side
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty (accessToken) && path.StartsWithSegments ("/chat"))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;

                        }
                    };
                });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure (IApplicationBuilder app, IWebHostEnvironment env)
        {

            app.UseMiddleware<ErrorHandlingMiddleware> ();

            IdentityModelEventSource.ShowPII = true;
            if (env.IsDevelopment ())
            {

                // app.UseDeveloperExceptionPage ();
            }

            app.UseDefaultFiles (); //to tell our app to look for conventional names like index.html etc
            app.UseStaticFiles ();

            /* app.UseHttpsRedirection(); */
            app.UseRouting ();
            app.UseCors ("CorsPolicy");

            app.UseAuthentication ();
            app.UseAuthorization ();

            app.UseEndpoints (endpoints =>
            {
                endpoints.MapControllers ();
                endpoints.MapHub<ChatHub> ("/chat");
                endpoints.MapFallbackToController ("Index", "Fallback");

            });
        }
    }
}