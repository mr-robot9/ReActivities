using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Handler : IRequestHandler<CreateCommand>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(CreateCommand request, CancellationToken cancellationToken)
            {
                var newActivity = new Activity(request.Activity);

                //not using async method
                _context.Activities.Add(newActivity);
                var IsSuccessful = await _context.SaveChangesAsync() > 0;

                if (IsSuccessful) return Unit.Value;

                throw new Exception("Problem Creating New Activity");

            }
        }
    }
}