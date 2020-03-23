using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private static HashSet<string> hashConnections = new HashSet<string> ();
        private readonly IMediator _mediator;
        public ChatHub (IMediator mediator)
        {
            _mediator = mediator;
        }
        //
        public async Task SendComment (Create.Command command)
        {
            //get claims from token via HUB Context
            //we don't want to send username as a query param or a body bc it would be in plaintext
            //we need to extract from token
            var username = GetUsername ();

            command.Username = username;

            // save to DB
            var comment = await _mediator.Send (command);

            //send comment to any client listening with trigger method called ReceiveComment
            await Clients.Group (command.ActivityId.ToString ()).SendAsync ("ReceiveComment", comment);
        }

        private string GetUsername ()
        {
            return Context.User?.Claims?.FirstOrDefault (x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }

        //client calls this when clicks activity detail
        public async Task AddToGroup (string groupName)
        {
            var connectionKey = $"{Context.ConnectionId}:{groupName}";
            if (!hashConnections.Contains (connectionKey))
            {
                await Groups.AddToGroupAsync (Context.ConnectionId, groupName);
                await Clients.Group (groupName).SendAsync ("Send", $"{GetUsername()} has joined the group");
                hashConnections.Add (connectionKey);

            }

        }
        //called when exits of out of activity detail
        public async Task RemoveFromGroup (string groupName)
        {
            var connectionKey = $"{Context.ConnectionId}:{groupName}";
            await Groups.RemoveFromGroupAsync (Context.ConnectionId, groupName);
            hashConnections.Remove (connectionKey);

            await Clients.Group (groupName).SendAsync ("Send", $"{GetUsername()} has left the group");
        }

    }
}