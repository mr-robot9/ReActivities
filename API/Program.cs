using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;
using Serilog;

namespace API
{
    public class Program
    {
        public static void Main (string[] args)
        {

            var host = CreateHostBuilder (args).Build ();
            var logPath = System.IO.Path.Combine("/var/temp/", "log.txt");

            Log.Logger = new LoggerConfiguration ()
                .WriteTo.File(logPath, rollingInterval: RollingInterval.Day, retainedFileCountLimit: 10)
                .CreateLogger ();

            //get data context
            using (var scope = host.Services.CreateScope ())
            {
                var services = scope.ServiceProvider;

                //anytime we start app, create a db if it doesn't exist, and apply any pending migrations
                try
                {
                    var context = services.GetRequiredService<DataContext> ();
                    var userManager = services.GetRequiredService<UserManager<AppUser>> ();
                    context.Database.Migrate ();
                    Seed.SeedData (context, userManager).Wait ();
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>> ();
                    logger.LogError (ex, "An error occurred during migration");
                }
            }

            host.Run ();

        }

        public static IHostBuilder CreateHostBuilder (string[] args) =>
            Host.CreateDefaultBuilder (args)
            .ConfigureWebHostDefaults (webBuilder =>
            {
                webBuilder.UseKestrel(x => x.AddServerHeader = false); //remove server header to remove info about software being ran on server
                webBuilder.UseStartup<Startup> ();
            });
    }
}