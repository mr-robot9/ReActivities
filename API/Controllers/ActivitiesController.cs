using System.Collections.Generic;
using System.Threading.Tasks;
using ActivitiesHandler = Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Authorization;
using Application.Activities;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List.ActivitiesEnvelope>> List(int? limit, int? offset){
            
            return await Mediator.Send(new List.Query(limit, offset));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityDto>> Details(Guid id){
            //object initialization
            return await Mediator.Send(new ActivitiesHandler.Details.Query {Id = id});
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create([FromBody]ActivitiesHandler.CreateCommand newActivityCommand)
        {
            return await Mediator.Send(newActivityCommand);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Edit(Guid Id, [FromBody]ActivitiesHandler.EditCommand activityToEditCommand)
        {
            //the body will not contain the id, the URL will
            activityToEditCommand.Activity.Id = Id;
            return await Mediator.Send(activityToEditCommand);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Delete(Guid Id)
        {
            return await Mediator.Send(new ActivitiesHandler.Delete.Command {Activity = new Activity {Id = Id}});
        }

        [HttpPost("{id}/attend")]
        public async Task<ActionResult<Unit>> Attend(Guid id)
        {
            return await Mediator.Send(new ActivitiesHandler.Attend.Command { Id = id});
        }

        [HttpDelete("{id}/attend")]
        public async Task<ActionResult<Unit>> Unattend(Guid id)
        {
            return await Mediator.Send(new ActivitiesHandler.Unattend.Command {Id = id});
        }
        
    }
}