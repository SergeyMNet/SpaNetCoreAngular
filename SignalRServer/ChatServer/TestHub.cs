using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ChatServer
{
    public class TestHub : Hub
    {
        public Task IncrementCounter()
        {

            List<String> ConnectionIDToIgnore = new List<String>();
            ConnectionIDToIgnore.Add(Context.ConnectionId);
            return Clients.AllExcept(ConnectionIDToIgnore).InvokeAsync("IncrementCounter");
        }

        public Task DecrementCounter()
        {
            List<String> ConnectionIDToIgnore = new List<String>();
            ConnectionIDToIgnore.Add(Context.ConnectionId);
            return Clients.AllExcept(ConnectionIDToIgnore).InvokeAsync("DecrementCounter");
        }


        // chat
        public void SendToAll(string name, string message)
        {
            Clients.All.InvokeAsync("sendToAll", name, message);
        }
    }
}
