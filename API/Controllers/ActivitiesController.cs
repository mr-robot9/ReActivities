using System.Collections.Generic;
using System.Threading.Tasks;
using ActivitiesHandler = Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ActivitiesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> List(){
            
            return await _mediator.Send(new ActivitiesHandler.List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> Details(Guid id){
            //object initialization
            return await _mediator.Send(new ActivitiesHandler.Details.Query {Id = id});
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create([FromBody]ActivitiesHandler.Create.Command newActivityCommand)
        {
            return await _mediator.Send(newActivityCommand);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid Id, [FromBody]ActivitiesHandler.Edit.Command activityToEditCommand)
        {
            //the body will not contain the id, the URL will
            activityToEditCommand.Activity.Id = Id;
            return await _mediator.Send(activityToEditCommand);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid Id)
        {
            return await _mediator.Send(new ActivitiesHandler.Delete.Command {Activity = new Activity {Id = Id}});
        }
        
    }
}