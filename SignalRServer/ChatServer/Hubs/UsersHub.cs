using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatServer.Models;
using Microsoft.AspNetCore.SignalR;

namespace ChatServer
{
    /// <summary>
    /// Avatas Hub
    /// todo: need api to save avatars to db
    /// </summary>
    public class UsersHub : Hub
    {
        // todo: fake Db
        public static List<object> allAvatars = new List<object>();


        /// <summary>
        /// Geting new Avatar
        ///     - share between all
        ///     - TODO: save avatar to db
        /// </summary>
        public void Avatars(object newAvatar)
        {
            allAvatars.Add(newAvatar);
            Clients.All.InvokeAsync("avatars", allAvatars);
        }
    }
}
