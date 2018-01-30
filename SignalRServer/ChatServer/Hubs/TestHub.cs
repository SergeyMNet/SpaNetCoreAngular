using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ChatServer
{
    public class TestHub : Hub
    {


        // chat
        public void SendToAll(string name, string message)
        {
            
            //Clients.All.InvokeAsync("sendToAll", res);
        }
    }
}
