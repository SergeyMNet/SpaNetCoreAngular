using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatServer.Models;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace ChatServer.Hubs
{
    /// <summary>
    /// Avatas Hub
    /// todo: need api to save avatars to db
    /// </summary>
    public class UsersHub : Hub
    {
        // todo: fake Db
        public static List<Avatar> allAvatars = new List<Avatar>();


        /// <summary>
        /// Geting new Avatar
        ///     - share between all
        ///     - TODO: save avatar to db
        /// </summary>
        public void add(object newAvatar)
        {
            var json = JsonConvert.SerializeObject(newAvatar);
            Avatar a = JsonConvert.DeserializeObject<Avatar>(json);

            allAvatars.Add(a);
            Clients.All.InvokeAsync("avatars", allAvatars);
        }

        public void remove(object avatar)
        {
            var json = JsonConvert.SerializeObject(avatar);
            Avatar a = JsonConvert.DeserializeObject<Avatar>(json);
            allAvatars.Remove(allAvatars.FirstOrDefault(ava => ava.id == a.id));

            Clients.All.InvokeAsync("avatars", allAvatars);
        }
    }
}
