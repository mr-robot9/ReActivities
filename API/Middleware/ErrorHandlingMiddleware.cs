using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly ILogger<ErrorHandlingMiddleware> _logger;
        private readonly RequestDelegate _next;
        public ErrorHandlingMiddleware (RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;

        }

        public async Task InvokeAsync (HttpContext context)
        {
            try
            {
                await _next (context);
            }
            catch (Exception exc)
            {
                await HandleExceptionAsync (context, exc, _logger);
            }
        }

        private async Task HandleExceptionAsync (HttpContext context, Exception exc, ILogger<ErrorHandlingMiddleware> logger)
        {
            Object errors = null;

            switch (exc)
            {
                case RestException re:
                    logger.LogError (exc, "REST ERROR");
                    errors = re.Errors;
                    context.Response.StatusCode = (int) re.StatusCode;
                    break;
                case Exception e:
                    logger.LogError (exc, "SERVER ERROR");
                    errors = string.IsNullOrEmpty (e.Message) ? "Error" : e.Message;
                    context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;
                    break;
            }

            context.Response.ContentType = "application/json";
            if (errors != null)
            {
                var result = JsonSerializer.Serialize( new {
                    errors
                });

                await context.Response.WriteAsync(result);

            }

        }
    }
}