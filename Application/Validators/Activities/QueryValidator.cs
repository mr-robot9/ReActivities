using Application.Activities;
using FluentValidation;

namespace Application.Validators.Activities
{
    public class QueryValidator<T> : AbstractValidator<T> where T: Query
    {
        
    }
}