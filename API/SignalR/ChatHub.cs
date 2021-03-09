using System;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
  public class ChatHub : Hub
  {
    private readonly IMediator _mediator;
    public ChatHub(IMediator mediator)
    {
      this._mediator = mediator;
    }

    public async Task SendComment(Create.Command command)
    {
        var comment = await _mediator.Send(command);
        // Send new comment to comments group.
        await Clients.Group(command.ActivityId.ToString())
        .SendAsync("ReceiveComment", comment.Value);
    }

    public override async Task OnConnectedAsync()
    {
        // Connect to an activity group.
        var http = Context.GetHttpContext();
        var attId = http.Request.Query["activityId"];
        await Groups.AddToGroupAsync(Context.ConnectionId, attId);
        // Disconnect happens auomatically.
        // Send comments via the socket.
        var res = await _mediator.Send(new List.Query{ ActivityId = Guid.Parse(attId) });
        await Clients.Caller.SendAsync("LoadComments", res.Value);
    }
  }
}