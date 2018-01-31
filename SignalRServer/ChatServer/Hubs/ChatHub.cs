using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatServer.Models;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace ChatServer
{
    public class ChatHub : Hub
    {
        // todo: fake Db
        public static List<Message> messages = new List<Message>();


        /// <summary>
        /// Geting new Messages
        ///     - share between all
        ///     - TODO: save message to db
        /// </summary>
        public void add(object newMessage)
        {
            Console.WriteLine(newMessage);
            var json = JsonConvert.SerializeObject(newMessage);
            Message m = JsonConvert.DeserializeObject<Message>(json);

            messages.Add(m);
            Clients.All.InvokeAsync("messages", messages);
        }
    }
}
