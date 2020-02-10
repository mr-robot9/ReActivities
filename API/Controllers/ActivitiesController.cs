using System.Collections.Generic;
using System.Threading.Tasks;
using ActivitiesHandler = Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<Activity>>> List(){
            
            return await Mediator.Send(new ActivitiesHandler.List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> Details(Guid id){
            //object initialization
            return await Mediator.Send(new ActivitiesHandler.Details.Query {Id = id});
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create([FromBody]ActivitiesHandler.CreateCommand newActivityCommand)
        {
            return await Mediator.Send(newActivityCommand);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Edit(Guid Id, [FromBody]ActivitiesHandler.EditCommand activityToEditCommand)
        {
            //the body will not contain the id, the URL will
            activityToEditCommand.Activity.Id = Id;
            return await Mediator.Send(activityToEditCommand);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid Id)
        {
            return await Mediator.Send(new ActivitiesHandler.Delete.Command {Activity = new Activity {Id = Id}});
        }
        
    }
}