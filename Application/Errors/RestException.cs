using System;
using System.Net;

namespace Application.Errors
{
    public class RestException : Exception
    {
        public HttpStatusCode StatusCode { get; set; }
        public object Errors { get; set; }
        public RestException (HttpStatusCode statusCode, object errors = null)
        {
            this.Errors = errors;
            this.StatusCode = statusCode;

        }
    }
}